<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import { cn } from '$lib/utils';
    import Fa from 'svelte-fa';
    import { faCheck } from '@fortawesome/free-solid-svg-icons';
    import { mode } from 'mode-watcher';

    interface Props {
        class?: string;
    }
    const { class: className }: Props = $props();
</script>

<section class={cn(className, 'bg-muted')}>
    <div class="container">
        <div class="grid gap-4 py-5 md:grid-cols-3 md:gap-16">
            <h2 class="mb-4 text-4xl font-medium md:mb-0">
                Build Courses that Captivate and Inspire
            </h2>
            <ul class="flex flex-col gap-4 text-muted-foreground">
                <li class="flex items-center gap-2">
                    <Fa icon={faCheck} class="size-4" /> Interactive Modules for Active Learning
                </li>
                <li class="flex items-center gap-2">
                    <Fa icon={faCheck} class="size-4" /> Drag-and-Drop Components for Easy Design
                </li>
                <li class="flex items-center gap-2">
                    <Fa icon={faCheck} class="size-4" /> Seamless, Intuitive Layouts
                </li>
            </ul>
            <ul class="flex flex-col gap-4 text-muted-foreground">
                <li class="flex items-center gap-2">
                    <Fa icon={faCheck} class="size-4" /> Tools to Engage and Track Student Progress
                </li>
                <li class="flex items-center gap-2">
                    <Fa icon={faCheck} class="size-4" /> Earn Money for Sharing Your Expertise
                </li>
            </ul>
        </div>
    </div>
</section>
<section>
    <div class="container">
        <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-lg border">
                <div class="relative p-1">
                    <img
                        src={$mode === 'light'
                            ? '/images/studying-light.svg'
                            : '/images/studying-dark.svg'}
                        alt="Engaging Interactive Tools"
                        class="mx-auto max-h-96 w-full rounded-t-lg bg-muted object-cover md:max-h-64"
                    />
                    <Badge variant="outline" class="absolute left-5 top-5 bg-primary-foreground">
                        Interactive Learning
                    </Badge>
                </div>
                <div>
                    <div class="mb-3 px-6 pt-6">
                        <h3 class="font-medium">Engage with Interactive Modules</h3>
                        <p class="text-muted-foreground">
                            Bring your content to life with tools designed to keep students engaged.
                        </p>
                    </div>
                    <div class="h-px border-t border-dashed"></div>
                    <ul class="text-muted-foreground">
                        <li class="flex items-start gap-2 px-6 py-3">
                            <Fa icon={faCheck} class="mt-1 size-4 shrink-0" />
                            Create dynamic, interactive lessons
                        </li>
                        <div class="h-px border-t border-dashed"></div>
                        <li class="flex items-start gap-2 px-6 py-3">
                            <Fa icon={faCheck} class="mt-1 size-4 shrink-0" />
                            Track student progress with built-in analytics
                        </li>
                        <div class="h-px border-t border-dashed"></div>
                        <li class="flex items-start gap-2 px-6 py-3">
                            <Fa icon={faCheck} class="mt-1 size-4 shrink-0" />
                            Easy-to-use drag-and-drop design tools
                        </li>
                    </ul>
                </div>
            </div>

            <div class="rounded-lg border">
                <div class="relative p-1">
                    <img
                        src={$mode === 'light'
                            ? '/images/predictive-analytics-light.svg'
                            : '/images/predictive-analytics-dark.svg'}
                        alt="Support Tools"
                        class="max-h-96 w-full rounded-t-lg bg-muted object-cover object-top md:max-h-64"
                    />
                    <Badge variant="outline" class="absolute left-5 top-5 bg-primary-foreground">
                        Creator Support
                    </Badge>
                </div>
                <div>
                    <div class="mb-3 px-6 pt-6">
                        <h3 class="font-medium">Tools to Help You Thrive</h3>
                        <p class="text-muted-foreground">
                            We provide everything you need to grow as a creator and connect with
                            students.
                        </p>
                    </div>
                    <div class="h-px border-t border-dashed"></div>
                    <ul class="text-muted-foreground">
                        <li class="flex items-start gap-2 px-6 py-3">
                            <Fa icon={faCheck} class="mt-1 size-4 shrink-0" />
                            Support tools tailored for course creators
                        </li>
                        <div class="h-px border-t border-dashed"></div>
                        <li class="flex items-start gap-2 px-6 py-3">
                            <Fa icon={faCheck} class="mt-1 size-4 shrink-0" />
                            Insights and analytics to improve student engagement
                        </li>
                        <div class="h-px border-t border-dashed"></div>
                        <li class="flex items-start gap-2 px-6 py-3">
                            <Fa icon={faCheck} class="mt-1 size-4 shrink-0" />
                            Earn as you inspire and teach others
                        </li>
                    </ul>
                </div>
            </div>

            <div class="rounded-lg border">
                <div class="relative p-1">
                    <img
                        src={$mode === 'light'
                            ? '/images/building-blocks-light.svg'
                            : '/images/building-blocks-dark.svg'}
                        alt="Seamless Course Building"
                        class="max-h-96 w-full rounded-t-lg bg-muted object-cover object-top md:max-h-64"
                    />
                    <Badge variant="outline" class="absolute left-5 top-5 bg-primary-foreground">
                        Seamless Design
                    </Badge>
                </div>
                <div>
                    <div class="mb-3 px-6 pt-6">
                        <h3 class="font-medium">Seamless Course Building</h3>
                        <p class="text-muted-foreground">
                            Enjoy a streamlined, intuitive experience from start to publish.
                        </p>
                    </div>
                    <div class="h-px border-t border-dashed"></div>
                    <ul class="text-muted-foreground">
                        <li class="flex items-start gap-2 px-6 py-3">
                            <Fa icon={faCheck} class="mt-1 size-4 shrink-0" />
                            Clean, intuitive layout for easy course creation
                        </li>
                        <div class="h-px border-t border-dashed"></div>
                        <li class="flex items-start gap-2 px-6 py-3">
                            <Fa icon={faCheck} class="mt-1 size-4 shrink-0" />
                            Simple, drag-and-drop components for hands-on design
                        </li>
                        <div class="h-px border-t border-dashed"></div>
                        <li class="flex items-start gap-2 px-6 py-3">
                            <Fa icon={faCheck} class="mt-1 size-4 shrink-0" />
                            Designed for a seamless experience on all devices
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
