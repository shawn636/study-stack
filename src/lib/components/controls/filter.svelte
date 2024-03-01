<script lang="ts">
    import { faFilter } from '@fortawesome/free-solid-svg-icons';
    import { type PopupSettings, popup } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';

    let isOpen = false;

    const popupSettings: PopupSettings = {
        event: 'click',
        placement: 'bottom',
        state: (e: Record<string, boolean>) => {
            isOpen = e.state;
        },
        target: 'filter'
    };
</script>

<button
    aria-expanded={isOpen}
    aria-label="Filter"
    class="variant-ghost-primary btn btn-sm hidden justify-center gap-2 text-primary-700 first:items-center dark:text-primary-400 md:flex"
    type="button"
    use:popup={popupSettings}
>
    <Fa class="h-4 w-4" icon={faFilter} />
    <p>Filter</p>
</button>

<div class="card p-4" data-popup="filter">
    <!-- INSERT FILTERS HERE -->
</div>
