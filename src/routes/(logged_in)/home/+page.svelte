<script lang="ts">
    import type { Course, CourseProgress } from '$lib/models/types/database.types';

    import { init } from '@paralleldrive/cuid2';

    import type { PageServerData } from './$types';

    import EnrolledCourseBlock from './enrolled-course-block.svelte';

    export let data: PageServerData;

    const cuid = init();

    let course: Course = {
        courseCategoryId: cuid(),
        courseCurrentPrice: 29.99,
        courseDescription: 'Learn the basics of TypeScript programming language.',
        courseDifficulty: 'Beginner',
        courseEstimatedTimeHours: 2,
        courseEstimatedTimeMinutes: 30,
        courseId: cuid(),
        courseImgHref: '/images/course-image.webp',
        courseInstructorId: cuid(),
        courseLessonCount: 11,
        courseOrganizationId: null,
        courseOriginalPrice: 49.99,
        courseRatingAverage: 4.5,
        courseRatingCount: 50,
        courseRecordType: {
            __insert__: undefined,
            __select__: 'PRODUCTION_RECORD',
            __update__: 'PRODUCTION_RECORD'
        },
        courseTitle: 'Introduction to TypeScript'
    };

    let courseProgress: CourseProgress = {
        courseProgressCourseId: course.courseId,
        courseProgressLessonsCompleted: 6,
        courseProgressRecordType: {
            __insert__: undefined,
            __select__: 'PRODUCTION_RECORD',
            __update__: 'PRODUCTION_RECORD'
        },
        courseProgressUserId: data.user.userId
    };
</script>

<div class="grid-flow-rows grid gap-2">
    <h2 class="h2">Welcome back, {data.user.userName.split(' ', 1)}!</h2>
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
