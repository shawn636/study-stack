import type { Course } from '$lib/models/types/database.types';

export type CourseSortByOption = {
    dbField: '_relevance' | keyof Course;
    dbOrderDirection: 'asc' | 'desc';
    label: string;
    param: string;
};

export class CourseSortByOptions {
    static HIGHEST_RATING: CourseSortByOption = {
        dbField: 'courseRatingAverage',
        dbOrderDirection: 'desc',
        label: 'Highest Rating',
        param: 'highest_rating'
    };
    static LOWEST_PRICE: CourseSortByOption = {
        dbField: 'courseCurrentPrice',
        dbOrderDirection: 'asc',
        label: 'Lowest Price',
        param: 'lowest_price'
    };
    static RELEVANCE: CourseSortByOption = {
        dbField: '_relevance',
        dbOrderDirection: 'desc',
        label: 'Relevance',
        param: 'relevance'
    };
}
