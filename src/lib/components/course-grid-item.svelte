<script lang="ts">
    import type { Course, User } from '$lib/models/types/database.types';

    import { initials } from '$lib/client/util';
    import CourseRating from '$lib/components/course-rating.svelte';
    import Image from '$lib/components/image.svelte';
    import * as Avatar from '$lib/components/ui/avatar/index';
    import { Button } from '$lib/components/ui/button';
    import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
    import { faClock, faFileLines } from '@fortawesome/free-regular-svg-icons';
    import { faHeart } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    export let courseWithInstructor: Course & User;

    let toggled = false;

    const handleToggle = () => {
        toggled = !toggled;
    };

    const width = 'w-64';
    const height = 'h-40';

    $: containerBaseClass = `grid grid-flow-row rounded-md p-1 gap-y-2 ${width} content-visibility-auto`;
</script>

<div class={containerBaseClass}>
    <Image
        alt="an open bible"
        class="aspect-auto rounded-md p-0"
        {height}
        src={courseWithInstructor.imgHref}
        width="w-full"
    />

    <CourseRating
        class="pl-2"
        rating={courseWithInstructor.ratingAverage}
        ratingCount={courseWithInstructor.ratingCount}
    />

    <h3 class="px-2 text-start text-lg font-medium">
        {courseWithInstructor.title.length > 40
            ? courseWithInstructor.title.substring(0, 40) + '...'
            : courseWithInstructor.title}
    </h3>

    <!-- Course Stats (Below) -->
    <div
        class="grid auto-cols-max grid-flow-col items-center justify-between gap-x-2 px-2 text-sm text-gray-500"
    >
        <span class="flex items-center gap-x-1">
            <Fa icon={faFileLines} size="sm" />
            <p class="whitespace-nowrap">{courseWithInstructor.lessonCount} Lessons</p>
        </span>
        <span class="flex items-center gap-x-1">
            <Fa icon={faClock} size="sm" />
            <p class="whitespace-nowrap">
                {courseWithInstructor.estimatedTimeHours}h {courseWithInstructor.estimatedTimeMinutes}m
            </p>
        </span>
    </div>
    <!-- Course Stats (Above) -->

    <hr />

    <div class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-2">
        <Avatar.Root class="h-6 w-6 text-xs">
            <Avatar.Fallback>{initials(courseWithInstructor.name)}</Avatar.Fallback>
        </Avatar.Root>
        <p class="text-sm text-gray-500">{courseWithInstructor.name}</p>
    </div>

    <div class="grid grid-rows-2 items-center">
        <div class="grid grid-cols-[auto_1fr_auto] items-center justify-items-end gap-x-2">
            <button aria-label="Toggle Favorite" on:click={handleToggle}>
                <Fa class="text-pink-500" icon={toggled ? faHeart : faHeartOutline} size="lg" />
            </button>
            {#if Number(courseWithInstructor.currentPrice) < Number(courseWithInstructor.originalPrice)}
                <p class="text-sm text-gray-400 line-through">
                    ${Number(courseWithInstructor.originalPrice).toFixed(2)}
                </p>
            {/if}

            <p class="font-semibold">
                ${Number(courseWithInstructor.currentPrice).toFixed(2)}
            </p>
        </div>
        <Button aria-label="Enroll" class="variant-filled-secondary">
            <p class="text-sm font-medium">Enroll Now</p>
        </Button>
    </div>
</div>
