<script lang="ts">
    import type { CourseSortByOption } from '$lib/models/types/course-sort-by-options';

    import { CourseSortByOptions } from '$lib/models/types/course-sort-by-options';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import { type PopupSettings, RadioGroup, RadioItem, popup } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';

    const sortByOptions: CourseSortByOption[] = Object.values(CourseSortByOptions);

    let isOpen = false;
    const popupSettings: PopupSettings = {
        event: 'click',
        placement: 'bottom',
        state: (e: Record<string, boolean>) => {
            isOpen = e.state;
        },
        target: 'course-sortby-menu'
    };

    let buttonElement: HTMLButtonElement;

    export let value: CourseSortByOption = CourseSortByOptions.RELEVANCE;
</script>

<div class="flex items-center gap-1">
    <aside class="text-nowrap">Sort By:</aside>
    <button
        aria-expanded={isOpen}
        bind:this={buttonElement}
        class="variant-filled-primary btn grid grid-flow-col items-center justify-items-center gap-x-1 text-white dark:text-white"
        type="button"
        use:popup={popupSettings}
    >
        {value.label}
        <Fa class="text-white" icon={faChevronDown} size="sm" />
    </button>
</div>

<div class="card z-10" data-popup="course-sortby-menu">
    <RadioGroup
        active="variant-filled-primary text-white dark:text-white"
        background="bg-surface-100-800-token"
        border="border-none"
        flexDirection="flex-col"
        hover="hover:variant-soft-primary"
        id="course-sortby-menu-radio-group"
    >
        {#each Object.values(sortByOptions) as sortByOption}
            <RadioItem
                bind:group={value}
                name="sort-by"
                on:click={() => {
                    buttonElement.click();
                }}
                value={sortByOption}
            >
                {sortByOption.label}
            </RadioItem>
        {/each}
    </RadioGroup>
    <div class="bg-surface-100-800-token arrow" />
</div>
