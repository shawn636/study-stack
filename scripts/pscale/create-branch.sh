#!/bin/bash

# shellcheck disable=SC1091
source scripts/pscale/common.sh

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
}

function create_branch() {
    new_branch_name=$1
    if [ -z "$new_branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: create_branch <branch_name>"
        exit 1
    fi

    cur_prod_branch=$(pscale branch list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r '.[] | select(.production == true) | .name')

    if [ -z "$cur_prod_branch" ]; then
        echo "Error: Unable to determine current production branch. Exiting..."
        exit 1
    fi

    pscale branch create "$PSCALE_DB_NAME" "$new_branch_name" --from "$cur_prod_branch" --wait --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"

    # Branch creation fails if the branch already exists, but if it already exists, we don't need to do anything, thus exit 0
    return 0
}

# --- MAIN ---
function main() {
    local new_branch_name=""
    local cred_name=""
    local DB_URL=""

    new_branch_name=$(branch_name_from_git) || exit $?

    check_for_required_env_vars || exit $?
    debug_log "required env vars present"
    check_branch_creation_possible "$new_branch_name" || exit $?
    debug_log "checked branch creation possible"

    create_branch "$new_branch_name"
    debug_log "branch created"

    cred_name=$(get_cred_name)
    debug_log "cred name retrieved"

    delete_credential_if_exists "$new_branch_name" "$cred_name"
    debug_log "safely deleted credentials (if they existed)"

    DB_URL=$(generate_credentials "$new_branch_name") || exit $?
    debug_log "credentials generated"

    update_var_in_dotenv "DATABASE_URL" "$DB_URL" || exit $?
    debug_log "db url updated in .env"

    pnpm prisma db push --accept-data-loss || exit $?
    debug_log "db schema pushed"    
    pnpm prisma generate || exit $?
    debug_log "prisma client generated"
    pnpm prisma db seed || exit $?
    debug_log "db seeded"
    pnpm build || exit $?
    debug_log "build successful"
}
main
