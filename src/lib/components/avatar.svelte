<script lang="ts">
    import Fa from 'svelte-fa';
    import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

    interface VoidFunction {
        (): void;
    }

    let show_edit_photo_overlay = false;
    export let initials = 'AB';
    export let photo_url: string | null = null;
    export let edit_function: VoidFunction | null = null;
    export let width = 'w-16';
    export let height = 'h-16';
    export let text_style = 'text-xl';
    export let font_style = 'font-bold';
    let class_string = '';
    export { class_string as class };
    export let color = '!bg-surface-200 !dark:bg-surface-500';
</script>

<div class="relative inline-block">
    <div
        class="grid items-center {width} {height} {text_style} {font_style} rounded-full justify-items-center {color} {class_string}"
        on:mouseenter={() => {
            show_edit_photo_overlay = true;
        }}
        on:mouseleave={() => {
            show_edit_photo_overlay = false;
        }}
    >
        {#if show_edit_photo_overlay && edit_function}
            <div
                class="absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out rounded-full opacity-0 bg-surface-500/10 dark:bg-surface-700 dark:hover:bg-surface-900/70 hover:bg-surface-500/80 hover:opacity-100"
            >
                <button class="w-full btn-icon" on:click={edit_function}>
                    <Fa icon={faPenToSquare} class="z-10 w-4 text-white }" />
                </button>
            </div>
        {/if}
        {#if photo_url}
            <img
                src={photo_url}
                alt="avatar"
                class="object-cover {width} {height} border border-gray-200 rounded-full shadow-sm dark:border-gray-800"
            />
        {:else}
            {initials}
        {/if}
    </div>
</div>
