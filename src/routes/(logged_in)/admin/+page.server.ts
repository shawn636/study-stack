import type { PageServerLoad } from './$types';

import { error, redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/auth';
import { PlatformRole } from '$lib/models/types/database.types';

export const load = (async ({ parent, cookies }) => {
    const result = await auth.validateSessionWithPermissions(cookies, PlatformRole.ADMIN);
    if (!result.valid && result.error === 'invalid_session') {
        redirect(302, '/auth/login?redirect=/admin');
    }

    if (!result.valid) {
        return error(403, 'Forbidden');
    }

    return await parent();
}) satisfies PageServerLoad;
