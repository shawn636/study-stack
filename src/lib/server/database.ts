import { Client } from '@planetscale/database';
import { DATABASE_URL } from '$env/static/private';

/**
 * Creates a new instance of the Planetscale Database client using the provided database URL.
 *
 * @param {string} url - The URL of the Planetscale database.
 * @returns {Client} A new instance of the Planetscale Database client.
 */
export const db = new Client({
    url: DATABASE_URL
});
