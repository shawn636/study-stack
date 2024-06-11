import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';

/**
 * Delays execution for the specified number of milliseconds.
 */
export const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

/**
 * Adds a random padding delay to simulate error conditions.
 */
export const errorPadding = async () => {
    const minPadding = 100;
    const maxPaddingTime = 500;
    const paddingTime = Math.floor(Math.random() * (maxPaddingTime - minPadding + 1) + minPadding);
    await sleep(paddingTime);
};

/**
 * Represents a generic handled error within the application.
 *
 * This class extends the native JavaScript Error class, incorporating
 * additional functionality to better integrate with HTTP response mechanisms.
 * The primary enhancement is the addition of a `statusCode` property,
 * which should be used to indicate the appropriate HTTP status code
 * associated with this error when it is caught and handled.
 *
 * The `HandledError` class is designed to be extended by more specific
 * error subclasses that can provide more granular error definitions and
 * associated status codes. It serves as the base class for all other custom
 * errors within the application, ensuring consistency in how errors are
 * constructed and handled.
 *
 * Example Usage:
 * ```
 * class NotFoundError extends HandledError {
 *     constructor(message: string) {
 *         super(message);
 *         this.statusCode = 404;
 *         this.name = 'NotFoundError';
 *     }
 * }
 * ```
 *
 * The `handleErrors` function within the application should be configured
 * to catch instances of `HandledError` and use the `statusCode` property
 * to send appropriate HTTP responses to the client.
 *
 * @param {string} message - The error message that explains the reason for the error.
 * @extends {Error}
 */
export class HandledError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'HandledError';
        this.statusCode = 500;
    }
}

class NotFoundError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
        this.name = 'NotFoundError';
    }
}

/**
 * Centralized error handler for API endpoints in a SvelteKit application.
 *
 * This function is specifically designed for handling errors that occur within the
 * API routes. It ensures that all errors are processed
 * consistently and securely across the server-side environment. The function checks
 * for instances of `HandledError`, allowing the application to respond with tailored
 * HTTP status codes and error messages based on the type of error encountered.
 *
 * Errors that are not instances of `HandledError` are treated as unexpected internal
 * server errors. The function then defaults to sending a response with a 500 status
 * code and a generic error message, which helps safeguard the application's internals
 * and provides a uniform error response to the client.
 *
 * It is important to note that this function should only be used is server-side endpoints
 * to ensure proper error handling in API routes.
 *
 * Example Usage:
 * ```
 * // In an endpoint (e.g., src/routes/api/myendpoint.ts)
 * export async function get(request) {
 *     try {
 *         // Code that might throw an error.
 *         throw new HandledError('Resource not found');
 *     } catch (error) {
 *         const { statusCode, message } = handleErrors(error);
 *         return {
 *             status: statusCode,
 *             body: { error: message }
 *         };
 *     }
 * }
 * ```
 */
export const handleErrors = (e: unknown) => {
    if (e instanceof SyntaxError) {
        return error(400, 'Invalid JSON');
    }

    if (e instanceof HandledError) {
        return error(e.statusCode, e.message);
    }

    return error(500, 'An unexpected error occurred.');
};

type RecordDisplaySettings = {
    'display-seed-records': boolean;
    'display-test-records': boolean;
};

export const getRecordDisplaySettings = async () => {
    const results = await db
        .selectFrom('SiteSetting')
        .select(['siteSettingKey', 'siteSettingValue'])
        .where('SiteSetting.siteSettingRecordType', '=', 'PRODUCTION_RECORD')
        .where((eb) =>
            eb.or([
                eb('siteSettingKey', '=', 'display-test-records'),
                eb('siteSettingKey', '=', 'display-seed-records')
            ])
        )
        .execute();

    const expectedKeys = ['display-test-records', 'display-seed-records'];

    if (results.length !== 2) {
        throw new NotFoundError('Unable to retrieve values for site record display settings.');
    }

    const settings: Record<string, boolean> = {};
    results.forEach((result) => {
        if (expectedKeys.includes(result.siteSettingKey)) {
            settings[result.siteSettingKey] = result.siteSettingValue === 'true';
        }
    });

    // This is safe because the siteSettingKey is unique, and the query only returns
    // a maximum of two results. So if there are exactly two results, we can safely
    // cast the settings object to the expected type, since we know it contains the
    // correct keys.
    const formattedSettings = settings as unknown as RecordDisplaySettings;

    return formattedSettings;
};
