<script lang="ts">
    import Controls from './controls.svelte';
    import CourseGridItem from '$lib/components/course-grid-item.svelte';
    import GridPlaceholder from '$lib/components/placeholders/course-grid-item.svelte';
    import type Course from '$lib/models/course';
    import { search } from '$lib/stores/controls';
    import { sortBy } from '$lib/stores/controls';
    import Fa from 'svelte-fa';
    import { faBinoculars } from '@fortawesome/free-solid-svg-icons';

    const getCourses = async (
        query: string | undefined = undefined,
        sort_by: string | undefined = undefined,
        expand_query: boolean | undefined = undefined
    ) => {
        if (!query) {
            try {
                const res = await fetch('/api/courses');
                return await res.json();
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                let url = `/api/search/${query}`;
                url += sort_by || expand_query ? '?' : '';
                url += sort_by ? `sort_by=${sort_by}` : '';
                url += sort_by && expand_query ? '&' : '';
                url += expand_query ? `expand_query=${expand_query}` : '';

                const res = await fetch(url);
                return await res.json();
            } catch (error) {
                console.log(error);
            }
        }
    };

    // Search Options
    $: sort_by = $sortBy.toLowerCase().replace(/\s/g, '_');
    const expand_query = true;

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            courses = getCourses($search, sort_by, expand_query);
        }
    };

    let courses: Promise<Course[]> = getCourses();
</script>

<div class="grid p-5 gap-y-4 justify-items-center">
    <div class="container max-w-5xl grid gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>

        <Controls {handleKeydown} />

        {#await courses}
            <div
                class="grid grid-flow-row justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 content-visibility-auto"
            >
                {#each Array(20) as _}
                    <GridPlaceholder />
                {/each}
            </div>
        {:then courses}
            {#if courses.length === 0}
                <div
                    class="grid mt-8 mb-6 justify-items-center items-center content-visibility-auto"
                >
                    <div class="card p-4 flex flex-flow-col items-center gap-x-2">
                        <Fa icon={faBinoculars} class="text-xl" />
                        <span>No courses found</span>
                    </div>
                </div>
            {:else}
                <div
                    class="grid grid-flow-row justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4"
                >
                    {#each courses as course}
                        <CourseGridItem {course} />
                    {/each}
                </div>
            {/if}
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </div>
</div>
