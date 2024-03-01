<script lang="ts">
    import { sortBy, sortByValues } from '$lib/stores/controls';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import { type PopupSettings, RadioGroup, RadioItem, popup } from '@skeletonlabs/skeleton';
    import { createEventDispatcher } from 'svelte';
    import Fa from 'svelte-fa';

    const dispatch = createEventDispatcher();
    let sortByValue = 'Relevance';
    let isOpen = false;

    //  Notify parent components of sorting option changes
    $: {
        sortBy.set(sortByValue);
        dispatch('change');
    }

    const popupSettings: PopupSettings = {
        closeQuery: '[data-popup="sortby"]',
        event: 'click',
        placement: 'bottom',
        state: (e: Record<string, boolean>) => {
            isOpen = e.state;
        },
        target: 'sortby'
    };
</script>

<div class="hidden w-min grid-flow-col items-center gap-2 md:grid">
    <aside class="whitespace-nowrap">Sort by:</aside>
    <button
        aria-expanded={isOpen}
        aria-label="Sort by"
        class="variant-soft-surface btn btn-sm w-32"
        type="button"
        use:popup={popupSettings}
    >
        <p>{sortByValue}</p>
        <Fa class="ml-2" icon={faChevronDown} />
    </button>

    <!-- Popup -->
    <div class="card z-10 rounded-xl shadow-xl" data-popup="sortby">
        <RadioGroup
            class="card grid grid-flow-row rounded-xl border-none p-2 shadow-xl"
            data-popup="sortby"
            display="flex-col"
            rounded="rounded-container-token"
        >
            {#each sortByValues as value}
                <RadioItem
                    bind:group={sortByValue}
                    class="mb-2"
                    data-popup="sortby"
                    name="sort-by"
                    {value}>{value}</RadioItem
                >
            {/each}
        </RadioGroup>
    </div>
</div>
