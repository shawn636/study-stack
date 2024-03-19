<script lang="ts">
    import type { Course, CourseProgress } from '@prisma/client';

    import { Prisma } from '@prisma/client';

    import type { PageServerData } from './$types';

    import EnrolledCourseBlock from './enrolled-course-block.svelte';

    export let data: PageServerData;

    let course: Course = {
        categoryId: 456,
        currentPrice: new Prisma.Decimal(29.99),
        description: 'Learn the basics of TypeScript programming language.',
        difficulty: 'Beginner',
        estimatedTimeHours: 2,
        estimatedTimeMinutes: 30,
        id: 123456,
        imgHref: '/images/course-image.webp',
        instructorId: 3,
        lessonCount: 11,
        organizationId: null,
        originalPrice: new Prisma.Decimal(49.99),
        ratingAverage: 4.5,
        ratingCount: 50,
        title: 'Introduction to TypeScript'
    };

    let courseProgress: CourseProgress = {
        courseId: course.id,
        lessonsCompleted: 6,
        userId: data.user.id
    };
</script>

<div class="grid-flow-rows grid gap-2">
    <h2 class="h2">Welcome back, {data.user.name.split(' ', 1)}!</h2>
    <div class="grid grid-flow-row gap-1">
        <h3>Courses I'm Enrolled In</h3>

        <div class="grid grid-flow-row-dense grid-cols-1 justify-items-center sm:grid-cols-2">
            <EnrolledCourseBlock bind:course bind:courseProgress />
            <EnrolledCourseBlock bind:course bind:courseProgress />
            <EnrolledCourseBlock bind:course bind:courseProgress />
            <EnrolledCourseBlock bind:course bind:courseProgress />
        </div>
    </div>
</div>
