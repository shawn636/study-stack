// import type { CourseWithInstructor } from '$lib/models/types/api';
import type { CourseResult } from '$lib/api/types/courses';

import { writable } from 'svelte/store';

export const courseResults = writable<CourseResult[]>([]);
export const isLoading = writable<boolean>(false);
