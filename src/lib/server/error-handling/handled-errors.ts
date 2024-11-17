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

export class NotFoundError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 404;
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 403;
        this.name = 'ForbiddenError';
    }
}

export class InvalidRequestError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = 'InvalidRequestError';
    }
}

export class InvalidParameterError extends HandledError {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'InvalidParameterError';
        this.statusCode = 400;
    }
}

export class InvalidSlugError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = 'InvalidSlugError';
    }
}

export class DatabaseError extends HandledError {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
    }
}

export class ExternalServiceGenericError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 500;
        this.name = 'ExternalServiceGenericError';
    }
}

export class ExternalServiceUnavailableError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 503;
        this.name = 'ExternalServiceUnavailableError';
    }
}

export class ExternalServiceTimeoutError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 504;
        this.name = 'ExternalServiceTimeoutError';
    }
}
