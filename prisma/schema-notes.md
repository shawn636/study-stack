# Schema Notes

### Dependencies

In the seeding scripts, records must be deleted in specific order based on the dependencies in the schema, and same goes for inserting records. Below is the dependency graph of the schema. Deletions must happen from left to right and insertions must happen from right to left.

```
CourseContent -> ContentType, Lesson -> Course -> Category, User -> Organization
```
