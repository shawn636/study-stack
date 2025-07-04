<script lang="ts">
    import { faChalkboardTeacher, faLightbulb, faUser } from '@fortawesome/free-solid-svg-icons';
    import { Button } from '$lib/components/ui/button';
    import Fa from 'svelte-fa';
    import HeroCollage from '$lib/components/hero-collage.svelte';
    import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
    import Wave from './(components)/wave.svelte';

    const cta = 'Learn New Skills Online With Top ';
    const ctaUnderline = 'Educators';
    const subheading = `Build Skills With Courses, Certificates, 
                                            and Degrees Online From World-Class 
                                            Universities And Companies`;

    interface Tag {
        icon: IconDefinition;
        text: string;
    }

    const tags: Tag[] = [
        {
            icon: faUser,
            text: 'Over 12 million students'
        },
        {
            icon: faChalkboardTeacher,
            text: 'More than 60,000 courses'
        },
        {
            icon: faLightbulb,
            text: 'Learn anything online'
        }
    ];
</script>

<div
    class="dark:bg-primary-700 z-10 grid justify-items-center border border-study-stack-blue bg-study-stack-blue text-white"
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
                        <!-- <div class="h-4 w-4 rounded bg-white"></div> -->
                        <Fa icon={tag.icon} class="h-4 w-4 text-white" />
                        <div>{tag.text}</div>
                    </div>
                {/each}
            </div>
        </div>

        <HeroCollage />
    </div>
</div>
<div class="relative h-[56px] overflow-hidden">
    <Wave
        class="bottom-8 -z-10 h-6 fill-[#3B90D8]/50  dark:fill-[#1A5180]/50 sm:h-8 md:bottom-6 md:h-10 lg:h-12 xl:h-14"
        style="animation-duration: 25s; animation-delay: 4s;"
        variantNumber={1}
    />
    <Wave
        class="bottom-4 -z-20 fill-[#7AB4E4]/50 dark:fill-[#113553]/50 md:bottom-1"
        style="animation-duration: 15s;"
        variantNumber={1}
    />
    <Wave
        class="bottom-2 -z-30 fill-[#A4CBED]/50 dark:fill-[#0C283D]/50 md:bottom-0"
        style="animation-duration: 20s; animation-delay: 6s;"
        variantNumber={1}
    />
    <svg
        class="z-negative h-10 w-full fill-study-stack-blue md:h-14"
        preserveAspectRatio="none"
        viewBox="0 0 1024 56"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M0 0H1024V29.8281C935.667 -3.12563 672.802 -4.62048 493 29.8281C301 66.6136 112.333 62.7818 0 29.8281V0Z"
        />
    </svg>
</div>
