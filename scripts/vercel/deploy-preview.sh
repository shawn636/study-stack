#!/bin/bash

# shellcheck disable=SC1091
source scripts/vercel/common.sh

# --- MAIN ---
function main() {
    check_for_required_env_vars || exit $?
    pull_project_settings || exit $?
    deploy "preview" || exit $?
    add_secret "DATABASE_URL" "$DATABASE_URL" "preview" || exit $?
}
main