#!/bin/bash

# shellcheck disable=SC1091
source scripts/pscale/common.sh

# --- FUNCTIONS ---

# Nothing to see here

# --- MAIN ---
function main() {
    new_branch_name=$(branch_name_from_git) || exit $?

    check_for_required_env_vars || exit $?
    delete_branch "$new_branch_name" || exit $?
    remove_credentials_from_dotenv "DATABASE_URL" || exit $?
    cleanup_dotenv .env || exit $?
}
main