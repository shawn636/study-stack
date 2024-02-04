<script lang="ts">
    import Fa from 'svelte-fa';
    import { faSearch } from '@fortawesome/free-solid-svg-icons';
    import { search } from '$lib/stores/controls';

    let value = '';

    $: {
        search.set(value);
    }

    // The hdndleKeydown function is passed as a prop. The default handler does nothing, but this
    // is overridden in the parent component to handle the search bar's keydown event.
    export let handleKeydown: (e: KeyboardEvent) => void;
</script>

<div class="relative flex w-full flex-flow-col md:max-w-sm">
    <input
        id="search-bar"
        type="text"
        class="w-full py-2 pl-4 pr-10 font-light bg-gray-100 border-none dark:bg-surface-700 rounded-md"
        placeholder="Search..."
        bind:value
        on:keydown={handleKeydown}
    />
    <Fa icon={faSearch} class="absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2" />
</div>
