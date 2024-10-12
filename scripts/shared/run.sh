#!/bin/bash
# This script is used to automatically run commands using onepassword cli
# if the USE_OPCLI environment variable is set to true, otherwise it will
# run the command directly.

# shellcheck disable=SC1091
source scripts/pscale/common.sh

if [[ "$USE_OPCLI" == "true" ]]; then
    echo "Running command with onepassword cli"
    op run --env-file="./.env" -- "$@"
else
    echo "Running command without onepassword cli"
    exec "$@"
fi
