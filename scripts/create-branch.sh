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

    if [ "$PSCALE_BRANCH_NAME" == "main" ]; then
        git_user=$(git config user.email | tr -cd '[:alnum:]-' | tr '[:upper:]' '[:lower:]')
        if [ -z "$git_user" ]; then
            PSCALE_BRANCH_NAME="$PSCALE_BRANCH_NAME-$RANDOM"
        else
            PSCALE_BRANCH_NAME="$PSCALE_BRANCH_NAME-$git_user"
        fi
    fi

    echo "$PSCALE_BRANCH_NAME"
}

function check_branch_creation_possible() {
    new_branch_name=$1

    if [ -z "$new_branch_name" ]; then
        echo "Error: missing argument new_branch_name. Please use the format: check_branch_creation_possible <new_branch_name>"
        exit 1
    fi

    cur_branches_json=$(pscale branch list "$PSCALE_DB_NAME" --format json)
    dev_branch_cnt=$(echo "$cur_branches_json" | jq -r '[.[] | select(.production == false)] | length')
    dev_branch_names=$(echo "$cur_branches_json" | jq -r '.[] | select(.production == false) | .name' | tr '\n' ' ')
    dev_branch_name=$(echo "$cur_branches_json" | jq -r '.[] | select(.production == false) | .name' | head -n 1)

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

update_var_in_dotenv() {
    var_name=$1
    var_value=$2

    if [ -z "$var_name" ]; then
        echo "Error: missing argument var_name. Please use the format: update_var_in_dotenv <var_name> <var_value>"
        exit 1
    elif [ -z "$var_value" ]; then
        echo "Error: missing argument var_value. Please use the format: update_var_in_dotenv <var_name> <var_value>"
        exit 1
    fi

    if [ -f .env ]; then
        if grep -q "^$var_name=" .env; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # Mac OSX
                sed -i '' "s|^$var_name=.*|$var_name=\"$var_value\"|" .env
            else
                # Linux
                sed -i "s|^$var_name=.*|$var_name=\"$var_value\"|" .env
            fi
        else
            if [ -z "$(tail -n 1 .env | grep '^$')" ]; then
                printf '\n%s="%s"\n' "$var_name" "$var_value" >> .env
            else
                printf '%s="%s"\n' "$var_name" "$var_value" >> .env
            fi
        fi
    else
        touch .env
        echo "$var_name=$var_value" >> .env
    fi
}

function create_branch() {
    new_branch_name=$1
    if [ -z "$new_branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: create_branch <branch_name>"
        exit 1
    fi

    cur_prod_branch=$(pscale branch list "$PSCALE_DB_NAME" --format json | jq -r '.[] | select(.production == true) | .name')
    latest_successful_backup=$(pscale backup list "$PSCALE_DB_NAME" "$cur_prod_branch" --format json | jq -r 'sort_by(.completed_at) | reverse | .[] | select(.state == "success") | .id' | head -n 1)

    pscale branch create "$PSCALE_DB_NAME" "$new_branch_name" --from "$cur_prod_branch" --restore "$latest_successful_backup" --wait
}

function generate_credentials() {
    new_branch_name=$1
    if [ -z "$new_branch_name" ]; then
        echo "Error: missing argument new_branch_name. Please use the format: generate_credentials <new_branch_name>"
        exit 1
    fi
    
    cred_name=$(git config user.email | tr -cd '[:alnum:]-' | tr '[:upper:]' '[:lower:]')
    if [ -z "$cred_name" ]; then
        cred_name="local_dev_user"
    fi
    cred_results_raw=$(pscale password create "$PSCALE_DB_NAME" "$new_branch_name" "$cred_name" --ttl 2592000 --format json)
    cred_results_json=$(echo "$cred_results_raw" | tr -d '\000-\031')
    parsed_url=$(echo "$cred_results_json" | jq -r '. | .connection_strings | .prisma' | grep -o 'url = "[^"]*' | sed 's/url = "//')
    echo "$parsed_url"
}

# --- MAIN ---
function main() {
    new_branch_name=$(branch_name_from_git)

    check_for_required_env_vars
    check_branch_creation_possible "$new_branch_name"

    create_branch "$new_branch_name"
    update_var_in_dotenv "DATABASE_URL" "$(generate_credentials "$new_branch_name")"
    pnpm prisma db seed
}
main