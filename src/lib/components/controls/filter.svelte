<script lang="ts">
    import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
    import { faFilter } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    let isOpen = false;

    const popupSettings: PopupSettings = {
        event: 'click',
        target: 'filter',
        placement: 'bottom',
        state: (e: Record<string, boolean>) => {
            isOpen = e.state;
        }
    };
</script>

<button
    aria-label="Filter"
    aria-expanded={isOpen}
    type="button"
    class="justify-center hidden btn btn-sm first:items-center gap-2 variant-ghost-primary text-primary-700 dark:text-primary-400 md:flex"
    use:popup={popupSettings}
>
    <Fa icon={faFilter} class="w-4 h-4" />
    <p>Filter</p>
</button>

<div class="p-4 card" data-popup="filter">
    <!-- INSERT FILTERS HERE -->
</div>
