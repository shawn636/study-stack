#!/bin/bash

# --- GITHUB METHODS ---
function add_pr_comment() {
    local arg_type=$1 # Either 'file' or 'string'
    local arg_val=$2 # Either the file_path or the string value
    local head_branch=$3 # Optional head branch name
    local status_code=""


    if [ -z "$arg_type" ] || { [ "$arg_type" != 'file' ] && [ "$arg_type" != 'string' ]; }; then
        echo "Error: missing or invalid argument type. Please use the format: add_pr_comment ['file'|'string'] <file_path|str_val> [head_branch (optional)]"
        exit 1
    fi

    if [ -z "$arg_val" ]; then
        echo "Error: missing argument comment.lease use the format: add_pr_comment ['file'|'string'] <file_path|str_val> [head_branch (optional)]"
        exit 1
    fi

    if [ -z "$head_branch" ]; then
        if [ -n "$CI" ]; then
            head_branch=$GITHUB_HEAD_REF
        else
            head_branch=$(git branch --show-current)
        fi
    fi

    local pr_number=""
    pr_number=$(gh pr list -H "$head_branch" -s open -L 1 --json number | jq -r '.[0].number')

    if [ -z "$pr_number" ]; then
        echo "Error: Unable to locate an open pull request for branch $head_branch. Exiting..."
        exit 1
    fi

    if [ "$arg_type" = 'file' ]; then
        if [ ! -f "$arg_val" ]; then
            echo "Error: File $arg_val does not exist. Exiting..."
            exit 1
        fi
        gh pr comment "$pr_number" --body-file "$arg_val" >> /dev/null
        status_code=$?

        if [ "$status_code" -ne 0 ]; then
            echo "Error: Unable to add comment to pull request $pr_number. Exiting..."
            exit 1
        fi
    else
        gh pr comment "$pr_number" --body "$arg_val" >> /dev/null

        status_code=$?
        if [ "$status_code" -ne 0 ]; then
            echo "Error: Unable to add comment to pull request $pr_number. Exiting..."
            exit 1
        fi
    fi
}