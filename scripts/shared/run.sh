#!/bin/bash
# This script is used to automatically run commands using onepassword cli
# if the USE_OPCLI environment variable is set to true, otherwise it will
# run the command directly.

# shellcheck disable=SC1091
source scripts/pscale/common.sh

if [[ "$USE_OPCLI" == "true" ]]; then
    echo "Running command with onepassword cli"

    # CHECK IF IN GITHUB ACTIONS
    if [[ -n "$CI" ]]; then
        op run -- "$@"
    else
        # shellcheck disable=SC2143
        if [[ ! -f "./.env" || $(grep -q 'op://' .env) ]]; then
            echo "Please generate the .env file using: op inject -i .env.op -o .env"
            exit 1
        fi
        exec "$@"
    fi
else
    echo "Running command without onepassword cli"
    exec "$@"
fi
