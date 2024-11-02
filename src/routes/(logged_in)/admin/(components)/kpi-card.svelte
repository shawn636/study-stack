<script lang="ts">
    import type { IconDefinition } from '$lib/models/types/icon-definition';

    import * as Card from '$lib/components/ui/card';
    import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    import { cn } from '$lib/utils.js';
    interface Props {
        value: string;
        title: string;
        icon: IconDefinition;
        percentChange?: number;
    }

    let {
        value,
        title,
        icon,
        percentChange = 0
    }: Props = $props();


    const arrowTextColor = percentChange > 0 ? 'text-emerald-500' : 'text-yellow-500';
    const arrowBgColor =
        percentChange > 0
            ? 'bg-emerald-100 dark:bg-emerald-800'
            : 'bg-yellow-100 dark:bg-yellow-800';

    const getArrowIcon = (percentChange: number) => {
        if (percentChange > 0) {
            return faArrowUp;
        } else if (percentChange < 0) {
            return faArrowDown;
        }
        return null;
    };

    // $: arrowContainerClass = `rounded-full ${percentChange > 0 ? 'bg-emerald-100' : 'bg-rose-100'} p-3 ${text-emerald-500}`;
    let arrowIcon = $derived(getArrowIcon(percentChange));
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
