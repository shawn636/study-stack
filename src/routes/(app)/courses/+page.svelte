<script lang="ts">
    import ViewToggle from '$lib/components/controls/view-toggle.svelte';
    import CourseGridItem from '$lib/components/course-grid-item.svelte';
    import GridPlaceholder from '$lib/components/placeholders/course-grid-item.svelte';
    import { faBinoculars, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    import type { PageData } from './$types';
    const isLoading = false;
    export let data: PageData;

    let selectedView: 'grid' | 'list' = 'grid';
</script>

<div class="grid justify-items-center gap-y-4 p-5">
    <div class="container grid max-w-5xl gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>
        <div class="grid grid-cols-[1fr_min-content_min-content_min-content] gap-x-2">
            <div class="relative w-full">
                <input
                    class="w-full rounded-lg border-none bg-surface-100 pr-10 font-light text-surface-800 outline-none placeholder:text-surface-400"
                    placeholder="Search..."
                />
                <Fa
                    class="absolute right-5 top-1/2 -translate-y-1/2 transform text-surface-400"
                    icon={faSearch}
                />
            </div>
            <button
                class="variant-filled-primary btn grid grid-flow-col items-center justify-items-center gap-x-1 text-surface-500 text-white"
            >
                Sort by
                <Fa class="text-white" icon={faChevronDown} size="sm" />
            </button>
            <ViewToggle bind:value={selectedView} />
            <!-- <div class="w-24 rounded-lg bg-surface-100"></div> -->
            <div class="w-24 rounded-lg bg-surface-100"></div>
        </div>
        {#if isLoading}
            <div
                class="content-visibility-auto grid grid-flow-row grid-cols-1 justify-items-center gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
            >
                {#each Array(20) as _}
                    <div class="!-z-20">
                        <GridPlaceholder />
                    </div>
                {/each}
            </div>
        {:else if data.coursesWithInstructors.length === 0}
            <div class="content-visibility-auto mb-6 mt-8 grid items-center justify-items-center">
                <div class="flex-flow-col card flex items-center gap-x-2 p-4">
                    <Fa class="text-xl" icon={faBinoculars} />
                    <span>No courses found</span>
                </div>
            </div>
        {:else}
            <div
                class="grid grid-flow-row grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
            >
                {#each data.coursesWithInstructors as courseWithInstructor}
                    <CourseGridItem {courseWithInstructor} />
                {/each}
            </div>
        {/if}
    </div>
</div>
