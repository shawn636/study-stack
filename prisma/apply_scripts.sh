#!/bin/bash


# Load Environment Variables from .env
if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)
fi


# Checkf or Required Environment Variables
if [[ -z $DATABASE_USER ]]; then
  echo "Error: DATABASE_USER is not set or is empty."
  exit 1
fi

if [[ -z $DATABASE_PW ]]; then
  echo "Error: DATABASE_PW is not set or is empty."
  exit 1
fi


# Perform Databse Updates
# pnpm prisma db push


# Execute All Scripts
source ./prisma/scripts/course_fulltext/apply.sh
