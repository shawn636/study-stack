<script lang="ts">
    import Feature1 from './feature1.svelte';
    import Hero from './hero.svelte';
    import Pricing from './pricing.svelte';
    import Testimonials from './testimonials.svelte';
</script>

<main class="grid grid-flow-row gap-10 py-20 pt-5">
    <Hero />
    <Feature1 />
    <Testimonials class="bg-muted py-5" />
    <Pricing />
</main>
