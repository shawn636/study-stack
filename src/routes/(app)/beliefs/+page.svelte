<script lang="ts">
    import Fa from 'svelte-fa';

    import type { ImageMeta } from './image-meta';

    import { beliefs } from './beliefs-content';

    const headerImage: ImageMeta = {
        alt: 'closeup  of a bible  with a hand flipping through the pages',
        src: 'https://imagedelivery.net/06fAhz9XSvNypOfNBz1x-Q/6ffeff7c-4292-4622-9ee6-e4d01ad0c300/public'
    };
</script>

<div class="relative h-64">
    <img alt={headerImage.alt} class="h-full w-full object-cover" src={headerImage.src} />
    <div class="absolute inset-0 grid items-center justify-items-center">
        <h3 class="h1 font-bold text-white">What We Believe</h3>
    </div>
</div>

<div class="lg:mx-30 md:mx-30 mx-5 lg:mx-auto lg:max-w-4xl">
    <h2 class="h2 mt-10 text-4xl font-medium">Our Core Beliefs</h2>
    <p class="mt-8 leading-7 tracking-wide">
        Commodo mollit velit excepteur reprehenderit consequat in proident sunt occaecat cupidatat
        exercitation dolore. Quis deserunt ex cillum exercitation exercitation labore sint consequat
        fugiat sunt adipisicing eu amet nulla. Lorem cillum elit nisi elit est id est esse proident
        nulla aliqua incididunt. Minim laboris eu nostrud cillum nisi esse amet. Consequat mollit
        dolore et cupidatat laboris in veniam eiusmod cupidatat laborum laboris occaecat velit aute
        eu. Aliqua velit Lorem cillum labore proident dolor aliqua ipsum ad eiusmod. Dolore et magna
        velit ea dolor exercitation velit fugiat duis reprehenderit voluptate mollit enim tempor
        laboris. Ea consectetur sit enim veniam adipisicing magna nisi Lorem reprehenderit ex.
    </p>
    <div class="my-10 grid grid-cols-1 justify-items-center gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {#each beliefs as { content, icon, title }}
            <div
                class="col-span-1 flex w-72 flex-col items-start gap-y-5 rounded-xl border-none bg-surface-50/30 px-6 py-10 outline-none transition-transform hover:-translate-y-2 hover:shadow-md dark:bg-surface-800/30"
            >
                <Fa class="text-primary-800 dark:text-white" {icon} size="lg" />
                <h4 class="h2 font-black text-primary-800 dark:text-white">{title}</h4>
                <p class="tracking-wider text-slate-700 dark:text-surface-300">{content}</p>
            </div>
        {/each}
    </div>
</div>
