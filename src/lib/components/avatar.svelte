<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import Fa from 'svelte-fa';
    import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

    interface VoidFunction {
        (): void;
    }

    let showEditPhotoOverlay = $state(false);

    interface Props {
        initials?: string;
        photoUrl?: string | null;
        editFunction?: VoidFunction | null;
        width?: string;
        height?: string;
        textStyle?: string;
        fontStyle?: string;
        class?: string;
        color?: string;
    }

    const {
        initials = 'AB',
        photoUrl = null,
        editFunction = null,
        width = 'w-16',
        height = 'h-16',
        textStyle = 'text-xl',
        fontStyle = 'font-bold',
        class: classString = '',
        color = '!bg-surface-200 !dark:bg-surface-500'
    }: Props = $props();

    const containerBaseClass = $derived(
        `grid items-center ${width} ${height} ${textStyle} ${fontStyle} rounded-full justify-items-center ${color} ${classString}`
    );
    const imageBaseClass = $derived(
        `object-cover ${width} ${height} border border-gray-200 rounded-full shadow-sm dark:border-gray-800`
    );
</script>

<div class="relative inline-block">
    <div
        class={containerBaseClass}
        onmouseenter={() => {
            showEditPhotoOverlay = true;
        }}
        onmouseleave={() => {
            showEditPhotoOverlay = false;
        }}
        role="button"
        tabindex="0"
    >
        {#if showEditPhotoOverlay && editFunction}
            <div
                class="bg-surface-500/10 hover:bg-surface-500/80 dark:bg-surface-700 dark:hover:bg-surface-900/70 absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-all duration-200 ease-in-out hover:opacity-100"
            >
                <Button class="w-full" onclick={editFunction}>
                    <Fa class="z-10 text-white" icon={faPenToSquare} size="lg" />
                </Button>
            </div>
        {/if}
        {#if photoUrl}
            <img alt="avatar" class={imageBaseClass} src={photoUrl} />
        {:else}
            {initials}
        {/if}
    </div>
</div>
