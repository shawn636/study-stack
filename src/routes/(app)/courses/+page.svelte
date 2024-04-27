<script lang="ts">
    import type { CourseSearchResult, CourseWithInstructor } from '$lib/models/types/api';

    import SortByDropdown from '$lib/components/controls/sort-by-dropdown.svelte';
    import ViewToggle from '$lib/components/controls/view-toggle.svelte';
    import CourseGridItem from '$lib/components/course-grid-item.svelte';
    import GridPlaceholder from '$lib/components/placeholders/course-grid-item.svelte';
    import {
        type CourseSortByOption,
        CourseSortByOptions
    } from '$lib/models/types/course-sort-by-options';
    import { faBinoculars, faSearch } from '@fortawesome/free-solid-svg-icons';
    import { Paginator } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';
    import Fa from 'svelte-fa';

    import type { PageData } from './$types';

    export let data: PageData;

    // State
    let isLoading = false;
    let courses: CourseWithInstructor[] = data.result.courses;
    let selectedView: 'grid' | 'list';
    let sortByOption: CourseSortByOption = CourseSortByOptions.RELEVANCE;
    let searchQuery: string;

    let paginationSettings = {
        amounts: [10, 20],
        limit: 20,
        page: 0,
        size: 0
    };

    onMount(() => {
        paginationSettings.size = data.result.courseCount;
    });

    // Methods
    const getCourses = async () => {
        isLoading = false;
        let url = '/api/search/courses';
        if (searchQuery) {
            url += `/${searchQuery}`;
        }
        url += `?sort_by=${sortByOption.param}&page=${paginationSettings.page}&page_size=${paginationSettings.limit}`;

        const response = await fetch(url);
        const result = (await response.json()) as CourseSearchResult;
        isLoading = false;
        courses = result.courses;
        paginationSettings.size = result.courseCount;
        window.scrollTo({ behavior: 'smooth', top: 0 });
    };
</script>

<div class="grid justify-items-center gap-y-4 p-5">
    <div class="container grid max-w-5xl gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>
        <div class="grid grid-cols-[1fr_min-content_min-content_min-content] gap-x-2">
            <div class="relative w-full">
                <input
                    bind:value={searchQuery}
                    class="w-full rounded-lg border-none bg-surface-100 pr-10 font-light text-surface-800 outline-none placeholder:text-gray-600"
                    on:input={() => getCourses()}
                    placeholder="Search..."
                />
                <Fa
                    class="absolute right-5 top-1/2 -translate-y-1/2 transform text-surface-400"
                    icon={faSearch}
                />
            </div>
            <SortByDropdown
                bind:value={sortByOption}
                on:valuechange={(event) => {
                    sortByOption = event.detail;
                    paginationSettings.page = 0;
                    getCourses();
                }}
            />
            <ViewToggle bind:value={selectedView} />
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
        {:else if courses.length === 0}
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
                {#each courses as courseWithInstructor}
                    <CourseGridItem {courseWithInstructor} />
                {/each}
            </div>
        {/if}
        <div class="grid grid-cols-[1fr_min-content_min-content_min-content] gap-x-2">
            <Paginator
                bind:settings={paginationSettings}
                on:amount={getCourses}
                on:page={getCourses}
                showFirstLastButtons={false}
                showNumerals={true}
                showPreviousNextButtons={true}
            />
        </div>
    </div>
</div>
