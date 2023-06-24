<script lang="ts">
    import Fa from 'svelte-fa';
    import { faSearch } from '@fortawesome/free-solid-svg-icons';
    import { search } from '$lib/stores/controls';

    let value = '';

    $: {
        search.set(value);
    }
</script>

<div class="relative flex flex-flow-col w-full md:max-w-sm">
    <input
        type="text"
        class="py-2 pr-10 pl-4 bg-gray-100 dark:bg-surface-700 border-none rounded-md w-full font-light"
        placeholder="Search..."
    />
    <Fa icon={faSearch} class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
</div>
