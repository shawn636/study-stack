#!/bin/bash

# shellcheck disable=SC1091
source scripts/vercel/common.sh

# --- MAIN ---
function main() {
    check_for_required_env_vars || exit $?
    build || exit $?
    deploy "production" || exit $?
    add_secret "DATABASE_URL" "$DATABASE_URL" "production" || exit $?
}
main