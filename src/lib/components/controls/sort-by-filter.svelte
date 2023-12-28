<script lang="ts">
    import { popup, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import { sortBy, sortByValues } from '$lib/stores/controls';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let sortByValue = 'Relevance';

    $: {
        sortBy.set(sortByValue);
        dispatch('change');
    }
</script>

<div class="items-center hidden md:grid grid-flow-col w-min gap-2">
    <aside class="whitespace-nowrap">Sort by:</aside>
    <button
        aria-label="Sort by"
        type="button"
        class="w-32 btn btn-sm variant-soft-surface"
        use:popup={{
            event: 'click',
            target: 'sortby',
            placement: 'bottom',
            closeQuery: '[data-popup="sortby"]'
        }}
    >
        <p>{sortByValue}</p>
        <Fa icon={faChevronDown} class="ml-2" />
    </button>
    <!-- Popup -->
    <div class="shadow-xl grid grid-flow-row rounded-xl" data-popup="sortby">
        <RadioGroup
            class="p-2 border-none shadow-xl card grid grid-flow-row rounded-xl"
            data-popup="sortby"
            display="flex-col"
            rounded="rounded-container-token"
        >
            {#each sortByValues as value}
                <RadioItem
                    bind:group={sortByValue}
                    name="sort-by"
                    {value}
                    class="mb-2"
                    data-popup="sortby">{value}</RadioItem
                >
            {/each}
        </RadioGroup>
    </div>
</div>
