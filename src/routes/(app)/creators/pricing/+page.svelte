<script lang="ts">
    import type { PageData } from './$types';
    import Pricing from '../(components)/pricing.svelte';

    interface Props {
        data: PageData;
    }

    const { data }: Props = $props();
</script>

<main class="grid grid-flow-row gap-20 py-20 pt-5">
    <Pricing priceData={data.priceData} />
</main>
