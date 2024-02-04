<script lang="ts">
    import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
    import { faFilter } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    let is_open = false;

    const popup_settings: PopupSettings = {
        event: 'click',
        target: 'filter',
        placement: 'bottom',
        state: (e: Record<string, boolean>) => {
            is_open = e.state;
        }
    };
</script>

<button
    aria-label="Filter"
    aria-expanded={is_open}
    type="button"
    class="justify-center hidden btn btn-sm first:items-center gap-2 variant-ghost-primary text-primary-700 dark:text-primary-400 md:flex"
    use:popup={popup_settings}
>
    <Fa icon={faFilter} class="w-4 h-4" />
    <p>Filter</p>
</button>

<div class="p-4 card" data-popup="filter">
    <!-- INSERT FILTERS HERE -->
</div>
