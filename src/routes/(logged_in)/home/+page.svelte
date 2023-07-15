<script lang="ts">
    import type { PageServerData } from './$types';
    import type CourseProgress from '$lib/models/course-progress';
    import type Course from '$lib/models/course';
    import EnrolledCourseBlock from './enrolled-course-block.svelte';

    export let data: PageServerData;

    let course: Course = {
        id: '123456',
        title: 'Introduction to TypeScript',
        description: 'Learn the basics of TypeScript programming language.',
        category: 'Programming',
        current_price: 29.99,
        original_price: 49.99,
        instructor: 'John Doe',
        organization: null,
        difficulty: 'Beginner',
        img_href: '/images/course-image.webp',
        estimated_time_hours: 2,
        estimated_time_minutes: 30,
        lesson_cnt: 11,
        rating_cnt: 50,
        rating_avg: 4.5
    };

    let course_progress: CourseProgress = {
        user_id: data.user.id,
        course_id: course.id,
        lessons_completed: 6
    };
</script>

<div class="grid grid-flow-rows gap-2">
    <h2 class="h2">Welcome back, {data.user.name.split(' ', 1)}!</h2>
    <div class="grid grid-flow-row gap-1">
        <h3>Courses I'm Enrolled In</h3>

        <div class="grid grid-cols-1 grid-flow-row-dense sm:grid-cols-2 justify-items-center">
            <EnrolledCourseBlock bind:course bind:course_progress />
            <EnrolledCourseBlock bind:course bind:course_progress />
            <EnrolledCourseBlock bind:course bind:course_progress />
            <EnrolledCourseBlock bind:course bind:course_progress />
        </div>
    </div>
</div>
