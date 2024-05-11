#!/bin/bash
if [ -f .env ]; then
    set +o allexport
    # shellcheck disable=SC1091
    source .env
    set -o allexport
fi

# shellcheck disable=SC1091
source scripts/shared/github.sh

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

    if [ -f .env ]; then
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
    fi

}

# --- GIT METHODS ---
function branch_name_from_git() {
    local git_branch_name=""
    if [ -n "$CI" ]; then
        git_branch_name=$GITHUB_HEAD_REF
        if [ -z "$git_branch_name" ]; then
            git_branch_name=$GITHUB_REF_NAME
        fi

        if [ "$git_branch_name" = "main" ]; then
            git_branch_name="$git_branch_name-$GITHUB_RUN_ID"
        fi
    else
        git_branch_name=$(git branch --show-current)

        if [ "$git_branch_name" = "main" ]; then
            branch_suffix=$(git config user.email)

            if [ -z "$branch_suffix" ]; then
                branch_suffix=$(git config user.name)
            fi

            git_branch_name="$git_branch_name-$branch_suffix"
        fi
    fi

    local PSCALE_BRANCH_NAME=""
    PSCALE_BRANCH_NAME=$(echo "$git_branch_name" | tr -cd '[:alnum:]-/' | tr '/' '-' | tr '[:upper:]' '[:lower:]')

    echo "$PSCALE_BRANCH_NAME"
}

# --- PLANETSCALE METHODS ---
function get_cred_name() {
    local cred_name=""
    if [ -n "$CI" ]; then
        if [ -n "$GITHUB_ACTOR" ]; then
            cred_name="ga-$GITHUB_ACTOR"
        elif [ -n "$GITHUB_RUN_ID" ]; then
            cred_name="ga-$GITHUB_RUN_ID"
        else
            cred_name="ga-$RANDOM"
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

    echo "$cred_name" | tr -cd '[:alnum:]-/' | tr '/' '-' | tr '[:upper:]' '[:lower:]'
}

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
        cred_name=$(get_cred_name)
    fi

    # Clean the cred name
    cred_name=$(echo "$cred_name" | tr -cd '[:alnum:]-/' | tr '/' '-' | tr '[:upper:]' '[:lower:]')

    parsed_url=$(pscale password create "$PSCALE_DB_NAME" "$branch_name" "$cred_name" --role admin --ttl 2592000 --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq -r ". | (\"mysql://\" + .username + \":\" + .plain_text + \"@\" + .access_host_url + \"/$PSCALE_DB_NAME?sslaccept=strict\")")

    status_code=$?
    if [ "$status_code" -ne 0 ]; then
        echo "Error: Unable to create credentials. Exiting..."
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

function delete_credential_if_exists() {
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

    # Ignore if password deleting fails, as it may not exist
    exit 0
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
        add_pr_comment 'string' ":recycle: Deploy request [$dr_number](https://app.planetscale.com/$PSCALE_ORG_NAME/$PSCALE_DB_NAME/deploy-requests/$dr_number) closed for reason: $reason_for_closing."
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

function wait_for_deploy_request_merged() {
    local retries=3
    local max_timeout=600
    local dr_number=$1

    local count=0
    local wait=1

    echo "Checking if deploy request $dr_number is ready for use..."
    while true; do
        # local raw_output=`pscale deploy-request list "$db" --org "$org" --format json`
        local deployment_state
        local status_code

        deployment_state=$(pscale deploy-request list "$PLANETSCALE_DB_NAME" --format json --org "$PSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID" | jq ".[] | select(.number == $dr_number) | .deployment.state")
        status_code=$?

        if [ $status_code -ne 0 ]; then
            echo "Error: pscale deploy-request list returned non-zero exit code $status_code. Exiting..."
            return 1
        fi

        # test whether output is pending, if so, increase wait timeout exponentially
        if [ "$deployment_state" = "\"pending\"" ] || [ "$deployment_state" = "\"in_progress\"" ] || [ "$deployment_state" = "\"submitting\"" ]; then

            # increase wait variable exponentially but only if it is less than max_timeout
            if [ $((wait * 2)) -le $max_timeout ]; then
                wait=$((wait * 2))
            else
                wait=$max_timeout
            fi

            count=$((count + 1))
            if [ $count -ge $retries ]; then
                echo "Deploy request $dr_number is not ready after $retries retries. Exiting..."
                exit 2
            fi
            echo "Deploy-request $dr_number is not deployed yet. Current status:"
            echo "show vitess_migrations\G" | pscale shell "$PLANETSCALE_DB_NAME" main --org "$PLANETSCALE_ORG_NAME" --service-token "$PLANETSCALE_SERVICE_TOKEN" --service-token-id "$PLANETSCALE_SERVICE_TOKEN_ID"
            echo "Retrying in $wait seconds..."
            sleep $wait
        elif [ "$deployment_state" = "\"complete\"" ] || [ "$deployment_state" = "\"complete_pending_revert\"" ]; then
            echo "Deploy-request $dr_number has been deployed successfully."
            exit 0
        else
            echo "Deploy-request $dr_number with unknown status: $deployment_state. Exiting..."
            exit 3
        fi
    done
}
