<script lang="ts">
    import type { PageData } from './$types';

    import Feature1 from './(components)/feature1.svelte';
    import Hero from './(components)/hero.svelte';
    import Pricing from './(components)/pricing.svelte';
    import Testimonials from './(components)/testimonials.svelte';

    interface Props {
        data: PageData;
    }

    const { data }: Props = $props();
</script>

<main class="grid grid-flow-row gap-10 py-20 pt-5">
    <Hero />
    <Feature1 />
    <Testimonials class="bg-muted py-5" />
    <Pricing priceData={data.priceData} />
</main>
