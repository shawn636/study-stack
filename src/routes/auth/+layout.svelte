<script lang="ts">
    import Logo from '$lib/components/logo.svelte';
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
