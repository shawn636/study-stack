<script lang="ts">
    import type { CourseSearchResult, CourseWithInstructor } from '$lib/models/types/api';

    import SortByDropdown from '$lib/components/controls/sort-by-dropdown.svelte';
    import ViewToggle from '$lib/components/controls/view-toggle.svelte';
    import CourseGridItem from '$lib/components/course-grid-item.svelte';
    import GridPlaceholder from '$lib/components/placeholders/course-grid-item.svelte';
    import { Input } from '$lib/components/ui/input/index';
    import * as Pagination from '$lib/components/ui/pagination/index';
    import { CourseSortByOptions } from '$lib/models/types/course-sort-by-options';
    import {
        faBinoculars,
        faChevronLeft,
        faChevronRight,
        faSearch
    } from '@fortawesome/free-solid-svg-icons';
    import { onMount } from 'svelte';
    import Fa from 'svelte-fa';
    import { mediaQuery } from 'svelte-legos';

    import type { PageData } from './$types';

    export let data: PageData;

    // State
    let isLoading = false;
    let courses: CourseWithInstructor[] = data.result.courses;
    let selectedView: 'grid' | 'list';
    let sortByOption = {
        label: CourseSortByOptions.RELEVANCE.label,
        value: CourseSortByOptions.RELEVANCE
    };
    let searchQuery: string;

    onMount(() => {
        count = data.result.courseCount;
    });

    // Methods
    const getCourses = async () => {
        isLoading = false;
        let url = '/api/search/courses';
        if (searchQuery) {
            url += `/${searchQuery}`;
        }
        url += `?sort_by=${sortByOption.value.param}&page=${page - 1}&page_size=${pageSize}`;
        const response = await fetch(url);
        const result = (await response.json()) as CourseSearchResult;
        isLoading = false;
        courses = result.courses;
        count = result.courseCount;
        window.scrollTo({ behavior: 'smooth', top: 0 });
    };

    const isDesktop = mediaQuery('(min-width: 768px)');

    let count = 20;
    let page = 1;
    $: pageSize = isDesktop ? 12 : 6;
    $: siblingCount = $isDesktop ? 1 : 0;
</script>

<div class="grid justify-items-center gap-y-4 p-5">
    <div class="container grid max-w-5xl gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>
        <div class="grid grid-cols-[1fr_min-content_min-content_min-content] gap-x-2">
            <div class="relative w-full">
                <Input
                    bind:value={searchQuery}
                    class="w-full"
                    on:input={() => getCourses()}
                    placeholder="Search..."
                    type="email"
                />
                <Fa
                    class="text-surface-400 absolute right-5 top-1/2 -translate-y-1/2 transform"
                    icon={faSearch}
                />
            </div>
            <SortByDropdown
                bind:value={sortByOption}
                on:valuechange={(event) => {
                    sortByOption = event.detail;
                    // paginationSettings.page = 0;
                    page = 1;
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

        <Pagination.Root
            bind:page
            {count}
            let:currentPage
            let:pages
            onPageChange={(newPage) => {
                page = newPage;
                getCourses();
            }}
            perPage={pageSize}
            {siblingCount}
        >
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.PrevButton>
                        <Fa class="h-4 w-4" icon={faChevronLeft} />
                        <span class="hidden sm:block">Previous</span>
                    </Pagination.PrevButton>
                </Pagination.Item>
                {#each pages as page (page.key)}
                    {#if page.type === 'ellipsis'}
                        <Pagination.Item>
                            <Pagination.Ellipsis />
                        </Pagination.Item>
                    {:else}
                        <Pagination.Item>
                            <Pagination.Link isActive={currentPage === page.value} {page}>
                                {page.value}
                            </Pagination.Link>
                        </Pagination.Item>
                    {/if}
                {/each}
                <Pagination.Item>
                    <Pagination.NextButton>
                        <span class="hidden sm:block">Next</span>
                        <Fa class="h-4 w-4" icon={faChevronRight} />
                    </Pagination.NextButton>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination.Root>
    </div>
</div>
