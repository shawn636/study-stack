#!/bin/bash

# shellcheck disable=SC1091
source scripts/pscale/common.sh

# --- FUNCTIONS ---

# --- MAIN ---
function main() {
    check_for_required_env_vars || exit $?
    
    local branch_name=""
    branch_name=$(branch_name_from_git) || exit $?

    local dr_number=""
    dr_number=$(get_dr_number "$branch_name") || exit $?

    close_deploy_request "$dr_number" || exit $?
}
main