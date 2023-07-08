<script lang="ts">
    import { popup } from '@skeletonlabs/skeleton';
    import { faFilter } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
</script>

<button
    aria-label="Filter"
    type="button"
    class="btn btn-sm first:items-center justify-center gap-2 variant-ghost-primary text-primary-700 dark:text-primary-400 hidden md:flex"
    use:popup={{
        event: 'click',
        target: 'filter',
        placement: 'bottom'
    }}
>
    <Fa icon={faFilter} class="w-4 h-4" />
    <p>Filter</p>
</button>

<div class="card p-4" data-popup="filter">
    <!-- INSERT FILTERS HERE -->
</div>
