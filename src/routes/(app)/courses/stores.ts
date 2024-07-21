// import type { CourseWithInstructor } from '$lib/models/types/api';
import type { CourseResult } from '$lib/api/types/courses';

import { writable } from 'svelte/store';

// export const courseResults = writable<CourseResult[]>([]);
function createCourseResults() {
    const { set, subscribe, update } = writable<CourseResult[]>([]);

    return {
        addFavorite: (courseId: string) => {
            update((courseResults) => {
                return courseResults.map((result: CourseResult) => {
                    const modifiedResult = result;

                    const matchingCourse = result.course.courseId === courseId;
                    const resultContainsFavorite =
                        result.course.isFavorite !== undefined && result.course.isFavorite !== null;

                    if (matchingCourse && resultContainsFavorite) {
                        modifiedResult.course.isFavorite = true;
                    }
                    return modifiedResult;
                });
            });
        },
        removeFavorite: (courseId: string) => {
            update((courseResults) => {
                return courseResults.map((result: CourseResult) => {
                    const modifiedResult = result;

                    const matchingCourse = result.course.courseId === courseId;
                    const resultContainsFavorite =
                        result.course.isFavorite !== undefined && result.course.isFavorite !== null;

                    if (matchingCourse && resultContainsFavorite) {
                        modifiedResult.course.isFavorite = false;
                    }
                    return modifiedResult;
                });
            });
        },
        set,
        subscribe,
        update
    };
}

export const courseResults = createCourseResults();
export const isLoading = writable<boolean>(false);
