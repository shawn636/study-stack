<script lang="ts">
    import type { Course, CourseProgress } from '$lib/models/types/database.types';

    import { Button } from '$lib/components/ui/button';
    import Image from '$lib/components/image.svelte';

    interface Props {
        course: Course;
        courseProgress: CourseProgress;
    }

    let { course, courseProgress }: Props = $props();

    let percentComplete = $derived(Math.min(
        (courseProgress.lessonsCompleted / course.lessonCount) * 100,
        100
    ));
</script>

<div class="grid gap-y-1 p-4" data-testid="course-progress-block">
    <Image alt="Course 1" class="rounded-lg" height="151" src={course.imgHref} width="252" />
    <p class="text-lg font-bold">{course.title}</p>
    <div class="grid grid-cols-[1fr_auto] items-center gap-x-2">
        <div class="bg-surface-300 dark:bg-surface-700 relative h-2 w-full rounded-full">
            <div
                class="bg-primary-500 absolute inset-0 rounded-full"
                style={`width: ${percentComplete}%`}
></div>
        </div>
        <p class="text-primary-500 dark:text-primary-400">
            {Math.round(percentComplete)} %
        </p>
    </div>
    <Button class="variant-filled justify-self-start">Resume</Button>
</div>
