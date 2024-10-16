#!/bin/bash

# shellcheck disable=SC1091
source scripts/pscale/common.sh

# --- FUNCTIONS ---

function get_open_deploy_requests() {
    local dep_reqs
    dep_reqs=$(pscale deploy-request list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" \
        --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" \
        | jq -r ".[] | select(.state == \"open\") | .branch")
    local status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: failed to retrieve deploy request list"
        exit 1
    fi

    echo "$dep_reqs"
}

function get_closed_pull_requests() {
    local pull_reqs

    pull_reqs=$(gh pr list --state closed --json headRefName | jq -r '.[] | .headRefName')
    local status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: failed to retrieve pull request list"
        exit 1
    fi

    echo "$pull_reqs"
}

function get_common_branches() {
    local open_deploy_requests=$1
    local closed_pull_requests=$2

    echo "$open_deploy_requests" > open_deploy_requests.txt

    # Transform GitHub branch names to match PlanetScale DR names
    while IFS= read -r line; do
        echo "$line" | tr -cd '[:alnum:]-/' | tr '/' '-' | tr '[:upper:]' '[:lower:]'
    done <<< "$closed_pull_requests" > closed_pull_requests.txt

    sort open_deploy_requests.txt -o open_deploy_requests.txt
    sort closed_pull_requests.txt -o closed_pull_requests.txt

    local common_branches
    common_branches=$(comm -12 open_deploy_requests.txt closed_pull_requests.txt)

    rm -f open_deploy_requests.txt closed_pull_requests.txt

    echo "$common_branches"
}

function apply_dep_reqs_for_branches() {
    local branches=$1

    while IFS= read -r branch; do
        if [ -z "$branch" ]; then
            continue
        fi
        echo "Processing deploy request for branch: $branch"

        dr_number=$(pscale deploy-request list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" \
            --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" \
            | jq -r "[.[] | select(.branch == \"$branch\" and .state == \"open\")] | .[0].number")
        local status_code=$?

        if [ "$status_code" -ne 0 ] || [ -z "$dr_number" ]; then
            echo "No open deploy request found for branch: $branch. Skipping..."
            continue
        fi

        # Check for schema changes using 'pscale deploy-request diff'
        diff_output=$(pscale deploy-request diff "$PSCALE_DB_NAME" "$dr_number" -f json --org "$PSCALE_ORG_NAME" \
            --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")
        status_code=$?

        if [ "$status_code" -ne 0 ]; then
            echo "Error: failed to get diff for deploy request #$dr_number"
            exit 1
        fi

        echo "$diff_output" | jq -r '.[] | "- \(.type): \(.name)"'

        diff_count=$(echo "$diff_output" | jq length)

        if [ "$diff_count" -eq 0 ]; then
            echo "No schema changes in deploy request #$dr_number for branch $branch. Closing deploy request."
            pscale deploy-request close "$PSCALE_DB_NAME" "$dr_number" --org "$PSCALE_ORG_NAME" \
                --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"
            status_code=$?
            if [ "$status_code" -ne 0 ]; then
                echo "Error: failed to close deploy request #$dr_number for branch: $branch"
                exit 1
            fi
            continue
        fi

        # Fetch deploy request details
        dr_info=$(pscale deploy-request show "$PSCALE_DB_NAME" "$dr_number" --format json --org "$PSCALE_ORG_NAME" \
            --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")
        status_code=$?

        if [ "$status_code" -ne 0 ]; then
            echo "Error: failed to get info for deploy request #$dr_number"
            exit 1
        fi

        deployment_state=$(echo "$dr_info" | jq -r '.deployment_state')
        deployable=$(echo "$dr_info" | jq -r '.deployment.deployable')
        lint_errors=$(echo "$dr_info" | jq -r '.deployment.lint_errors | length')

        if [ "$deployment_state" != "ready" ] || [ "$deployable" != "true" ] || [ "$lint_errors" -ne 0 ]; then
            echo "Warning: Deploy request #$dr_number for branch $branch has issues that prevent automatic deployment."
            echo "⚠️ Please review the deploy request on planetscale.com to view schema changes, then deploy the changes manually and close the deploy request from the UI."
            echo "  - Deployment State: $deployment_state"
            echo "  - Deployable: $deployable"
            echo "  - Lint Errors Count: $lint_errors"
            # Optionally, display the lint errors
            if [ "$lint_errors" -ne 0 ]; then
                echo "Lint Errors:"
                echo "$dr_info" | jq '.deployment.lint_errors'
            fi
            exit 1
        fi

        # Approve the deploy request
        if [ -n "$CI" ]; then
            pscale deploy-request review --approve --comment "Deploy request approved by GitHub Actions - Commit ID: $GITHUB_SHA" \
                "$PSCALE_DB_NAME" "$dr_number" --org "$PSCALE_ORG_NAME" \
                --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"
        else
            pscale deploy-request review --approve --comment "Deploy request approved by $(git config user.name)" \
                "$PSCALE_DB_NAME" "$dr_number" --org "$PSCALE_ORG_NAME" \
                --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"
        fi
        status_code=$?

        if [ "$status_code" -ne 0 ]; then
            echo "Error: failed to approve deploy request #$dr_number for branch: $branch"
            exit 1
        fi

        # Deploy the deploy request
        pscale deploy-request deploy "$PSCALE_DB_NAME" "$dr_number" --org "$PSCALE_ORG_NAME" \
            --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"
        status_code=$?
        if [ "$status_code" -ne 0 ]; then
            echo "Error: failed to deploy deploy request #$dr_number for branch: $branch"
            exit 1
        fi

        wait_for_deploy_request_merged "$dr_number" || exit $?
        delete_branch "$branch" || exit $?
    done <<< "$branches"
}

# --- MAIN ---
function main() {
    check_for_required_env_vars || exit $?

    local open_deploy_requests
    local closed_pull_requests

    open_deploy_requests=$(get_open_deploy_requests) || exit $?

    closed_pull_requests=$(get_closed_pull_requests) || exit $?

    local common_branches
    common_branches=$(get_common_branches "$open_deploy_requests" "$closed_pull_requests" || exit $?)

    apply_dep_reqs_for_branches "$common_branches" || exit $?
}
main