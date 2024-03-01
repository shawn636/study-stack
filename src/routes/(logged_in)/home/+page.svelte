<script lang="ts">
    import type Course from '$lib/models/course';
    import type CourseProgress from '$lib/models/course-progress';

    import type { PageServerData } from './$types';

    import EnrolledCourseBlock from './enrolled-course-block.svelte';

    export let data: PageServerData;

    let course: Course = {
        category: 'Programming',
        current_price: 29.99,
        description: 'Learn the basics of TypeScript programming language.',
        difficulty: 'Beginner',
        estimated_time_hours: 2,
        estimated_time_minutes: 30,
        id: '123456',
        img_href: '/images/course-image.webp',
        instructor: 'John Doe',
        lesson_cnt: 11,
        organization: null,
        original_price: 49.99,
        rating_avg: 4.5,
        rating_cnt: 50,
        title: 'Introduction to TypeScript'
    };

    let courseProgress: CourseProgress = {
        course_id: course.id,
        lessons_completed: 6,
        user_id: data.user.id
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
