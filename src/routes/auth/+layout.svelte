<script lang="ts">
    import Logo from '$lib/components/logo.svelte';
    // import { AppShell } from '@skeletonlabs/skeleton';
</script>

<div class="grid min-h-screen md:grid-cols-[2fr_1fr]" data-testid="app-shell">
    <div class="container grid h-full grid-flow-row items-center justify-items-center">
        <slot />
    </div>
    <div
        class="z-10 hidden items-center justify-items-center rounded-l-3xl bg-gradient-to-tr from-primary-700 to-primary-500 shadow-xl md:grid md:place-items-center"
    >
        <Logo layout="vertical" />
    </div>
</div>
<!-- <AppShell
    slotSidebarRight="bg-gradient-to-tr from-primary-700 to-primary-500 w-64 hidden md:block rounded-l-3xl shadow-xl"
>
    <div class="container grid h-full grid-flow-row items-center justify-items-center">
        <slot />
    </div>

    <svelte:fragment slot="sidebarRight">
        <div class="grid h-full items-center justify-items-center">
            <Logo layout="vertical" />
        </div>
    </svelte:fragment>
</AppShell> -->
