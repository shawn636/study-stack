<script lang="ts">
    import type { CourseResult } from '$lib/api/types/courses';

    import { initials } from '$lib/client/util';
    import CourseRating from '$lib/components/course-rating.svelte';
    import Image from '$lib/components/image.svelte';
    import * as Avatar from '$lib/components/ui/avatar/index';
    import { Button } from '$lib/components/ui/button';
    import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
    import { faClock, faFileLines } from '@fortawesome/free-regular-svg-icons';
    import { faHeart } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    // export let courseWithInstructor: Course & User;
    export let courseResult: CourseResult;

    let toggled = false;

    const handleToggle = () => {
        toggled = !toggled;
    };

    const width = 'w-64';
    const height = 'h-40';

    $: containerBaseClass = `grid grid-flow-row rounded-md p-1 gap-y-2 ${width} content-visibility-auto`;
</script>

<div class={containerBaseClass}>
    <a href={`/courses/${courseResult.course.courseId}`}>
        <Image
            alt="an open bible"
            class="aspect-auto rounded-md p-0"
            {height}
            src={courseResult.course.courseImgHref}
            width="w-full"
        />
    </a>

    <CourseRating
        class="pl-2"
        rating={courseResult.course.courseRatingAverage}
        ratingCount={courseResult.course.courseRatingCount}
    />

    <Button class="m-0 p-0" href={`/courses/${courseResult.course.courseId}`} variant="link">
        <h3 class="px-2 text-start text-lg font-medium">
            {courseResult.course.courseTitle.length > 40
                ? courseResult.course.courseTitle.substring(0, 40) + '...'
                : courseResult.course.courseTitle}
        </h3>
    </Button>

    <!-- Course Stats (Below) -->
    <div
        class="grid auto-cols-max grid-flow-col items-center justify-between gap-x-2 px-2 text-sm text-gray-500"
    >
        <span class="flex items-center gap-x-1">
            <Fa icon={faFileLines} size="sm" />
            <p class="whitespace-nowrap">{courseResult.course.courseLessonCount} Lessons</p>
        </span>
        <span class="flex items-center gap-x-1">
            <Fa icon={faClock} size="sm" />
            <p class="whitespace-nowrap">
                {courseResult.course.courseEstimatedTimeHours}h {courseResult.course
                    .courseEstimatedTimeMinutes}m
            </p>
        </span>
    </div>
    <!-- Course Stats (Above) -->

    <hr />

    <div class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-2">
        <Avatar.Root class="h-6 w-6 text-xs">
            <Avatar.Fallback>{initials(courseResult.instructor.userName)}</Avatar.Fallback>
        </Avatar.Root>
        <p class="text-sm text-gray-500">{courseResult.instructor.userName}</p>
    </div>

    <div class="grid grid-rows-2 items-center">
        <div class="grid grid-cols-[auto_1fr_auto] items-center justify-items-end gap-x-2">
            <button aria-label="Toggle Favorite" on:click={handleToggle}>
                <Fa class="text-pink-500" icon={toggled ? faHeart : faHeartOutline} size="lg" />
            </button>
            {#if Number(courseResult.course.courseCurrentPrice) < Number(courseResult.course.courseOriginalPrice)}
                <p class="text-sm text-gray-400 line-through">
                    ${Number(courseResult.course.courseOriginalPrice).toFixed(2)}
                </p>
            {/if}

            <p class="font-semibold">
                ${Number(courseResult.course.courseCurrentPrice).toFixed(2)}
            </p>
        </div>
        <Button aria-label="Enroll" class="variant-filled-secondary">
            <p class="text-sm font-medium">Enroll Now</p>
        </Button>
    </div>
</div>
