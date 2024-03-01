<script lang="ts">
    import Logo from '$lib/components/logo.svelte';
    import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell
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
</AppShell>
