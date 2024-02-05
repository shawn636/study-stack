<script lang="ts">
    import Fa from 'svelte-fa';
    import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

    interface VoidFunction {
        (): void;
    }

    let showEditPhotoOverlay = false;
    export let initials = 'AB';
    export let photoUrl: string | null = null;
    export let editFunction: VoidFunction | null = null;
    export let width = 'w-16';
    export let height = 'h-16';
    export let textStyle = 'text-xl';
    export let fontStyle = 'font-bold';
    let classString = '';
    export { classString as class };
    export let color = '!bg-surface-200 !dark:bg-surface-500';

    $: containerBaseClass = `grid items-center ${width} ${height} ${textStyle} ${fontStyle} rounded-full justify-items-center ${color} ${classString}`;
    $: imageBaseClass = `object-cover ${width} ${height} border border-gray-200 rounded-full shadow-sm dark:border-gray-800`;
</script>

<div class="relative inline-block">
    <div
        class={containerBaseClass}
        role="button"
        tabindex="0"
        on:mouseenter={() => {
            showEditPhotoOverlay = true;
        }}
        on:mouseleave={() => {
            showEditPhotoOverlay = false;
        }}
    >
        {#if showEditPhotoOverlay && editFunction}
            <div
                class="absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out rounded-full opacity-0 bg-surface-500/10 dark:bg-surface-700 dark:hover:bg-surface-900/70 hover:bg-surface-500/80 hover:opacity-100"
            >
                <button class="w-full btn-icon" on:click={editFunction}>
                    <Fa icon={faPenToSquare} size="lg" class="z-10 text-white" />
                </button>
            </div>
        {/if}
        {#if photoUrl}
            <img src={photoUrl} alt="avatar" class={imageBaseClass} />
        {:else}
            {initials}
        {/if}
    </div>
</div>
