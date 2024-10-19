<script lang="ts">
    import * as Avatar from '$lib/components/ui/avatar/index';

    import type { CourseResult } from '$lib/api/types/courses';
    import type { ToggleCourseFavoriteEvent } from '$lib/models/types/toggle-user-course-favorite-event';

    import { faClock, faFileLines } from '@fortawesome/free-regular-svg-icons';

    import { Button } from '$lib/components/ui/button';
    import CourseRating from '$lib/components/course-rating.svelte';
    import { createEventDispatcher } from 'svelte';
    import Fa from 'svelte-fa';
    import { faHeart } from '@fortawesome/free-solid-svg-icons';
    import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
    import Image from '$lib/components/image.svelte';
    import { initials } from '$lib/client/util';

    export let courseResult: CourseResult;

    // let toggled = false;
    $: toggled = courseResult.course.isFavorite ?? false;

    const dispatch = createEventDispatcher<ToggleCourseFavoriteEvent>();

    const toggle = () => {
        toggled = !toggled;

        const payload = {
            courseId: courseResult.course.id,
            current: toggled,
            previous: !toggled
        };

        dispatch('toggleCourseFavorite', payload);
    };

    const width = 'w-64';
    const height = 'h-40';

    $: containerBaseClass = `grid grid-flow-row rounded-md p-1 gap-y-2 ${width} content-visibility-auto`;
</script>

<div class={containerBaseClass}>
    <a href={`/courses/${courseResult.course.id}`}>
        <Image
            alt="an open bible"
            class="aspect-auto rounded-md p-0"
            {height}
            src={courseResult.course.imgHref}
            width="w-full"
        />
    </a>

    <CourseRating
        class="pl-2"
        rating={courseResult.course.ratingAverage}
        ratingCount={courseResult.course.ratingCount}
    />

    <Button class="m-0 w-full p-0" href={`/courses/${courseResult.course.id}`} variant="link">
        <h3 class="w-full px-2 text-start text-lg font-medium">
            {courseResult.course.title.length > 40
                ? courseResult.course.title.substring(0, 40) + '...'
                : courseResult.course.title}
        </h3>
    </Button>

    <!-- Course Stats (Below) -->
    <div
        class="grid auto-cols-max grid-flow-col items-center justify-between gap-x-2 px-2 text-sm text-gray-500"
    >
        <span class="flex items-center gap-x-1">
            <Fa icon={faFileLines} size="sm" />
            <p class="whitespace-nowrap">{courseResult.course.lessonCount} Lessons</p>
        </span>
        <span class="flex items-center gap-x-1">
            <Fa icon={faClock} size="sm" />
            <p class="whitespace-nowrap">
                {courseResult.course.estimatedTimeHours}h {courseResult.course
                    .estimatedTimeMinutes}m
            </p>
        </span>
    </div>
    <!-- Course Stats (Above) -->

    <hr />

    <div class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-2">
        <Avatar.Root class="h-6 w-6 text-xs">
            <Avatar.Fallback>{initials(courseResult.instructor.name)}</Avatar.Fallback>
        </Avatar.Root>
        <p class="text-sm text-gray-500">{courseResult.instructor.name}</p>
    </div>

    <div class="grid grid-rows-2 items-center">
        <div class="grid grid-cols-[auto_1fr_auto] items-center justify-items-end gap-x-2">
            <button aria-label="Toggle Favorite" on:click={toggle}>
                <Fa class="text-pink-500" icon={toggled ? faHeart : faHeartOutline} size="lg" />
            </button>
            {#if Number(courseResult.course.currentPrice) < Number(courseResult.course.originalPrice)}
                <p class="text-sm text-gray-400 line-through">
                    ${Number(courseResult.course.originalPrice).toFixed(2)}
                </p>
            {/if}

            <p class="font-semibold">
                ${Number(courseResult.course.currentPrice).toFixed(2)}
            </p>
        </div>
        <Button aria-label="Enroll" class="variant-filled-secondary">
            <p class="text-sm font-medium">Enroll Now</p>
        </Button>
    </div>
</div>
