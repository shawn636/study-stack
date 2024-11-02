<script lang="ts">
    import Logo from '$lib/components/logo.svelte';
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    const imageUrl =
        'https://imagedelivery.net/06fAhz9XSvNypOfNBz1x-Q/305548df-b9a7-4c4b-d252-44702a356d00/vertical';

    const quote =
        "“We fail in our duty to study god's word not so much because it is difficult to understand, not so much because it is dull and boring, but because it is work”";
    const quoteAuthor = 'R.C. Sproul';
</script>

<div class="grid min-h-screen md:grid-cols-[1fr_1fr]" data-testid="app-shell">
    <div class="relative z-10 hidden bg-gray-500 md:block">
        <img alt="Equipped" class="h-svh w-full object-cover" src={imageUrl} />
        <div class="absolute top-0 z-20 p-10">
            <a href="/">
                <Logo colorClass="text-white" />
            </a>
        </div>
        <div class="absolute bottom-0 z-20 flex flex-col gap-y-2 p-10 text-white">
            <p class=" leading-loose">{quote}</p>
            <p class="text-sm font-light">{quoteAuthor}</p>
        </div>
    </div>
    {@render children?.()}
</div>
