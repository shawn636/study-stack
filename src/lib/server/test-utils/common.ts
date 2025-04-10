/* This Module contains common utilities that are used in the tests */
import { ApiClient } from '$lib/api';

export const UNIT_TEST_EMAIL_DOMAIN = 'unit-tests.study-stack.com';
export const E2E_TEST_EMAIL_DOMAIN = 'e2e-tests.study-stack.com';
export const UNIT_TEST_URL_BASE = 'http://localhost:3004';
export const E2E_TEST_URL_BASE = 'http://localhost:3005';

export const unitTestApiClient = new ApiClient('absolute', UNIT_TEST_URL_BASE);
export const e2eTestApiClient = new ApiClient('absolute', E2E_TEST_URL_BASE);
