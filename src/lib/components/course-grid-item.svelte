<script lang="ts">
    import Fa from 'svelte-fa';
    import { faStar, faStarHalfAlt, faHeart, faCircle } from '@fortawesome/free-solid-svg-icons';
    import {
        faStar as faStarOutline,
        faHeart as faHeartOutline
    } from '@fortawesome/free-regular-svg-icons';
    import { faFileLines, faClock } from '@fortawesome/free-regular-svg-icons';
    import Image from '$lib/components/image.svelte';
    import type Course from '$lib/models/course';
    import { Ratings } from '@skeletonlabs/skeleton';

    export let course: Course;
    $: rating_avg_rounded = Math.round(course.rating_avg * 2) / 2;

    let toggled = false;

    const handleToggle = () => {
        // TODO:if not logged in, redirect to login page
        toggled = !toggled;
    };
</script>

<div
    class="grid grid-flow-row rounded-md p-1 gap-y-2 min-w-[240px] max-w-[240px] min-h-[300px] content-visibility-auto"
>
    <Image
        src={course.img_href}
        alt="an open bible"
        class="rounded-md aspect-auto"
        width="232"
        height="139"
    />
    <!-- <div class="w-[232px] h-[139px] placeholder animate-pulse" /> -->

    <!-- Ratings (Below)-->
    <div class="grid justify-items-start items-center">
        <div
            class="flex flex-flow-col px-2 justify-items-center items-center gap-x-2 text-sm font-medium text"
        >
            <p class="text-secondary-600">{course.rating_avg}</p>
            <Ratings value={rating_avg_rounded} max={5}>
                <svelte:fragment slot="empty">
                    <Fa icon={faStarOutline} class="text-yellow-500" />
                </svelte:fragment>
                <svelte:fragment slot="half">
                    <Fa icon={faStarHalfAlt} class="text-yellow-500" />
                </svelte:fragment>
                <svelte:fragment slot="full">
                    <Fa icon={faStar} class="text-yellow-500" />
                </svelte:fragment>
            </Ratings>
            <p class="text-xs text-gray-400">({course.rating_cnt})</p>
        </div>
    </div>
    <!-- Ratings (Above) -->

    <h3 class="px-2 text-lg font-medium text-start">
        {course.title.length > 40 ? course.title.substring(0, 40) + '...' : course.title}
    </h3>

    <!-- Course Stats (Below) -->
    <div
        class="grid grid-flow-row grid-cols-2 px-2 justify-items-start gap-y-1 items-center gap-x-2 text-sm font-thin text-gray-500"
    >
        <span class="flex flex-flow-col items-center gap-x-1">
            <Fa icon={faFileLines} class="text-xs" />
            <p class="whitespace-nowrap">{course.lesson_cnt} Lessons</p>
        </span>
        <span class="flex flex-flow-col items-center gap-x-1">
            <Fa icon={faClock} class="text-xs" />
            <p class="whitespace-nowrap">
                {course.estimated_time_hours}h {course.estimated_time_minutes}m
            </p>
        </span>
    </div>
    <!-- Course Stats (Above) -->

    <hr class="mx-2" />

    <div class="grid grid-flow-col grid-cols-[1fr_1fr]">
        <!-- Instructor Row-->
        <div class="px-2 grid grid-flow-col items-center justify-items-start">
            <div class="flex flex-flow-col items-center gap-x-1">
                <!-- <Avatar class="w-8" initials="" /> -->
                <Fa icon={faCircle} class="text-2xl text-surface-400" />
                <p class="text-sm text-gray-500 font-light">{course.instructor}</p>
            </div>
        </div>

        <div class="grid grid-rows-[1fr_1fr]">
            <div class=" grid grid-flow-col justify-items-end h-min grid-cols-[1fr_auto] gap-2">
                {#if course.current_price < course.original_price}
                    <p class="line-through text-gray-400">
                        ${Number(course.current_price).toFixed(2)}
                    </p>
                {/if}

                <p class="text-gray-600 font-semibold">
                    ${Number(course.original_price).toFixed(2)}
                </p>
            </div>
            <div class="grid grid-cols-[1fr_auto] justify-items-end">
                <button class="btn-icon btn-icon-sm" on:click={handleToggle}>
                    <Fa icon={toggled ? faHeart : faHeartOutline} class="text-pink-500" />
                </button>
                <button class="btn btn-sm variant-filled-secondary">
                    <p class="text-sm font-medium">Enroll Now</p>
                </button>
            </div>
        </div>
    </div>
</div>
