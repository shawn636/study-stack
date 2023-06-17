<script lang="ts">
    import Fa from 'svelte-fa';
    import { faStar, faHeart } from '@fortawesome/free-solid-svg-icons';
    import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
    import { faFileLines, faClock, faBarChart } from '@fortawesome/free-regular-svg-icons';
    import { Avatar } from '@skeletonlabs/skeleton';

    const title = 'The Book of John';
    const rating_avg = 3.5;
    const rating_avg_rounded = Math.ceil(rating_avg);
    const rating_cnt = 100;
    const lesson_cnt = 18;
    const est_time_hr = 3;
    const est_time_min = 56;
    const difficulty = 'Beginner';
    const instructor_name = 'Paul John Matthew Sasis';
    const price_orig = 249.99;
    const price_curr = 179.99;
    let toggled = false;
</script>

<div class="grid grid-flow-row rounded-md p-4 gap-y-2">
    <img
        src="images/course-image.jpg"
        alt="an open bible"
        width="251px"
        height="151px"
        class="rounded-md"
    />

    <!-- Ratings (Below)-->
    <div class="flex flex-flow-col px-2 items-center gap-x-2 text-sm font-medium text">
        <p class="text-secondary-600">{rating_avg}</p>
        {#each [1, 2, 3, 4, 5] as i}
            <Fa
                icon={faStar}
                class="text-xs {i <= rating_avg_rounded ? 'text-yellow-500' : 'text-gray-300'}"
            />
        {/each}
        <p class="text-xs text-gray-400">({rating_cnt})</p>
    </div>
    <!-- Ratings (Above) -->

    <h3 class="px-2 text-lg font-medium">{title}</h3>

    <!-- Course Stats (Below) -->
    <div class="flex flex-flow-col px-2 items-center gap-x-2 text-sm font-thin text-gray-500">
        <span class="flex flex-flow-col items-center gap-x-1">
            <Fa icon={faFileLines} class="text-xs" />
            <p>{lesson_cnt} Lessons</p>
        </span>
        <span class="flex flex-flow-col items-center gap-x-1">
            <Fa icon={faClock} class="text-xs" />
            <p>{est_time_hr}h {est_time_min}m</p>
        </span>
        <span class="flex flex-flow-col items-center gap-x-1">
            <Fa icon={faBarChart} class="text-xs" />
            <p>{difficulty}</p>
        </span>
    </div>
    <!-- Course Stats (Above) -->

    <hr class="mx-2" />

    <!-- Instructor (Below) -->
    <div class="px-2 grid grid-flow-col items-center justify-items-start">
        <div class="flex flex-flow-col items-center gap-x-1">
            <Avatar class="w-8" initials="" />
            <p class="text-sm text-gray-500 font-light">{instructor_name}</p>
        </div>
    </div>
    <!-- Instructor (Above) -->

    <!-- Actions (Below) -->
    <div
        class="grid grid-rows-1 grid-cols-[auto_1fr] justify-items-start w-full items-center text-center"
    >
        <div class="grid grid-rows-2 items-center max-w-min">
            <p class="text-sm text-gray-500 font-light line-through">${price_orig}</p>
            <p class="text-lg font-medium">${price_curr}</p>
        </div>
        <div class="grid grid-cols-[1fr_auto] justify-self-end gap-x-2 items-center">
            <button
                type="button"
                class="btn-icon variant-filled bg-slate-300 btn-icon-sm"
                on:click={() => (toggled = !toggled)}
            >
                {#if toggled}
                    <Fa icon={faHeartOutline} class="text-lg text-surface-800" />
                {:else}
                    <Fa icon={faHeart} class="text-lg text-red-500" />
                {/if}
            </button>
            <button class="btn btn-sm variant-filled-secondary justify-self-end">
                Enroll Now
            </button>
        </div>
    </div>
    <!-- Actions (Above) -->
</div>
