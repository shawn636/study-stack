/**
 * GET /categories/top
 * Retrieve the top 6 categories by course count.
 */

import type CategorySummary from '$lib/models/types/category-summary';

import type { ApiResponse } from './common';

export type TopCategoriesGetResponse = ApiResponse<CategorySummary[]>;
