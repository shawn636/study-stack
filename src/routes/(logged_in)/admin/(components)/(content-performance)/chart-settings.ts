import { Scale } from '@unovis/ts';

import type { ContentPerformanceRecord } from './data';

export const x = (d: ContentPerformanceRecord) => +new Date(d.date);
export const y = [
    (d: ContentPerformanceRecord) => d.comments,
    (d: ContentPerformanceRecord) => d.likes,
    (d: ContentPerformanceRecord) => d.views
];

export const items = [{ name: 'Comments' }, { name: 'Likes' }, { name: 'Views' }];

export const tickFormat = (d: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);
};

export const xScale = Scale.scaleTime();

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
