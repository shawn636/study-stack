#!/bin/bash

# shellcheck disable=SC1091
source scripts/pscale/common.sh

# --- FUNCTIONS ---
function create_deploy_request() {
    branch_name=$1
    local status_code=""

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: create_deploy_request <branch_name>"
        exit 1
    fi
    local results=""
    pscale deploy-request create "$PSCALE_DB_NAME" "$branch_name" --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: failed to create deploy request for branch $branch_name"
        echo "$results"
        exit 1
    fi

    # Wait for deploy request to be created
    # Without this, weird errors about the branch not existing show up
    # This is most likely due to the fact that the branch is not yet available
    # Once PlanetScale comes out with a fix for this, this can be removed
    sleep 5

    local dr_number=""
    dr_number=$(get_dr_number "$branch_name")

    status_code=$?

    if [ "$status_code" -ne 0 ] || [ -z "$dr_number" ]; then
        echo "Error: failed to retrieve deploy request number for branch $branch_name"
        exit 1
    fi

    # Wait for deploy request to be created
    # Without this, weird errors about the branch not existing show up
    # This is most likely due to the fact that the branch is not yet available
    # Once PlanetScale comes out with a fix for this, this can be removed
    sleep 5

    local diff=""
    diff=$(pscale deploy-request diff "$PSCALE_DB_NAME" "$dr_number" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")

    status_code=$?
    if [ "$status_code" -ne 0 ]; then
        echo "Error: failed to get diff for branch $branch_name"
        echo "$diff"
        exit 1
    fi

    if [ -f migration-message.txt ]; then
        rm migration-message.txt
    fi

    # shellcheck disable=SC2129
    echo ":white_check_mark: Created new PlanetScale Deploy request [$dr_number](https://app.planetscale.com/$PSCALE_ORG_NAME/$PSCALE_DB_NAME/deploy-requests/$dr_number)." >> migration-message.txt
    echo "" >> migration-message.txt

    if [ "$diff" = "[]" ]; then

        echo "No migration changes detected. Auto-closing deploy request."

        add_pr_comment 'file' 'migration-message.txt'

        status_code=$?
        if [ "$status_code" -ne 0 ]; then
            echo "Error: failed to add comment to pull request"
            exit 1
        fi

        local dr_comment="No migration changes detected. Auto-closing deploy request."
        pscale deploy-request review "$PSCALE_DB_NAME" "$dr_number" --comment "$dr_comment" --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"

        status_code=$?
        if [ "$status_code" -ne 0 ]; then
            echo "Error: failed to close deploy request $dr_number"
            exit 1
        fi


        close_deploy_request "$dr_number" "No migration changes detected"
        
        status_code=$?
        if [ "$status_code" -ne 0 ]; then
            echo "Error: failed to close deploy request $dr_number"
            exit 1
        fi

    else
         # shellcheck disable=SC2129
        echo "\`\`\`diff" >> migration-message.txt
        pscale deploy-request diff "$PSCALE_DB_NAME" "$dr_number"  --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r '.[].raw' >> migration-message.txt
        echo "\`\`\`" >> migration-message.txt

        add_pr_comment 'file' 'migration-message.txt'
    fi

    if [ -f migration-message.txt ]; then
        rm migration-message.txt
    fi
}

function get_open_dr_cnt() {
    local branch_name=$1

    local matching_dr_count=0
    matching_dr_count=$(pscale deploy-request list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r "[[.[] | select(.state == 'open')] | .[] | select(.branch == \"$branch_name\")] | length")
    local status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: failed to retrieve deploy request list"
        exit 1
    fi

    echo "$matching_dr_count"
}

# --- MAIN ---
function main() {
    check_for_required_env_vars || exit $?
    local branch_name=""
    branch_name=$(branch_name_from_git) || exit $?

    local open_dr_cnt=0
    open_dr_cnt=get_open_dr_cnt "$branch_name" || exit $?

    if [ "$open_dr_cnt" -eq 0 ]; then
        create_deploy_request "$branch_name"
    fi
}
main