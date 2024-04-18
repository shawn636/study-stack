import type { CourseSearchResult } from '$lib/models/types/api';
import type { CourseSortByOption } from '$lib/models/types/course-sort-by-options';
export const getCourses = async (
    searchTerm: string,
    sortByOption: CourseSortByOption,
    page: number,
    pageSize: number
): Promise<CourseSearchResult> => {
    // let coursesWithInstructors: (Course & User)[] = [];
    let requestUrl = '/api/search/courses';
    if (searchTerm) {
        requestUrl += `/${searchTerm}`;
    }
    requestUrl += `?sort_by=${sortByOption.param}&page=${page}&page_size=${pageSize}`;

    const response = await fetch(requestUrl, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });
    const result: CourseSearchResult = await response.json();
    return result;
};
