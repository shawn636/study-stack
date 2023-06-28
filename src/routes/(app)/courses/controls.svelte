<script lang="ts">
    import Fa from 'svelte-fa';
    import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
    import { createEventDispatcher } from 'svelte';

    import type { DrawerSettings } from '@skeletonlabs/skeleton';
    import { drawerStore } from '@skeletonlabs/skeleton';
    import SearchBar from '$lib/components/controls/search-bar.svelte';
    import SortByFilter from '$lib/components/controls/sort-by-filter.svelte';
    import DisplaySwitch from '$lib/components/controls/display-switch.svelte';
    import Filter from '$lib/components/controls/filter.svelte';

    const dispatch = createEventDispatcher();

    const settings: DrawerSettings = {
        id: 'control-center',
        position: 'right'
    };

    const handleChange = () => {
        dispatch('change');
    };

    export let handleKeydown: (e: KeyboardEvent) => void;
</script>

<div class="grid grid-cols-[1fr_auto] md:grid-flow-col items-center gap-x-1 md:gap-x-2">
    <SearchBar {handleKeydown} />

    <!-- Options -->
    <button
        type="button"
        class="btn-icon text-gray-500 w-min pl-4 md:hidden"
        on:click={() => drawerStore.open(settings)}
    >
        <Fa icon={faEllipsisV} />
    </button>

    <SortByFilter on:change={handleChange} />

    <DisplaySwitch />

    <Filter />
</div>
