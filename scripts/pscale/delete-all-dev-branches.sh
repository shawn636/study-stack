#!/bin/bash

# shellcheck disable=SC1091
source scripts/pscale/common.sh

# --- FUNCTIONS ---

# Nothing to see here

# --- MAIN ---
function main() {
    check_for_required_env_vars || exit $?
    dev_branches=$(get_dev_branches) || exit $?

    for branch in $dev_branches; do
        delete_branch "$branch" || exit $?
    done
    remove_credentials_from_dotenv "DATABASE_URL" || exit $?
    cleanup_dotenv .env || exit $?
}
main