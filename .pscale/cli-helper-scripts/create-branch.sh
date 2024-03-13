#!/bin/bash

# shellcheck disable=SC1091
source .pscale/cli-helper-scripts/common.sh

# --- FUNCTIONS ---

function check_branch_creation_possible() {
    new_branch_name=$1
    local status_code=""

    if [ -z "$new_branch_name" ]; then
        echo "Error: missing argument new_branch_name. Please use the format: check_branch_creation_possible <new_branch_name>"
        exit 1
    fi

    cur_branches_json=$(pscale branch list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to retrieve branch list. Exiting..."
        exit 1
    fi

    dev_branch_cnt=$(echo "$cur_branches_json" | jq -r '[.[] | select(.production == false)] | length')

    status_code=$?
    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to parse branch list. Exiting..."
        exit 1
    fi

    dev_branch_names=$(echo "$cur_branches_json" | jq -r '.[] | select(.production == false) | .name' | tr '\n' ' ')
    status_code=$?
    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to parse branch list. Exiting..."
        exit 1
    fi

    dev_branch_name=$(echo "$cur_branches_json" | jq -r '.[] | select(.production == false) | .name' | head -n 1)
    status_code=$?
    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to parse branch list. Exiting..."
        exit 1
    fi

    # if branch_cnt eq 1 and branch_name eq current branch name, exit 0 because nothing to do
    if [ "$dev_branch_cnt" -eq 1 ] && [ "$dev_branch_name" == "$(branch_name_from_git)" ]; then
        echo " Database Branch $(branch_name_from_git) already exists. Nothing to do. Exiting..."
        exit 0
    fi

    # if branch_cnt gt 0 exit 1 because max 1 dev branch cap reached
    if [ "$dev_branch_cnt" -gt 0 ]; then
        echo "Error: Maximum number of database branches reached. Please delete a branch before creating a new one."
        echo "Existing branches: $dev_branch_names"
        exit 1
    fi
}

function create_branch() {
    new_branch_name=$1
    if [ -z "$new_branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: create_branch <branch_name>"
        exit 1
    fi

    cur_prod_branch=$(pscale branch list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r '.[] | select(.production == true) | .name')
    latest_successful_backup=$(pscale backup list "$PSCALE_DB_NAME" "$cur_prod_branch" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r 'sort_by(.completed_at) | reverse | .[] | select(.state == "success") | .id' | head -n 1)

    if [ -z "$cur_prod_branch" ]; then
        echo "Error: Unable to determine current production branch. Exiting..."
        exit 1
    fi

    if [ -z "$latest_successful_backup" ]; then
        echo "Error: Unable to determine latest successful backup. Exiting..."
        exit 1
    fi

    pscale branch create "$PSCALE_DB_NAME" "$new_branch_name" --from "$cur_prod_branch" --restore "$latest_successful_backup" --wait --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"
}

# --- MAIN ---
function main() {
    new_branch_name=$(branch_name_from_git) || exit $?

    check_for_required_env_vars || exit $?
    check_branch_creation_possible "$new_branch_name" || exit $?

    create_branch "$new_branch_name" || exit $?

    DB_URL=$(generate_credentials "$new_branch_name") || exit $?
    update_var_in_dotenv "DATABASE_URL" "$DB_URL" || exit $?
    pnpm build || exit $?
    pnpm prisma generate || exit $?
    pnpm prisma db seed || exit $?
}
main