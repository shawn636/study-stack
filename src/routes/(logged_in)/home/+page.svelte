<script lang="ts">
    import type { Course, CourseProgress } from '$lib/models/types/database.types';

    import { init } from '@paralleldrive/cuid2';

    import type { PageServerData } from './$types';

    import EnrolledCourseBlock from './enrolled-course-block.svelte';

    interface Props {
        data: PageServerData;
    }

    const { data }: Props = $props();

    const cuid = init();

    const courseId = cuid();

    let course: Course = $state({
        categoryId: cuid(),
        currentPrice: 29.99,
        description: 'Learn the basics of TypeScript programming language.',
        difficulty: 'Beginner',
        estimatedTimeHours: 2,
        estimatedTimeMinutes: 30,
        id: courseId,
        imgHref: '/images/course-image.webp',
        instructorId: cuid(),
        lessonCount: 11,
        organizationId: null,
        originalPrice: 49.99,
        ratingAverage: 4.5,
        ratingCount: 50,
        recordType: {
            __insert__: undefined,
            __select__: 'PRODUCTION_RECORD',
            __update__: 'PRODUCTION_RECORD'
        },
        title: 'Introduction to TypeScript'
    });

    let courseProgress: CourseProgress = $state({
        courseId: courseId,
        lessonsCompleted: 6,
        recordType: {
            __insert__: undefined,
            __select__: 'PRODUCTION_RECORD',
            __update__: 'PRODUCTION_RECORD'
        },
        userId: data.user.id
    });
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
