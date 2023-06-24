#!/bin/bash
script_dir="./prisma/scripts/course_title_fulltext/"

# Check if index exists
result=$(mysql -h aws.connect.psdb.cloud -u "$DATABASE_USER" -p"$DATABASE_PW" < $script_dir/index.check.sql)
prefix="count(*)"
count=${result#"$prefix"} 

# Drop index if it exists
if [ "$count" -gt 0 ]; then
    mysql -h aws.connect.psdb.cloud -u "$DATABASE_USER" -p"$DATABASE_PW" < $script_dir/index.drop.sql
    echo "Dropped index course_title_fulltext"
fi

# Create index
mysql -h aws.connect.psdb.cloud -u "$DATABASE_USER" -p"$DATABASE_PW" < $script_dir/index.create.sql
echo "Created index course_title_fulltext"