#!/bin/bash
script_dir="./prisma/scripts/course_fulltext"

# Check if index exists
result=$(mysql -h aws.connect.psdb.cloud -u "$DATABASE_USER" -p"$DATABASE_PW" < $script_dir/index.check.sql)

count=${result#"count(*)"} # Remove prefix count(*)
count=${count//$'\n'/} # Remove line breaks

# Drop index if it exists
if [ "$count" -gt 0 ]; then
    mysql -h aws.connect.psdb.cloud -u "$DATABASE_USER" -p"$DATABASE_PW" < $script_dir/index.drop.sql
    echo "Dropped index course_fulltext"
fi

# Create index
mysql -h aws.connect.psdb.cloud -u "$DATABASE_USER" -p"$DATABASE_PW" < $script_dir/index.create.sql
echo "Created index course_fulltext"