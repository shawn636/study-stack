#!/bin/bash

# shellcheck disable=SC1091
source scripts/pscale/common.sh

# --- FUNCTIONS ---


function get_open_deploy_requests() {
    local dep_reqs
    dep_reqs=$(pscale deploy-request list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r ".[] | select(.state == \"open\") | .branch")
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

    # Transform github branch names to match planet scale dr names
    while IFS= read -r line; do
        echo "$line" | tr -cd '[:alnum:]-/' | tr '/' '-' | tr '[:upper:]' '[:lower:]'=
        echo ""c
    done <<< "$closed_pull_requests" > closed_pull_requests.txt

    sort open_deploy_requests.txt -o open_deploy_requests.txt
    sort closed_pull_requests.txt -o closed_pull_requests.txt

    local common_branches
    common_branches=$(comm -12 open_deploy_requests.txt closed_pull_requests.txt)

    if [ -f open_deploy_requests.txt ]; then rm open_deploy_requests.txt; fi
    if [ -f closed_pull_requests.txt ]; then m closed_pull_requests.txt; fi

    echo "$common_branches"
}

function apply_dep_reqs_for_branches() {
    local branches=$1

    while IFS= read -r branch; do
        echo "Applying deploy request for branch: $branch"

        dr_number=$(pscale deploy-request list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r "[.[] | select(.branch == \"$branch\")] | .[] | select(.state == \"open\") | .number")
        local status_code=$?

        if [ "$status_code" -ne 0 ]; then
            echo "Error: failed to determine dr number for branch: $branch"
            exit 1
        fi

        if [ -n "$dr_number" ]; then
            pscale deploy-request apply "$PSCALE_DB_NAME" "$dr_number" --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"
            local status_code=$?

            if [ "$status_code" -ne 0 ]; then
                echo "Error: failed to apply deploy request for branch: $branch"
                exit 1
            fi

            delete_branch "$branch" || exit $?
        else
            echo "No open deploy request found for branch: $branch. Skipping..."
        fi

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