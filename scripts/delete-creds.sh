#!/bin/bash

set +o allexport
source .env
set -o allexport

# --- GLOBAL VARS ---
REQUIRED_ENV_VARS=(
    "PLANETSCALE_SERVICE_TOKEN_ID"
    "PLANETSCALE_SERVICE_TOKEN"
)
PSCALE_DB_NAME="equipped-db"

# --- FUNCTIONS ---
function check_for_required_env_vars() {
    for env_var in "${REQUIRED_ENV_VARS[@]}"; do
        if [ -z "${!env_var}" ]; then
            echo "Error: Required env variable $env_var is not set. Please add it to your environment or .env file. Exiting..."
            exit 1
        fi
    done
}

function branch_name_from_git() {
    PSCALE_BRANCH_NAME=$(git branch --show-current | tr -cd '[:alnum:]-' | tr '[:upper:]' '[:lower:]')
    echo $PSCALE_BRANCH_NAME
}

function remove_credentials_from_dotenv() {
    var_name=$1
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # Mac OSX
        sed -i '' "s|^$var_name=.*||" .env
    else
        # Linux
        sed -i "s|^$var_name=.*||" .env
    fi
}

function get_credential_ids() {
    branch_name=$1

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: check_branch_creation_possible <branch_name>"
        exit 1
    fi

    credential_ids=$(pscale password list equipped-db "$branch_name" --format=json | jq -r '.[] | .id')
    echo "$credential_ids"
}

function delete_credential() {
    branch_name=$1
    credential_id=$2

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: delete_credential <branch_name> <credential_id>"
        exit 1
    fi

    if [ -z "$credential_id" ]; then
        echo "Error: missing argument credential_id. Please use the format: delete_credential <branch_name> <credential_id>"
        exit 1
    fi
    
    pscale password delete "$PSCALE_DB_NAME" "$branch_name" "$credential_id" --force
}

# --- MAIN ---
function main() {
    check_for_required_env_vars
    PSCALE_BRANCH_NAME=$(branch_name_from_git)
    credential_ids=$(get_credential_ids "$PSCALE_BRANCH_NAME")

    for credential_id in $credential_ids; do
        delete_credential "$PSCALE_BRANCH_NAME" "$credential_id"
    done
}
main