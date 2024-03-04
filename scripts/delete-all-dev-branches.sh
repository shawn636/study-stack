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

function get_dev_branches() {
    cur_branches_json=$(pscale branch list "$PSCALE_DB_NAME" --format json)
    dev_branches=$(echo "$cur_branches_json" | jq -r '.[] | select(.production == false) | .name')
    echo "$dev_branches"
}

function delete_branch() {
    branch_name=$1

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: check_branch_creation_possible <branch_name>"
        exit 1
    fi
    cur_branches_json=$(pscale branch list "$PSCALE_DB_NAME" --format json)
    matching_branch_cnt=$(echo "$cur_branches_json" | jq -r "[.[] | select(.name == \"$branch_name\")] | length")

    if [ "$matching_branch_cnt" -eq 0 ]; then
        echo "WARNING: Branch $branch_name does not exist. Nothing to do. Exiting..."
        exit 1
    fi
    pscale branch delete "$PSCALE_DB_NAME" "$branch_name" --force
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

# --- MAIN ---
function main() {
    check_for_required_env_vars
    dev_branches=$(get_dev_branches)

    for branch in $dev_branches; do
        delete_branch "$branch"
    done
    remove_credentials_from_dotenv "DATABASE_URL"
}
main