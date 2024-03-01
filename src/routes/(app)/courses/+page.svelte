<script lang="ts">
    import CourseGridItem from '$lib/components/course-grid-item.svelte';
    import GridPlaceholder from '$lib/components/placeholders/course-grid-item.svelte';
    import { sortBy } from '$lib/stores/controls';
    import { search } from '$lib/stores/controls';
    import { faBinoculars } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    import type { PageData } from './$types';

    import Controls from './controls.svelte';
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

<div class="grid justify-items-center gap-y-4 p-5">
    <div class="container grid max-w-5xl gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>

        <Controls
            {handleKeydown}
            on:change={async () => {
                await getCourses();
            }}
        />

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
        {:else if data.courses.length === 0}
            <div class="content-visibility-auto mb-6 mt-8 grid items-center justify-items-center">
                <div class="flex-flow-col card flex items-center gap-x-2 p-4">
                    <Fa class="text-xl" icon={faBinoculars} />
                    <span>No courses found</span>
                </div>
            </div>
        {:else}
            <div
                class="grid grid-flow-row grid-cols-1 justify-items-center gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
            >
                {#each data.courses as course}
                    <CourseGridItem {course} />
                {/each}
            </div>
        {/if}
    </div>
</div>
