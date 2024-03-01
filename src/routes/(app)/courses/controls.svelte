<script lang="ts">
    import type { DrawerSettings } from '@skeletonlabs/skeleton';

    import DisplaySwitch from '$lib/components/controls/display-switch.svelte';
    import Filter from '$lib/components/controls/filter.svelte';
    import SearchBar from '$lib/components/controls/search-bar.svelte';
    import SortByFilter from '$lib/components/controls/sort-by-filter.svelte';
    import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    import { createEventDispatcher } from 'svelte';
    import Fa from 'svelte-fa';

    const dispatch = createEventDispatcher();
    const drawerStore = getDrawerStore();

    const settings: DrawerSettings = {
        id: 'control-center',
        position: 'right'
    };

    const handleChange = () => {
        dispatch('change');
    };

    export let handleKeydown: (e: KeyboardEvent) => void;
</script>

<div class="grid grid-cols-[1fr_auto] items-center gap-x-1 md:grid-flow-col md:gap-x-2">
    <SearchBar {handleKeydown} />

    <!-- Options -->
    <button
        aria-label="Options"
        class="btn-icon w-min pl-4 text-gray-500 md:hidden"
        on:click={() => drawerStore.open(settings)}
        type="button"
    >
        <Fa icon={faEllipsisV} />
    </button>

    <SortByFilter on:change={handleChange} />

    <DisplaySwitch />

    <Filter />
</div>
