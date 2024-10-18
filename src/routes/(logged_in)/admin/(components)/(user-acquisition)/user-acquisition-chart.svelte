<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import {
        VisAxis,
        VisBulletLegend,
        VisCrosshair,
        VisLine,
        VisTooltip,
        VisXYContainer
    } from '@unovis/svelte';

    import { cn } from '$lib/utils.js';
    import { onMount } from 'svelte';

    import {
        crossHairTemplate,
        getChartHeight,
        getChartWidth,
        items,
        tickFormat,
        x,
        xDomain,
        xScale,
        y
    } from './chart-settings';
    import { data } from './data';

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
        <span class="text-lg font-semibold leading-none tracking-tight">User Acquisition</span>
        <span class="text-sm text-muted-foreground">New user signups and retention over time.</span>
    </div>

    {#if !isLoading && availableChartHeight > minChartHeight && availableChartWidth > minChartWidth}
        <VisBulletLegend {items} />
        <VisXYContainer {data} height={availableChartHeight} {xDomain} {xScale}>
            <VisLine {x} {y} />
            <VisTooltip />
            <VisAxis gridLine={false} numTicks={6} {tickFormat} type="x" {x} />
            <VisAxis gridLine={false} type="y" />
            <VisCrosshair template={crossHairTemplate} {x} {y} />
        </VisXYContainer>
    {/if}
</div>
