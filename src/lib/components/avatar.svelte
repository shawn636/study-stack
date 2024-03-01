<script lang="ts">
    import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    interface VoidFunction {
        (): void;
    }

    let showEditPhotoOverlay = false;
    export let initials = 'AB';
    export let photoUrl: null | string = null;
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
        on:mouseenter={() => {
            showEditPhotoOverlay = true;
        }}
        on:mouseleave={() => {
            showEditPhotoOverlay = false;
        }}
        role="button"
        tabindex="0"
    >
        {#if showEditPhotoOverlay && editFunction}
            <div
                class="absolute inset-0 flex items-center justify-center rounded-full bg-surface-500/10 opacity-0 transition-all duration-200 ease-in-out hover:bg-surface-500/80 hover:opacity-100 dark:bg-surface-700 dark:hover:bg-surface-900/70"
            >
                <button class="btn-icon w-full" on:click={editFunction}>
                    <Fa class="z-10 text-white" icon={faPenToSquare} size="lg" />
                </button>
            </div>
        {/if}
        {#if photoUrl}
            <img alt="avatar" class={imageBaseClass} src={photoUrl} />
        {:else}
            {initials}
        {/if}
    </div>
</div>
