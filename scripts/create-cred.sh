#!/bin/bash

if [ -f .env ]; then
    set +o allexport
    source .env
    set -o allexport
fi

# Script Arguments
cred_name=$1

if [ -z "$cred_name" ]; then
    cred_name=$(git config user.email | tr -cd '[:alnum:]-' | tr '[:upper:]' '[:lower:]')
    if [ -z "$cred_name" ]; then
        cred_name="local_dev_user"
    fi
fi

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
function delete_cred_if_exists() {
    branch_name=$1
    cred_name=$2

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: check_cred_creation_possible <branch_name> <cred_name>"
        exit 1
    fi

    if [ -z "$cred_name" ]; then
        echo "Error: missing argument cred_name. Please use the format: check_cred_creation_possible <branch_name> <cred_name>"
        exit 1
    fi

    cur_creds_json=$(pscale password list "$PSCALE_DB_NAME" "$branch_name" --format json)
    matching_cred_id=$(echo "$cur_creds_json" | jq -r ".[] | select(.name == \"$cred_name\") | .id")

    if [ -n "$matching_cred_id" ]; then
        pscale password delete "$PSCALE_DB_NAME" "$branch_name" "$matching_cred_id" --force
    fi
}

function get_cred_id() {
    branch_name=$1
    cred_name=$2

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: check_cred_creation_possible <branch_name> <cred_name>"
        exit 1
    fi

    if [ -z "$cred_name" ]; then
        echo "Error: missing argument cred_name. Please use the format: check_cred_creation_possible <branch_name> <cred_name>"
        exit 1
    fi

    cur_creds_json=$(pscale password list "$PSCALE_DB_NAME" "$branch_name" --format json)
    matching_cred_id=$(echo "$cur_creds_json" | jq -r ".[] | select(.name == \"$cred_name\") | .id")

    if [ -z "$matching_cred_id" ]; then
        echo "Error: Credential $cred_name does not exist. Exiting..."
        exit 1
    fi

    echo "$matching_cred_id"
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

function generate_credentials() {
    new_branch_name=$1
    cred_name=$2
    if [ -z "$new_branch_name" ]; then
        echo "Error: missing argument new_branch_name. Please use the format: generate_credentials <new_branch_name>"
        exit 1
    fi

    if [ -z "$cred_name" ]; then
        echo "Error: missing argument cred_name. Please use the format: generate_credentials <new_branch_name> <cred_name>"
        exit 1
    fi

    cred_results_raw=$(pscale password create "$PSCALE_DB_NAME" "$new_branch_name" "$cred_name" --ttl 2592000 --format json)
    cred_results_json=$(echo "$cred_results_raw" | tr -d '\000-\031')
    parsed_url=$(echo "$cred_results_json" | jq -r '. | .connection_strings | .prisma' | grep -o 'url = "[^"]*' | sed 's/url = "//')
    echo "$parsed_url"
}

# --- MAIN ---
function main() {
    cred_name=$1
    new_branch_name=$(branch_name_from_git)

    check_for_required_env_vars
    delete_cred_if_exists "$new_branch_name" "$cred_name" 
    cred=$(generate_credentials "$new_branch_name" "$cred_name")
    cred_id=$(get_cred_id "$new_branch_name" "$cred_name")
    update_var_in_dotenv "DATABASE_URL" "$cred"
    printf "Password \033[31m%s\033[0m was successfully generated for \033[32m%s\033[0m\n" "$cred_id" "$new_branch_name"
}
main "$cred_name"