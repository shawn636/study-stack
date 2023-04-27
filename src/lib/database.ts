import { Client } from '@planetscale/database';
import { DATABASE_URL } from '$env/static/private';

export const db = new Client({
	url: DATABASE_URL
});
