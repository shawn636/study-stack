#!/bin/bash

# shellcheck disable=SC1091
source scripts/pscale/common.sh

# Script Arguments
cred_name=$1


# --- FUNCTIONS ---
function delete_cred_if_exists() {
    branch_name=$1
    cred_name=$2
    local status_code=""

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: check_cred_creation_possible <branch_name> <cred_name>"
        exit 1
    fi

    if [ -z "$cred_name" ]; then
        echo "Error: missing argument cred_name. Please use the format: check_cred_creation_possible <branch_name> <cred_name>"
        exit 1
    fi

    cur_creds_json=$(pscale password list "$PSCALE_DB_NAME" "$branch_name" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")
    
    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to retrieve credential list. Exiting..."
        exit 1
    fi

    matching_cred_id=$(echo "$cur_creds_json" | jq -r ".[] | select(.name == \"$cred_name\") | .id")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to parse credential list. Exiting..."
        exit 1
    fi

    if [ -n "$matching_cred_id" ]; then
        pscale password delete "$PSCALE_DB_NAME" "$branch_name" "$matching_cred_id" --force --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"
        
        status_code=$?

        if [ "$status_code" -ne 0 ]; then
            echo "Error: Unable to delete credential. Exiting..."
            exit 1
        fi
    fi
}

function get_cred_id() {
    branch_name=$1
    cred_name=$2
    local status_code=""

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: check_cred_creation_possible <branch_name> <cred_name>"
        exit 1
    fi

    if [ -z "$cred_name" ]; then
        echo "Error: missing argument cred_name. Please use the format: check_cred_creation_possible <branch_name> <cred_name>"
        exit 1
    fi

    cur_creds_json=$(pscale password list "$PSCALE_DB_NAME" "$branch_name" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to retrieve credential list. Exiting..."
        exit 1
    fi

    matching_cred_id=$(echo "$cur_creds_json" | jq -r ".[] | select(.name == \"$cred_name\") | .id")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to parse credential list. Exiting..."
        exit 1
    fi

    if [ -z "$matching_cred_id" ]; then
        echo "Error: Credential $cred_name does not exist. Exiting..."
        exit 1
    fi

    echo "$matching_cred_id"
}

function purge_old_production_credentials() {
    local current_cred_id=$1

    if [ -z "$current_cred_id" ]; then
        echo "Error: missing argument current_cred_id. Please use the format: purge_old_production_credentials <current_cred_id>"
        exit 1
    fi

    credential_ids=$(pscale password list "$PSCALE_DB_NAME" "main" --format=json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r "[.[] | select(.id != \"$current_cred_id\")] | .[] | .id")

    for credential_id in $credential_ids; do
            delete_credential "main" "$credential_id" || exit $?
    done
}

# --- MAIN ---
function main() {
    local cred_name=$1
    local new_branch_name=""

    local is_main=false

    if { [ -z "$CI" ] && [ "$(git branch --show-current)" = "main" ]; } || { [ -n "$CI" ] && [ "$GITHUB_REF_NAME" = "main" ]; }; then
        is_main=true
    fi

    if $is_main; then
        new_branch_name="main"
    else
        new_branch_name=$(branch_name_from_git) || exit $?
    fi

    check_for_required_env_vars || exit $?
    delete_cred_if_exists "$new_branch_name" "$cred_name" || exit $?
    cred=$(generate_credentials "$new_branch_name" "$cred_name") || exit $?
    cred_id=$(get_cred_id "$new_branch_name" "$cred_name") || exit $?

    update_var_in_dotenv "DATABASE_URL" "$cred" || exit $?
    printf "Password \033[31m%s\033[0m was successfully generated for \033[32m%s\033[0m\n" "$cred_id" "$new_branch_name" || exit $?

    if $is_main; then
        purge_old_production_credentials "$cred_id" || exit $?
    fi
}
main "$cred_name"