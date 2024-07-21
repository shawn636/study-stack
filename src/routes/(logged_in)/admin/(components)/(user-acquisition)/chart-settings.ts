import { Scale } from '@unovis/ts';

import { type AcquisitionRecord } from './data';

export const x = (d: AcquisitionRecord) => +new Date(d.date);
export const y = [(d: AcquisitionRecord) => d.organic, (d: AcquisitionRecord) => d.paid];
export const items = [{ name: 'Organic' }, { name: 'Paid' }];
export const xScale = Scale.scaleTime();

// Set Domain for x-axis from Jan 2024 to July 2024 in unix
export const xDomain: [number, number] = [
    new Date('2024-01-01').getTime(),
    new Date('2024-06-15').getTime()
];

// Month Only for tick date
export const tickFormat = (d: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);
};
export const crossHairTemplate = (d: AcquisitionRecord) => {
    return `
                <div class="font-bold">${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(d.date))}</div>
                <div class="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <div class="rounded-full h-2 w-2 bg-[#4D8CFD]"></div>
                    <div>Organic: <span class="font-normal">${d.organic}</span></div>
                </div>
                 <div class="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <div class="rounded-full h-2 w-2 bg-[#FF6C7F]"></div>
                    <div>Paid: <span class="font-normal">${d.paid}</div>
                </div>
                <div class="text-sm font-medium text-muted-foreground">
                    
                </div>
        `;
};

export const getComputedHeight = (element: HTMLElement) => {
    if (!element) return 0;
    const computedStyle = getComputedStyle(element);
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingBottom = parseFloat(computedStyle.paddingBottom);
    const borderTop = parseFloat(computedStyle.borderTopWidth);
    const borderBottom = parseFloat(computedStyle.borderBottomWidth);
    return element.clientHeight - (paddingTop + paddingBottom + borderTop + borderBottom);
};

export const getChartHeight = (
    rootElement: HTMLDivElement,
    headerElement: HTMLDivElement,
    legendElementName: string
) => {
    const totalHeight = getComputedHeight(rootElement);
    const rootElementChildCount = 3;
    const gapHeight = parseFloat(getComputedStyle(rootElement).gap);
    const totalGapHeight = gapHeight * Math.max(rootElementChildCount - 1, 0);

    const headerHeight = getComputedHeight(headerElement);
    const legendHeight = document.querySelector(legendElementName)?.clientHeight ?? 24;
    return totalHeight - headerHeight - legendHeight - totalGapHeight;
};

export const getComputedWidth = (element: HTMLElement) => {
    if (!element) return 0;
    const computedStyle = getComputedStyle(element);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);
    const borderLeft = parseFloat(computedStyle.borderLeftWidth);
    const borderRight = parseFloat(computedStyle.borderRightWidth);
    return element.clientWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
};

export const getChartWidth = (rootElement: HTMLDivElement) => {
    return getComputedWidth(rootElement);
};
