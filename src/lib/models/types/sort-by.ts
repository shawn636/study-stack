import type { Course } from '$lib/models/types/database.types';

export type SortByValue = {
    dbField: '_relevance' | keyof Course;
    dbOrderDirection: 'asc' | 'desc';
    label: string;
    param: string;
};

export class SortBy {
    static HIGHEST_RATING: SortByValue = {
        dbField: 'ratingAverage',
        dbOrderDirection: 'desc',
        label: 'Highest Rating',
        param: 'highest_rating'
    };
    static LOWEST_PRICE: SortByValue = {
        dbField: 'currentPrice',
        dbOrderDirection: 'asc',
        label: 'Lowest Price',
        param: 'lowest_price'
    };
    static RELEVANCE: SortByValue = {
        dbField: '_relevance',
        dbOrderDirection: 'desc',
        label: 'Relevance',
        param: 'relevance'
    };
}
