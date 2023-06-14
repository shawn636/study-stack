<script lang="ts">
    import Fa from 'svelte-fa';
    import { faStar } from '@fortawesome/free-solid-svg-icons';
    import { faFileLines, faClock, faBarChart } from '@fortawesome/free-regular-svg-icons';

    const title = 'The Book of John';
    const rating_avg = 3.5;
    const rating_avg_rounded = Math.ceil(rating_avg);
    const rating_cnt = 100;
    const lesson_cnt = 18;
    const est_time_hr = 3;
    const est_time_min = 56;
    const difficulty = 'Beginner';
    const instructor_name = 'Paul Sasis';
    // const price_orig = 249.99;
    const price_curr = 179.99;
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
    <div class="grid grid-flow-col items-center justify-items-start">
        <div class="rounded-full w-6 h-6 placeholder" />
        <p class="text-sm text-gray-500 font-light">{instructor_name}</p>
        <p class="justify-self-end">{price_curr}</p>
    </div>
    <!-- Instructor (Above) -->
</div>
