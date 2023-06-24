<script lang="ts">
    import Controls from './controls.svelte';
    import CourseGridItem from '$lib/components/course-grid-item.svelte';
    import type { PageServerData } from './$types';

    export let data: PageServerData;
</script>

<div class="grid p-5 gap-y-4 justify-items-center">
    <div class="container max-w-5xl grid gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>
        <Controls />

        <div
            class="grid grid-flow-row justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4"
        >
            {#each data.courses as course}
                <CourseGridItem {course} />
            {/each}
        </div>
    </div>
</div>
