<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import {
        getChartHeight,
        getChartWidth,
        items,
        tickFormat,
        x,
        xScale,
        y
    } from './chart-settings';
    import { VisAxis, VisBulletLegend, VisGroupedBar, VisXYContainer } from '@unovis/svelte';

    import { cn } from '$lib/utils.js';
    import { data } from './data';
    import { onMount } from 'svelte';

    type $$Props = HTMLAttributes<HTMLDivElement>;

    let className: $$Props['class'] = undefined;
    export { className as class };

    let rootElement: HTMLDivElement;
    let headerElement: HTMLDivElement;

    let availableChartHeight = 0;
    let availableChartWidth = 0;
    const legendElementName = 'vis-bullet-legend';
    const minChartHeight = 0;
    const minChartWidth = 0;
    let isLoading = true;

    onMount(() => {
        availableChartHeight = getChartHeight(rootElement, headerElement, legendElementName);
        availableChartWidth = getChartWidth(rootElement);
        isLoading = false;
        window.addEventListener('load', () => {
            isLoading = true;
            availableChartHeight = getChartHeight(rootElement, headerElement, legendElementName);
            availableChartWidth = getChartWidth(rootElement);
            isLoading = false;
        });
        window.addEventListener('resize', () => {
            isLoading = true;
            availableChartHeight = getChartHeight(rootElement, headerElement, legendElementName);
            availableChartWidth = getChartWidth(rootElement);
            isLoading = false;
        });
    });
</script>

<div
    bind:this={rootElement}
    class={cn(
        className,
        'flex flex-col gap-2 overflow-hidden rounded-lg border bg-card p-6 text-card-foreground shadow-sm'
    )}
>
    <div bind:this={headerElement} class="flex flex-col">
        <span class="text-lg font-semibold leading-none tracking-tight">Content Performance</span>
        <span class="text-sm text-muted-foreground">Engagement metrics for your top content.</span>
    </div>

    {#if !isLoading && availableChartHeight > minChartHeight && availableChartWidth > minChartWidth}
        <VisBulletLegend {items} />
        <VisXYContainer {data} height={availableChartHeight} {xScale} yDomain={[0, 325]}>
            <VisGroupedBar {x} {y} />
            <VisAxis
                gridLine={false}
                numTicks={6}
                orientation="bottom"
                scale={xScale}
                {tickFormat}
                type="x"
            />
            <VisAxis gridLine={false} orientation="left" type="y" />
        </VisXYContainer>
    {/if}
</div>
