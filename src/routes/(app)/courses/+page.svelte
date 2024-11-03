<script lang="ts">
    import type { CourseSearchGetResponse } from '$lib/api/types/courses';
    import type { PageServerData } from './$types';
    import type { ToggleCourseFavoritePayload } from '$lib/models/types/toggle-user-course-favorite-event';

    import {
        faBinoculars,
        faChevronLeft,
        faChevronRight,
        faSearch
    } from '@fortawesome/free-solid-svg-icons';
    import {
        HIGHEST_RATING,
        LOWEST_PRICE,
        RELEVANCE
    } from '$lib/models/types/course-sort-by-options';

    import * as Pagination from '$lib/components/ui/pagination/index';

    import { apiClientSingleton as client } from '$lib/api';
    import CourseGridItem from '$lib/components/course-grid-item.svelte';
    import CourseListItem from '$lib/components/course-list-item.svelte';
    import Fa from 'svelte-fa';
    import { goto } from '$app/navigation';
    import GridPlaceholder from '$lib/components/placeholders/course-grid-item.svelte';
    import { Input } from '$lib/components/ui/input/index';
    import { onMount } from 'svelte';
    import SortByDropdown from '$lib/components/controls/sort-by-dropdown.svelte';
    import { toast } from 'svelte-sonner';
    import ViewToggle from '$lib/components/controls/view-toggle.svelte';

    import { courseResults, isLoading } from './stores';

    let debounceTimeout: ReturnType<typeof setTimeout>;
    interface Props {
        data: PageServerData;
    }

    const { data }: Props = $props();

    // State
    let selectedView: 'grid' | 'list' = $state('grid');

    let sortByOption = $state(RELEVANCE.param);
    let searchQuery: string = $state('');

    onMount(async () => {
        await getCourses();
    });

    // Methods
    const getOption = (value: string) => {
        const options = [HIGHEST_RATING, LOWEST_PRICE, RELEVANCE];
        const option = options.find((o) => o.param === value);

        return option ?? RELEVANCE;
    };

    const getCourses = async () => {
        try {
            isLoading.set(true);

            let response: CourseSearchGetResponse;
            if (data.user) {
                response = await client.courses.getCoursesWithFavorites(
                    searchQuery,
                    getOption(sortByOption),
                    page - 1,
                    pageSize,
                    data.user.id
                );
            } else {
                response = await client.courses.getCourses(
                    searchQuery,
                    getOption(sortByOption),
                    page - 1,
                    pageSize
                );
            }

            if (response.success) {
                courseResults.set(response.data.courses);
                count = response.data.totalCourses;
            } else {
                toast.error('An error occurred while fetching courses. Please try again later.');
            }
        } catch (error) {
            toast.error('An error occurred while fetching courses. Please try again later.');
        }
        isLoading.set(false);
        window.scrollTo({ behavior: 'smooth', top: 0 });
    };

    const debounceGetCourses = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            getCourses();
        }, 300); // Adjust the delay (in milliseconds) as needed
    };

    const handleToggleCourseFavorite = async (payload: ToggleCourseFavoritePayload) => {
        if (!data.user) {
            goto('/auth/login');
            return;
        }

        try {
            if (payload.current) {
                courseResults.addFavorite(payload.courseId);
                const result = await client.users.favoriteCourse(
                    data.user?.id ?? '',
                    payload.courseId
                );

                if (!result.success) {
                    throw new Error(result.message);
                }
            } else {
                courseResults.removeFavorite(payload.courseId);
                const result = await client.users.unfavoriteCourse(
                    data.user?.id ?? '',
                    payload.courseId
                );

                if (!result.success) {
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            toast.error(
                'An error occurred while updating course favorite. Please try again later.'
            );
            if (payload.previous) {
                courseResults.addFavorite(payload.courseId);
            } else {
                courseResults.removeFavorite(payload.courseId);
            }
        }
    };

    // let innerWidth = $state(0);
    // const isDesktop = $derived(innerWidth >= 768);
    const isDesktop = $state(false);
    // const isDesktop = mediaQuery('(min-width: 768px)');

    let count = $state(20);
    let page = $state(1);
    const pageSize = $derived(isDesktop ? 12 : 6);
    const siblingCount = $derived(isDesktop ? 1 : 0);
</script>

<!-- <svelte:window bind:innerWidth /> -->

<div class="grid justify-items-center gap-y-4 p-5">
    <div class="grid max-w-5xl gap-y-4">
        <h1 class="text-lg font-bold">Find a Course</h1>
        <div
            class="grid grid-cols-[1fr_auto] grid-rows-2 gap-x-2 gap-y-2 sm:grid-cols-[1fr_auto_auto]"
        >
            <div class="relative col-span-full w-full md:col-span-1">
                <Input
                    bind:value={searchQuery}
                    class="w-full"
                    oninput={() => debounceGetCourses()}
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
                handleValueChange={(value) => {
                    sortByOption = value;
                    page = 1;
                    getCourses();
                }}
            />
            <ViewToggle bind:value={selectedView} />
        </div>
        {#if $isLoading}
            <div
                class="grid justify-center gap-y-4 sm:grid-cols-[repeat(2,auto)] sm:justify-between lg:grid-cols-[repeat(3,auto)]"
            >
                {#each Array(20) as _}
                    <div class="!-z-20">
                        <GridPlaceholder />
                    </div>
                {/each}
            </div>
        {:else if $courseResults.length === 0}
            <div class="content-visibility-auto mb-6 mt-8 grid items-center justify-items-center">
                <div class="flex-flow-col card flex items-center gap-x-2 p-4">
                    <Fa class="text-xl" icon={faBinoculars} />
                    <span>No courses found</span>
                </div>
            </div>
        {:else if selectedView === 'list'}
            <div class="flex flex-col gap-y-6">
                {#each $courseResults as courseResult}
                    <CourseListItem
                        {courseResult}
                        toggleFavorite={(e) => handleToggleCourseFavorite(e)}
                    />
                {/each}
            </div>
        {:else}
            <div
                class="grid justify-center gap-x-8 gap-y-8 sm:grid-cols-[repeat(2,auto)] sm:justify-between lg:grid-cols-[repeat(3,auto)]"
            >
                {#each $courseResults as courseResult}
                    <CourseGridItem
                        {courseResult}
                        toggleFavorite={(e) => handleToggleCourseFavorite(e)}
                    />
                {/each}
            </div>
        {/if}

        <Pagination.Root
            bind:page
            {count}
            onPageChange={(newPage) => {
                page = newPage;
                getCourses();
            }}
            perPage={pageSize}
            {siblingCount}
        >
            {#snippet children({ currentPage, pages })}
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
            {/snippet}
        </Pagination.Root>
    </div>
</div>
