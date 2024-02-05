<script lang="ts">
    import type Course from '$lib/models/course';
    import type CourseProgress from '$lib/models/course-progress';
    import Image from '$lib/components/image.svelte';

    export let course: Course;
    export let courseProgress: CourseProgress;

    $: percentComplete = Math.min(
        (courseProgress.lessons_completed / course.lesson_cnt) * 100,
        100
    );
</script>

<div class="grid gap-y-1 p-4" data-testid="course-progress-block">
    <Image src={course.img_href} alt="Course 1" class="rounded-lg" width="252" height="151" />
    <p class="font-bold text-lg">{course.title}</p>
    <div class="grid grid-cols-[1fr_auto] gap-x-2 items-center">
        <div class="h-2 w-full bg-surface-300 dark:bg-surface-700 rounded-full relative">
            <div
                class="absolute inset-0 bg-primary-500 rounded-full"
                style={`width: ${percentComplete}%`}
            />
        </div>
        <p class="text-primary-500 dark:text-primary-400">
            {Math.round(percentComplete)} %
        </p>
    </div>
    <button class="btn btn-sm variant-filled justify-self-start">Resume</button>
</div>
