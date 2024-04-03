#!/bin/bash

# shellcheck disable=SC1091
source scripts/vercel/common.sh

# --- MAIN ---
function main() {
    check_for_required_env_vars || exit $?
    deploy "preview" || exit $?
}
main