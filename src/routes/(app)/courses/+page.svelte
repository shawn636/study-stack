<script lang="ts">
    import Controls from './controls.svelte';
    import CourseGridItem from '$lib/components/course-grid-item.svelte';
    import GridPlaceholder from '$lib/components/placeholders/course-grid-item.svelte';
    import Fa from 'svelte-fa';
    import { faBinoculars } from '@fortawesome/free-solid-svg-icons';
    import type { PageData } from './$types';
    import { sortBy } from '$lib/stores/controls';
    import { search } from '$lib/stores/controls';
    let isLoading = false;
    export let data: PageData;

    const getCourses = async (
        query: string | undefined = undefined,
        sortBy: string | undefined = undefined,
        expandQuery: boolean | undefined = undefined
    ) => {
        if (!query) {
            try {
                isLoading = true;
                const res = await fetch('/api/courses');
                return await res.json();
            } catch (error) {
                console.log(error);
            } finally {
                isLoading = false;
            }
        } else {
            try {
                isLoading = true;
                let url = `/api/search/${query}`;
                url += sortBy || expandQuery ? '?' : '';
                url += sortBy ? `sort_by=${sortBy}` : '';
                url += sortBy && expandQuery ? '&' : '';
                url += expandQuery ? `expand_query=${expandQuery}` : '';
                const res = await fetch(url);
                return await res.json();
            } catch (error) {
                console.log(error);
            } finally {
                isLoading = false;
            }
        }
    };

    // Search Options
    $: sortByText = $sortBy.toLowerCase().replace(/\s/g, '_');
    const expandQuery = true;

    const handleKeydown = async (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            data.courses = await getCourses($search, sortByText, expandQuery);
        }
    };
</script>

<div class="p-5 grid gap-y-4 justify-items-center">
    <div class="container max-w-5xl grid gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>

        <Controls
            {handleKeydown}
            on:change={async () => {
                await getCourses();
            }}
        />

        {#if isLoading}
            <div
                class="grid grid-flow-row justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-4 content-visibility-auto"
            >
                {#each Array(20) as _}
                    <div class="!-z-20">
                        <GridPlaceholder />
                    </div>
                {/each}
            </div>
        {:else if data.courses.length === 0}
            <div class="items-center mt-8 mb-6 grid justify-items-center content-visibility-auto">
                <div class="flex items-center p-4 card flex-flow-col gap-x-2">
                    <Fa icon={faBinoculars} class="text-xl" />
                    <span>No courses found</span>
                </div>
            </div>
        {:else}
            <div
                class="grid grid-flow-row justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-4"
            >
                {#each data.courses as course}
                    <CourseGridItem {course} />
                {/each}
            </div>
        {/if}
    </div>
</div>
