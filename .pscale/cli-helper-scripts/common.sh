#!/bin/bash

if [ -f .env ]; then
    set +o allexport
    # shellcheck disable=SC1091
    source .env
    set -o allexport
fi

# --- GLOBAL VARS --- 
REQUIRED_ENV_VARS=(
    "PLANETSCALE_SERVICE_TOKEN_ID"
    "PLANETSCALE_SERVICE_TOKEN"
)
export PSCALE_DB_NAME="equipped-db"
export PSCALE_ORG_NAME="equipped"

# --- ENVIRONMENT METHODS ---
function check_for_required_env_vars() {
    for env_var in "${REQUIRED_ENV_VARS[@]}"; do
        if [ -z "${!env_var}" ]; then
            echo "Error: Required env variable $env_var is not set. Please add it to your environment or .env file. Exiting..."
            exit 1
        fi
    done
}

function update_var_in_dotenv() {
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
            if ! tail -n 1 .env | grep -q '^$'; then
                printf '\n%s="%s"\n' "$var_name" "$var_value" >> .env
            else
                printf '%s="%s"\n' "$var_name" "$var_value" >> .env
            fi
        fi
    else
        touch .env
        echo "$var_name=$var_value" >> .env
    fi

    cleanup_dotenv .env
}

function cleanup_dotenv() {
    local env_file=$1

    if [ -f .env ]; then
          # Use awk to remove empty lines, but retain the last empty line if it exists
        awk 'NF && !found {print; found=1; next} NF {print}' "$env_file" > temp_env_file
        mv temp_env_file "$env_file"
    fi
}

function remove_credentials_from_dotenv() {
    var_name=$1
    local status_code=""

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # Mac OSX
        sed -i '' "s|^$var_name=.*||" .env

        status_code=$?
        if [ "$status_code" -ne 0 ]; then
            echo "Error: Unable to remove credentials from .env file. Exiting..."
            exit 1
        fi
    else
        # Linux
        sed -i "s|^$var_name=.*||" .env
        
        status_code=$?
        if [ "$status_code" -ne 0 ]; then
            echo "Error: Unable to remove credentials from .env file. Exiting..."
            exit 1
        fi
    fi
}

# --- GIT METHODS ---
function branch_name_from_git() {
    local git_branch_name=""
    if [ -n "$CI" ]; then
       git_branch_name=${GITHUB_REF#refs/heads/}
    else
        git_branch_name=$(git branch --show-current)
    fi

    local PSCALE_BRANCH_NAME=""
    PSCALE_BRANCH_NAME=$(echo "$git_branch_name" | tr -cd '[:alnum:]-/' | tr '/' '-' | tr '[:upper:]' '[:lower:]')

    echo "$PSCALE_BRANCH_NAME"
}


# --- GITHUB METHODS ---
function add_pr_comment() {
    local arg_type=$1 # Either 'file' or 'string'
    local arg_val=$2 # Either the file_path or the string value
    local head_branch=$3 # Optional head branch name
    local status_code=""


    if [ -z "$arg_type" ] || { [ "$arg_type" != 'file' ] && [ "$arg_type" != 'string' ]; }; then
        echo "Error: missing or invalid argument type. Please use the format: add_pr_comment ['file'|'string'] <file_path|str_val> [head_branch (optional)]"
        # exit 1
    fi

    if [ -z "$arg_val" ]; then
        echo "Error: missing argument comment.lease use the format: add_pr_comment ['file'|'string'] <file_path|str_val> [head_branch (optional)]"
        # exit 1
    fi

    if [ -z "$head_branch" ]; then
        head_branch=$(git branch --show-current)
    fi

    local pr_number=""
    pr_number=$(gh pr list -H "$head_branch" -s open -L 1 --json number | jq -r '.[0].number')

    if [ -z "$pr_number" ]; then
        echo "Error: Unable to locate an open pull request for branch $head_branch. Exiting..."
        # exit 1
    fi

    if [ "$arg_type" = 'file' ]; then
        if [ ! -f "$arg_val" ]; then
            echo "Error: File $arg_val does not exist. Exiting..."
            # exit 1
        fi
        gh pr comment "$pr_number" --body-file "$arg_val" >> /dev/null
        status_code=$?

        if [ "$status_code" -ne 0 ]; then
            echo "Error: Unable to add comment to pull request $pr_number. Exiting..."
            # exit 1
        fi
    else
        gh pr comment "$pr_number" --body "$arg_val" >> /dev/null

        status_code=$?
        if [ "$status_code" -ne 0 ]; then
            echo "Error: Unable to add comment to pull request $pr_number. Exiting..."
            # exit 1
        fi
    fi
}


# --- PLANETSCALE METHODS ---
function generate_credentials() {
    branch_name=$1
    cred_name=$2
    local status_code=""

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument new_branch_name. Please use the format: generate_credentials <branch_name> <cred_name>"
        exit 1
    fi

    # If cred name is blank, determine from github or local env
    if [ -z "$cred_name" ]; then
        if [ -n "$CI" ]; then
            if [ -n "$GITHUB_ACTOR" ]; then
                cred_name="github-actions-$GITHUB_ACTOR"
            elif [ -n "$GITHUB_RUN_ID" ]; then
                cred_name="github-actions-$GITHUB_RUN_ID"
            else
                cred_name="github-actions-$RANDOM"
            fi
        else
            git_user_name=$(git config user.name)
            git_user_email=$(git config user.email)
            local_user=$(whoami)
            
            if [ -n "$git_user_name" ]; then
                cred_name="local-dev-$git_user_name"
            elif [ -n "$git_user_email" ]; then
                cred_name="local-dev-$git_user_email"
            elif [ -n "$local_user" ]; then
                cred_name="local-dev-$local_user"
            else
                cred_name="local-dev-$RANDOM"
            fi
        fi
    fi

    # Clean the cred name
    cred_name=$(echo "$cred_name" | tr -cd '[:alnum:]-/' | tr '/' '-' | tr '[:upper:]' '[:lower:]')

    cred_results_raw=$(pscale password create "$PSCALE_DB_NAME" "$branch_name" "$cred_name" --role readwriter --ttl 2592000 --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")

    status_code=$?
    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to create credentials. Exiting..."
        exit 1
    fi

    cred_results_json=$(echo "$cred_results_raw" | tr -d '\000-\031')
    status_code=$?
    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to parse credential results. Exiting..."
        exit 1
    fi


    parsed_url=$(echo "$cred_results_json" | jq -r '. | .connection_strings | .prisma' | grep -o 'url = "[^"]*' | sed 's/url = "//')
    status_code=$?
    if [ "$status_code" -ne 0 ] || [ -z "$parsed_url" ]; then
        echo "Error: Unable to parse credential URL. Exiting..."
        exit 1
    fi
    
    echo "$parsed_url"
}

function delete_credential() {
    branch_name=$1
    credential_id=$2
    local status_code=""

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: delete_credential <branch_name> <credential_id>"
        exit 1
    fi

    if [ -z "$credential_id" ]; then
        echo "Error: missing argument credential_id. Please use the format: delete_credential <branch_name> <credential_id>"
        exit 1
    fi
    
    pscale password delete "$PSCALE_DB_NAME" "$branch_name" "$credential_id" --force --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to delete credential. Exiting..."
        exit 1
    fi
}

function get_dev_branches() {
    local status_code=""

    cur_branches_json=$(pscale branch list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to retrieve branch list. Exiting..."
        exit 1
    fi

    dev_branches=$(echo "$cur_branches_json" | jq -r '.[] | select(.production == false) | .name')
    
    status_code=$?
    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to parse branch list. Exiting..."
        exit 1
    fi

    if [ -z "$dev_branches" ]; then
        echo "No dev branches found. Exiting..."
        exit 1
    fi
    
    echo "$dev_branches"
}

function delete_branch() {
    branch_name=$1
    local status_code=""

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: check_branch_creation_possible <branch_name>"
        exit 1
    fi
    cur_branches_json=$(pscale branch list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to retrieve branch list. Exiting..."
        exit 1
    fi

    matching_branch_cnt=$(echo "$cur_branches_json" | jq -r "[.[] | select(.name == \"$branch_name\")] | length")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to parse branch list. Exiting..."
        exit 1
    fi

    if [ "$matching_branch_cnt" -eq 0 ]; then
        echo "WARNING: Branch $branch_name does not exist. Nothing to do. Exiting..."
        exit 1
    fi
    pscale branch delete "$PSCALE_DB_NAME" "$branch_name" --force --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"
}

function branch_exists() {
    branch_name=$1
    local status_code=""

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: branch_exists <branch_name>"
        exit 1
    fi

    cur_branches_json=$(pscale branch list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to retrieve branch list. Exiting..."
        exit 1
    fi

    matching_branch_cnt=$(echo "$cur_branches_json" | jq -r "[.[] | select(.name == \"$branch_name\")] | length")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to parse branch list. Exiting..."
        exit 1
    fi

    # Return whether or not the matching_brnch_cnt is 0
    if [ "$matching_branch_cnt" -eq 0 ]; then
        echo 1
    else
        echo 0
    fi
}

function check_for_diff() {
    local status_code=""
    local dr_number=$1

    if [ -z "$dr_number" ]; then
        echo "Error: missing argument dr_number. Please use the format: check_for_diff <dr_number>"
        exit 1
    fi

    local results=""
    results=$(pscale deploy-request show "$PSCALE_DB_NAME" "$dr_number" --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: failed to retrieve deploy request $dr_number"
        echo "$results"
        exit 1
    fi

    local deployment_state=""
    deployment_state=$(echo "$results" | jq -r '.deployment_state')

    if [ "$deployment_state" = "no_changes" ]; then
        echo "No changes detected in deploy request $dr_number. Automatically closing deploy request..."
    fi
}

function close_deploy_request() {
    local dr_number=$1
    local reason_for_closing=$2
    local status_code=""

    if [ -z "$dr_number" ]; then
        echo "Error: missing argument dr_number. Please use the format: close_deploy_request <dr_number>"
        exit 1
    fi

    pscale deploy-request close "$PSCALE_DB_NAME" "$dr_number" --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: failed to close deploy request $dr_number"
        exit 1
    fi

    if [ -n "$reason_for_closing" ]; then
        add_pr_comment 'string' ":recycle: Deploy request [$dr_number](https://app.planetscale.com/$PSCALE_ORG_NAME/$PSCALE_DB_NAME/deploy-requests/$dr_number) closed for reason: $reason_for_closin."
    else
        add_pr_comment 'string' ":recycle: Deploy request [$dr_number](https://app.planetscale.com/$PSCALE_ORG_NAME/$PSCALE_DB_NAME/deploy-requests/$dr_number) closed."
    fi
}

function get_dr_number() {
    local branch_name=$1
    local status_code=""

    if [ -z "$branch_name" ]; then
        echo "Error: missing argument branch_name. Please use the format: get_dr_number <branch_name>"
        exit 1
    fi

    local dr_number=""
    dr_number=$(pscale deploy-request list "$PSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r "[.[] | select(.branch == \"$branch_name\")][0].number")

    status_code=$?

    if [ "$status_code" -ne 0 ]; then
        echo "Error: failed to create deploy request for branch $branch_name"
        echo "$results"
        exit 1
    fi

    echo "$dr_number"
}
