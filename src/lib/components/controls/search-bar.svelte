<script lang="ts">
    import { search } from '$lib/stores/controls';
    import { faSearch } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    let value = '';

    $: {
        search.set(value);
    }

    // The hdndleKeydown function is passed as a prop. The default handler does nothing, but this
    // is overridden in the parent component to handle the search bar's keydown event.
    export let handleKeydown: (e: KeyboardEvent) => void;
</script>

<div class="flex-flow-col relative flex w-full md:max-w-sm">
    <input
        bind:value
        class="w-full rounded-md border-none bg-gray-100 py-2 pl-4 pr-10 font-light dark:bg-surface-700"
        id="search-bar"
        on:keydown={handleKeydown}
        placeholder="Search..."
        type="text"
    />
    <Fa class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" icon={faSearch} />
</div>
