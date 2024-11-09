<script lang="ts">
    import { Avatar, AvatarImage } from '$lib/components/ui/avatar';

    import { Button } from '$lib/components/ui/button';
    import { cn } from '$lib/utils';
    import Fa from 'svelte-fa';
    import { faStar } from '@fortawesome/free-solid-svg-icons';

    interface Props {
        class?: string;
    }
    const { class: className }: Props = $props();
</script>

<section class={cn(className)}>
    <div class="container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div class="flex justify-end">
            <img
                src="/images/professor.svg"
                alt="Build Your Future Here"
                class="max-h-[600px] w-full rounded-md object-cover object-top lg:max-h-[800px]"
            />
        </div>
        <div
            class="flex flex-col items-center text-center lg:max-w-3xl lg:items-start lg:text-left"
        >
            <h1 class="my-6 text-pretty text-4xl font-bold lg:text-6xl xl:text-7xl">
                Share Your Knowledge with the World
            </h1>
            <p class="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                Join our community of creators, reach thousands of eager learners, and start earning
                by sharing what you love. Build, inspire, and grow with us.
            </p>
            <div class="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row">
                <span class="inline-flex items-center -space-x-4">
                    <Avatar class="size-12 border">
                        <AvatarImage
                            src="https://www.shadcnblocks.com/images/block/avatar-1.webp"
                            alt="creator profile"
                        />
                    </Avatar>
                    <Avatar class="size-12 border">
                        <AvatarImage
                            src="https://www.shadcnblocks.com/images/block/avatar-2.webp"
                            alt="creator profile"
                        />
                    </Avatar>
                    <Avatar class="size-12 border">
                        <AvatarImage
                            src="https://www.shadcnblocks.com/images/block/avatar-3.webp"
                            alt="creator profile"
                        />
                    </Avatar>
                    <Avatar class="size-12 border">
                        <AvatarImage
                            src="https://www.shadcnblocks.com/images/block/avatar-4.webp"
                            alt="creator profile"
                        />
                    </Avatar>
                    <Avatar class="size-12 border">
                        <AvatarImage
                            src="https://www.shadcnblocks.com/images/block/avatar-5.webp"
                            alt="creator profile"
                        />
                    </Avatar>
                </span>
                <div>
                    <div class="flex items-center gap-1">
                        <Fa icon={faStar} class="size-5 fill-yellow-400 text-yellow-400" />
                        <Fa icon={faStar} class="size-5 fill-yellow-400 text-yellow-400" />
                        <Fa icon={faStar} class="size-5 fill-yellow-400 text-yellow-400" />
                        <Fa icon={faStar} class="size-5 fill-yellow-400 text-yellow-400" />
                        <Fa icon={faStar} class="size-5 fill-yellow-400 text-yellow-400" />
                        <span class="font-semibold">5.0</span>
                    </div>
                    <p class="text-left font-medium text-muted-foreground">
                        Loved by 200+ creators
                    </p>
                </div>
            </div>
            <div class="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                <Button class="w-full sm:w-auto">Become a Creator</Button>
                <Button variant="outline" class="w-full sm:w-auto">Learn More</Button>
            </div>
        </div>
    </div>
</section>
