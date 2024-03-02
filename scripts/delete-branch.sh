#!/bin/bash

set +o allexport
source .env
set -o allexport

# --- GLOABL VARS ---
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

function verify_on_git_feature_branch() {
    cur_git_branch=$(git branch --show-current)
    
    if [ "$cur_git_branch" == "main" ]; then
        echo "Error: You must be on a feature branch to run this command. Exiting..."
        exit 1
    fi
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
    new_branch_name=$(branch_name_from_git)

    check_for_required_env_vars
    verify_on_git_feature_branch
    delete_branch "$new_branch_name"
    remove_credentials_from_dotenv "DATABASE_URL"
}
main