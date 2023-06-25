<script lang="ts">
    import { popup, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import { sortBy, sortByValues } from '$lib/stores/controls';

    let sortByValue = 'Relevance';

    $: {
        sortBy.set(sortByValue);
    }
</script>

<div class="hidden md:grid grid-flow-col items-center w-min gap-2">
    <aside class="whitespace-nowrap">Sort by:</aside>
    <button
        type="button"
        class="btn btn-sm variant-soft-surface w-32"
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
    <div class="grid grid-flow-row rounded-xl shadow-xl" data-popup="sortby">
        <RadioGroup
            class="card grid grid-flow-row rounded-xl shadow-xl border-none p-2"
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
