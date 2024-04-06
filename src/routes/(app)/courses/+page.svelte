<script lang="ts">
    import type { Course, User } from '$lib/models/types/database.types';

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

    const getCoursesWithInstructors = async (
        query: string | undefined = undefined,
        sortBy: string | undefined = undefined
    ) => {
        if (!query) {
            try {
                isLoading = true;
                const res = await fetch('/api/courses');
                return (await res.json()) as (Course & User)[];
            } catch (error) {
                console.error(error);
            } finally {
                isLoading = false;
            }
        } else {
            try {
                isLoading = true;
                let url = `/api/search/${query}`;
                url += sortBy ? `?sort_by=${sortBy}` : '';

                const res = await fetch(url);
                return await res.json();
            } catch (error) {
                console.error(error);
            } finally {
                isLoading = false;
            }
        }
    };

    // Search Options
    $: sortByText = $sortBy.toLowerCase().replace(/\s/g, '_');

    const handleKeydown = async (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            data.coursesWithInstructors = await getCoursesWithInstructors($search, sortByText);
        }
    };
</script>

<div class="grid justify-items-center gap-y-4 p-5">
    <div class="container grid max-w-5xl gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>

        <Controls
            {handleKeydown}
            on:change={async () => {
                await getCoursesWithInstructors();
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
        {:else if data.coursesWithInstructors.length === 0}
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
                {#each data.coursesWithInstructors as courseWithInstructor}
                    <CourseGridItem {courseWithInstructor} />
                {/each}
            </div>
        {/if}
    </div>
</div>
