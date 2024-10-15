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
        op run --env-file="./.env" -- "$@"
    fi
else
    echo "Running command without onepassword cli"
    exec "$@"
fi
