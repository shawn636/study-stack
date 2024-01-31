<script lang="ts">
    import CourseGridItem from '$lib/components/course-grid-item.svelte';
    import GridPlaceholder from '$lib/components/placeholders/course-grid-item.svelte';
    import Fa from 'svelte-fa';
    import { faBinoculars } from '@fortawesome/free-solid-svg-icons';
    import type { PageData } from './$types';

    let is_loading = false;
    export let data: PageData;

    const _getCourses = async (
        query: string | undefined = undefined,
        sort_by: string | undefined = undefined,
        expand_query: boolean | undefined = undefined
    ) => {
        if (!query) {
            try {
                is_loading = true;
                const res = await fetch('/api/courses');
                return await res.json();
            } catch (error) {
                console.log(error);
            } finally {
                is_loading = false;
            }
        } else {
            try {
                is_loading = true;
                let url = `/api/search/${query}`;
                url += sort_by || expand_query ? '?' : '';
                url += sort_by ? `sort_by=${sort_by}` : '';
                url += sort_by && expand_query ? '&' : '';
                url += expand_query ? `expand_query=${expand_query}` : '';
                const res = await fetch(url);
                return await res.json();
            } catch (error) {
                console.log(error);
            } finally {
                is_loading = false;
            }
        }
    };
</script>

<div class="p-5 grid gap-y-4 justify-items-center">
    <div class="container max-w-5xl grid gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>

        {#if is_loading}
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
