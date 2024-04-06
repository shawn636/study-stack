<script lang="ts">
    import type { Course, User } from '$lib/models/types/database.types';

    import Image from '$lib/components/image.svelte';
    import {
        faHeart as faHeartOutline,
        faStar as faStarOutline
    } from '@fortawesome/free-regular-svg-icons';
    import { faClock, faFileLines } from '@fortawesome/free-regular-svg-icons';
    import { faCircle, faHeart, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
    import { Ratings } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';

    export let courseWithInstructor: Course & User;

    $: ratingAvgRounded = Math.round(courseWithInstructor.ratingAverage * 2) / 2;

    let toggled = false;

    const handleToggle = () => {
        // TODO:if not logged in, redirect to login page
        toggled = !toggled;
    };

    const width = 'w-64';
    const height = 'h-40';

    $: containerBaseClass = `grid grid-flow-row rounded-md p-1 gap-y-2 ${width} content-visibility-auto`;
</script>

<div class={containerBaseClass}>
    <Image
        alt="an open bible"
        class="aspect-auto rounded-md"
        {height}
        src={courseWithInstructor.imgHref}
        {width}
    />

    <!-- Ratings (Below)-->
    <div class="grid items-center justify-items-start">
        <div
            class="flex-flow-col text flex items-center justify-items-center gap-x-2 px-2 text-sm font-medium"
        >
            <p class="text-secondary-600">
                {Math.round(courseWithInstructor.ratingAverage * 100) / 100}
            </p>
            <Ratings max={5} value={ratingAvgRounded}>
                <svelte:fragment slot="empty">
                    <Fa class="text-yellow-500" icon={faStarOutline} />
                </svelte:fragment>
                <svelte:fragment slot="half">
                    <Fa class="text-yellow-500" icon={faStarHalfAlt} />
                </svelte:fragment>
                <svelte:fragment slot="full">
                    <Fa class="text-yellow-500" icon={faStar} />
                </svelte:fragment>
            </Ratings>
            <p class="text-xs text-gray-400">({courseWithInstructor.ratingCount})</p>
        </div>
    </div>
    <!-- Ratings (Above) -->

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

    <hr class="mx-2" />

    <div class="grid grid-flow-col grid-cols-[1fr_1fr]">
        <!-- Instructor Row-->
        <div class="grid grid-flow-col items-center justify-items-start px-2">
            <div class="flex-flow-col flex items-center gap-x-1">
                <Fa class="text-surface-400" icon={faCircle} size="2x" />
                <p class="text-sm text-gray-500">{courseWithInstructor.name}</p>
            </div>
        </div>

        <div class="grid grid-rows-[1fr_1fr]">
            <div class=" grid h-min grid-flow-col grid-cols-[1fr_auto] justify-items-end gap-2">
                {#if courseWithInstructor.currentPrice < courseWithInstructor.originalPrice}
                    <p class="text-gray-400 line-through">
                        ${Number(courseWithInstructor.currentPrice).toFixed(2)}
                    </p>
                {/if}

                <p class="font-semibold text-gray-600">
                    ${Number(courseWithInstructor.originalPrice).toFixed(2)}
                </p>
            </div>
            <div class="grid grid-cols-[1fr_auto] justify-items-end">
                <button
                    aria-label="Toggle Favorite"
                    class="btn-icon btn-icon-sm"
                    on:click={handleToggle}
                >
                    <Fa class="text-pink-500" icon={toggled ? faHeart : faHeartOutline} />
                </button>
                <button aria-label="Enroll" class="variant-filled-secondary btn btn-sm">
                    <p class="text-sm font-medium">Enroll Now</p>
                </button>
            </div>
        </div>
    </div>
</div>
