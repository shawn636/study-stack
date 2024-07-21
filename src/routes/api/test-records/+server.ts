import type { TestRecordsDeleteResponse } from '$lib/api/types/test-records';

import { handleErrors } from '$lib/server/error-handling';
import { DatabaseError } from '$lib/server/error-handling/handled-errors';
import { cleanup } from '$lib/server/test-utils/cleanup';

import type { RequestHandler } from './$types';

export const DELETE = (async () => {
    try {
        let results: { [key: string]: number };
        try {
            results = await cleanup();
        } catch (e: unknown) {
            throw new DatabaseError('Error cleaning up test records');
        }

        const responsePayload: TestRecordsDeleteResponse = {
            count: 1,
            data: results,
            object: 'TestRecords',
            success: true
        };

        return new Response(JSON.stringify(responsePayload), {
            headers: {
                'cache-control': 'no-store',
                'content-type': 'application/json;charset=utf-8'
            },
            status: 200
        });
    } catch (e: unknown) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
