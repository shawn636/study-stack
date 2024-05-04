<script lang="ts">
    import HeroCollage from '$lib/components/hero-collage.svelte';
    import { Button } from '$lib/components/ui/button';

    const cta = 'Learn New Skills Online With Top ';
    const ctaUnderline = 'Educators';
    const subheading = `Build Skills With Courses, Certificates, 
                                            and Degrees Online From World-Class 
                                            Universities And Companies`;
    const tags = ['Over 12 million students', 'More than 60,000 courses', 'Learn anything online'];
</script>

<div
    class="dark:bg-primary-700 z-10 grid justify-items-center border border-equipped-blue bg-equipped-blue text-white"
>
    <div
        class="grid max-w-7xl grid-cols-1 justify-items-center gap-x-5 px-5 pb-7 pt-3 md:px-24 lg:grid-cols-[1fr_350px]"
    >
        <div
            class="grid h-full grid-flow-row grid-cols-2 grid-rows-[repeat(4,auto)] gap-x-5 gap-y-5 text-white"
        >
            <h1 class="col-span-2 text-4xl font-semibold">
                <span>{cta}</span>
                <span class="text-secondary-500 underline">{ctaUnderline}</span>
            </h1>

            <p class="col-span-2 row-start-2">{subheading}</p>

            <div class="col-span-2 grid grid-flow-row gap-4 sm:grid-flow-col">
                <Button
                    class="bg-white text-black hover:bg-slate-100"
                    href="/courses"
                    role="link"
                    variant="secondary">Find Courses</Button
                >
                <Button
                    class="bg-black text-white hover:bg-slate-800"
                    href="/auth/register"
                    role="link">Join For Free</Button
                >
            </div>

            <div
                class="col-span-2 grid grid-flow-row-dense items-center justify-items-center gap-4 text-center text-sm md:grid-flow-col-dense"
            >
                {#each tags as tag}
                    <div
                        class="grid grid-cols-[auto_1fr] items-center justify-items-center gap-x-2 whitespace-nowrap"
                    >
                        <div class="h-4 w-4 rounded bg-white" />
                        <div>{tag}</div>
                    </div>
                {/each}
            </div>
        </div>

        <HeroCollage />
    </div>
</div>
<svg
    class="z-negative w-full fill-equipped-blue lg:h-20"
    height="56"
    preserveAspectRatio="none"
    viewBox="0 0 1024 56"
    width="1024"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        d="M0 0H1024V29.8281C935.667 -3.12563 672.802 -4.62048 493 29.8281C301 66.6136 112.333 62.7818 0 29.8281V0Z"
    />
</svg>
