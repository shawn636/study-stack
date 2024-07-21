<script lang="ts">
    import type { IconDefinition } from '$lib/models/types/icon-definition';

    import * as Card from '$lib/components/ui/card';
    import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    export let value: string;
    export let title: string;
    export let icon: IconDefinition;
    export let percentChange: number = 0;
    import { cn } from '$lib/utils.js';

    $: arrowIcon = percentChange > 0 ? faArrowUp : percentChange < 0 ? faArrowDown : null;

    const arrowTextColor = percentChange > 0 ? 'text-emerald-500' : 'text-yellow-500';
    const arrowBgColor =
        percentChange > 0
            ? 'bg-emerald-100 dark:bg-emerald-800'
            : 'bg-yellow-100 dark:bg-yellow-800';
    // $: arrowContainerClass = `rounded-full ${percentChange > 0 ? 'bg-emerald-100' : 'bg-rose-100'} p-3 ${text-emerald-500}`;
</script>

<Card.Root>
    <Card.Content class="flex h-full min-w-32 flex-row items-center justify-center gap-3 p-6">
        <div class="aspect-square w-min rounded bg-muted p-2">
            <Fa class="text-primary/90" {icon} size="lg" />
        </div>
        <div class="flex flex-col items-start">
            <span class="text-2xl font-bold">{value}</span>
            <span class="text-sm font-light text-muted-foreground">{title}</span>
        </div>
        {#if arrowIcon}
            <div class={cn('rounded-full p-3', arrowTextColor, arrowBgColor)}>
                <Fa icon={arrowIcon} size="sm" />
            </div>
            <span class={cn('text-sm', arrowTextColor)}>
                {#if percentChange > 0}+{/if}{percentChange}%
            </span>
        {/if}
    </Card.Content>
</Card.Root>
