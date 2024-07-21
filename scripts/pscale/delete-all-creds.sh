#!/bin/bash

# shellcheck disable=SC1091
source scripts/pscale/common.sh

# --- FUNCTIONS ---
function get_credential_ids() {
    branch_name=$1
    local status_code=""

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: check_branch_creation_possible <branch_name>"
        exit 0
    fi

    credential_ids=$(pscale password list "$PSCALE_DB_NAME" "$branch_name" --format=json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r '.[] | .id')

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to retrieve credential list. Exiting..."
        exit 1
    fi

    echo "$credential_ids"
}

# --- MAIN ---
function main() {
    check_for_required_env_vars || exit $?
    PSCALE_BRANCH_NAME=$(branch_name_from_git) || exit $?

    if [ "$(branch_exists "$PSCALE_BRANCH_NAME")" -eq 0 ]; then
        credential_ids=$(get_credential_ids "$PSCALE_BRANCH_NAME") || exit $?

        for credential_id in $credential_ids; do
            delete_credential "$PSCALE_BRANCH_NAME" "$credential_id" || exit $?
        done
        cleanup_dotenv .env || exit $?
    fi

}
main
