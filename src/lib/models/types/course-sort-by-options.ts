import type { Course } from '$lib/models/types/database.types';

export type CourseSortByOption = {
    dbField: keyof Course | '_relevance';
    dbOrderDirection: 'asc' | 'desc';
    label: string;
    param: string;
};

export const HIGHEST_RATING: CourseSortByOption = {
    dbField: 'ratingAverage',
    dbOrderDirection: 'desc',
    label: 'Highest Rating',
    param: 'highest_rating'
};

export const LOWEST_PRICE: CourseSortByOption = {
    dbField: 'currentPrice',
    dbOrderDirection: 'asc',
    label: 'Lowest Price',
    param: 'lowest_price'
};
export const RELEVANCE: CourseSortByOption = {
    dbField: '_relevance',
    dbOrderDirection: 'desc',
    label: 'Relevance',
    param: 'relevance'
};
