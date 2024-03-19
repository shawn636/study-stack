<script lang="ts">
    import type { Course, CourseProgress } from '@prisma/client';

    import Image from '$lib/components/image.svelte';

    export let course: Course;
    export let courseProgress: CourseProgress;

    $: percentComplete = Math.min(
        (courseProgress.lessonsCompleted / course.lessonCount) * 100,
        100
    );
</script>

<div class="grid gap-y-1 p-4" data-testid="course-progress-block">
    <Image alt="Course 1" class="rounded-lg" height="151" src={course.imgHref} width="252" />
    <p class="text-lg font-bold">{course.title}</p>
    <div class="grid grid-cols-[1fr_auto] items-center gap-x-2">
        <div class="relative h-2 w-full rounded-full bg-surface-300 dark:bg-surface-700">
            <div
                class="absolute inset-0 rounded-full bg-primary-500"
                style={`width: ${percentComplete}%`}
            />
        </div>
        <p class="text-primary-500 dark:text-primary-400">
            {Math.round(percentComplete)} %
        </p>
    </div>
    <button class="variant-filled btn btn-sm justify-self-start">Resume</button>
</div>
