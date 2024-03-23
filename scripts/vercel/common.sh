#!/bin/bash

# shellcheck disable=SC1091
source scripts/shared/github.sh

REQUIRED_ENV_VARS=(
    "VERCEL_TOKEN"
    "DATABASE_URL" # Must already have been set to properly build and deploy
)

export VERCEL_SCOPE="equipped-team"

if [ -f .env ]; then
    set +o allexport
    # shellcheck disable=SC1091
    source .env
    set -o allexport
fi

function check_for_required_env_vars() {
    for env_var in "${REQUIRED_ENV_VARS[@]}"; do
        if [ -z "${!env_var}" ]; then
            echo "Error: Required env variable $env_var is not set. Please add it to your environment or .env file. Exiting..."
            exit 1
        fi
    done
}

function build() {
    pnpm exec vercel pull --yes --scope "$VERCEL_SCOPE" --token "$VERCEL_TOKEN" || exit $?
}


function deploy() {
    local deployment_target=${1:-preview}
    local url_file='deployment-url.txt'
    local log_file='error-log.txt'

    if [ "$deployment_target" != "production" ] && [ "$deployment_target" != "preview" ]; then
        echo "Error: deployment target must be either 'production' or 'preview'. Exiting..."
        exit 1
    fi

    if [ ! -d ".vercel" ]; then
        echo "Error: .vercel directory not found. Exiting..."
        exit 1
    fi

    if [ "$deployment_target" = "production" ]; then
        echo "Deploying to production..."
        pnpm exec vercel deploy --archive=tgz --prod --yes --scope "$VERCEL_SCOPE" --token "$VERCEL_TOKEN" > "$url_file" 2> "$log_file"
    else
        echo "Deploying preview..."
        pnpm exec vercel deploy --archive=tgz --yes --scope "$VERCEL_SCOPE" --token "$VERCEL_TOKEN" > "$url_file" 2> "$log_file"
    fi

    local code=$?
    if [ $code -eq 0 ]; then
        deployment_url=$(cat "$url_file")
        add_pr_comment 'string' ":white_check_mark: Successfully deployed to Vercel. [View deployment]($deployment_url)" || exit $?
        echo "Successfully deployed to Vercel. [View deployment]($deployment_url)"
    else
        error_log=$(cat "$log_file")
        add_pr_comment 'string' ":rotating_light: Error: failed to deploy to Vercel. $error_log" || exit $?
        echo "Error: failed to deploy to Vercel. $error_log"
        exit $code
    fi
    if [ -f "$url_file" ]; then
        rm "$url_file" || exit $?
    fi
    if [ -f "$log_file" ]; then
        rm "$log_file" || exit $?
    fi
}

function add_secret() {
    local secret_name=${1}
    local secret_value=${2}
    local environment=${3}

    if [ -z "$secret_name" ] || [ -z "$secret_value" ]; then
        echo "Error: secret_name and secret_value must be provided. Exiting..."
        exit 1
    fi

    if [ -z "$environment" ]; then
        echo "Error: environment (preview or production) must be provided. Exiting..."
        exit 1
    fi

    # Try to delete the secret first in case it already exists
    pnpm exec vercel env rm "$secret_name" "$environment" --yes --scope "$VERCEL_SCOPE" --token "$VERCEL_TOKEN" || true
    
    echo "$secret_value" | pnpm exec vercel env add "$secret_name" "$environment" --sensitive --yes --scope "$VERCEL_SCOPE" --token "$VERCEL_TOKEN"
}