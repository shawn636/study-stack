<script lang="ts">
    import type { PageServerData } from './$types';

    import Categories from './categories.svelte';
    import HeroBanner from './hero-banner.svelte';
    interface Props {
        data: PageServerData;
    }

    const { data }: Props = $props();
</script>

<svelte:head>
    <title>StudyStack Online Learning</title>

    <meta content="StudyStack" name="twitter:title" />
    <meta content="Deepen your faith and study the Bible" name="twitter:description" />
    <meta content="Deepen your faith and study the Bible" name="Description" />
</svelte:head>
<HeroBanner />
<Categories categorySummaries={data.categorySummaries} />
