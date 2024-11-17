<script lang="ts">
    import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';

    import { cn } from '$lib/utils';

    interface Props {
        class?: string;
    }
    const { class: className }: Props = $props();
</script>

<section class={cn(className)}>
    <div class="container">
        <div class="flex flex-col items-center text-center">
            <p class="mb-16 max-w-4xl px-8 font-medium lg:text-3xl">
                &ldquo;Creating my course was an incredibly rewarding experience! The platform's
                interactive tools kept my students engaged, and the drag-and-drop components made
                building each lesson fun and intuitive. Plus, earning an income while doing what I
                love has been a true blessing!&rdquo;
            </p>
            <div class="flex items-center gap-2 md:gap-4">
                <Avatar class="size-12 md:size-16">
                    <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-1.webp" />
                    <AvatarFallback>Jordan W.</AvatarFallback>
                </Avatar>
                <div class="text-left">
                    <p class="text-sm font-medium md:text-base">Jordan W.</p>
                    <p class="text-sm text-muted-foreground md:text-base">Online Course Creator</p>
                </div>
            </div>
        </div>
    </div>
</section>
