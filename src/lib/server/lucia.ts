import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { dev } from '$app/environment';
import { planetscale } from '@lucia-auth/adapter-mysql';
import { connect } from '@planetscale/database';
import { DATABASE_URL } from '$env/static/private';

const connection = connect({
    url: DATABASE_URL
});

export const auth = lucia({
    adapter: planetscale(connection),
    env: dev ? 'DEV' : 'PROD',
    middleware: sveltekit(),
    transformDatabaseUser: (userData) => {
        return {
            userId: userData.id,
            email: userData.email
        };
    }
});

export type Auth = typeof auth;
