SELECT COUNT(*)
FROM information_schema.statistics
WHERE table_schema = 'equipped-db'
    AND table_name = 'Courses'
    AND index_name = 'course_fulltext';