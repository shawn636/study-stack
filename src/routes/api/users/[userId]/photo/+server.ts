import type { RequestHandler } from './$types';
import type { UserPhotoCreateResponse } from '$lib/api/types/users';

import {
    DatabaseError,
    ForbiddenError,
    InvalidRequestError,
    UnauthorizedError
} from '$lib/server/error-handling/handled-errors';

import { auth } from '$lib/server/auth';
import { cdn } from '$lib/server/cdn';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';

export const POST = (async ({ cookies, params, request }) => {
    await auth.validateApiSession(cookies, params.userId);
    const sessionId = auth.getSession(cookies);

    const userIdSlug = params.userId;

    if (!sessionId) {
        throw new UnauthorizedError('You are not logged in.');
    }

    try {
        const [userId, formData] = await Promise.all([
            auth.getUserId(sessionId),
            request.formData()
        ]);

        const userIdFromRequest = formData.get('userId');
        const profilePhoto = formData.get('profilePhoto') as File;

        if (!(userIdSlug === userIdFromRequest && userIdFromRequest === userId)) {
            throw new ForbiddenError('You are not authorized to update this user.');
        }

        let currentProfileImageId: string | null = null;
        try {
            const result = await db
                .selectFrom('User')
                .select('userPhotoImageId')
                .where('userId', '=', userId)
                .executeTakeFirstOrThrow();
            currentProfileImageId = result.userPhotoImageId;
        } catch (e) {
            throw new DatabaseError(`Unable to retrieve current photo image id for user: ${e}`);
        }

        // Rename the file to include the user id and the current timestamp
        if (!profilePhoto || !profilePhoto.name) {
            throw new InvalidRequestError('No profile photo provided.');
        }
        const extension = profilePhoto.name.split('.').pop();
        const newFilename = `profile-photo-${userId}-${Date.now()}.${extension}`;
        const renamedFile = new File([profilePhoto], newFilename, { type: profilePhoto.type });

        const [uploadResponse, deleteResponse] = await Promise.all([
            cdn.uploadImage(renamedFile),
            cdn.deleteImage(currentProfileImageId ?? '')
        ]);

        if (!uploadResponse.success) {
            throw new Error('Unable to upload photo to the CDN.');
        }

        if (currentProfileImageId && !deleteResponse.success) {
            throw new Error('Unable to delete the previous photo from the CDN.');
        }

        const newPhotoUrl = uploadResponse.result.variants?.find((variant) =>
            variant.endsWith('/ProfileThumb')
        );
        const cloudflareImageId = uploadResponse.result.id;

        if (!newPhotoUrl) {
            throw new Error('Unable to parse the photo url after photo upload.');
        }

        try {
            const result = await db
                .updateTable('User')
                .set({
                    userPhotoImageId: cloudflareImageId ?? 'NULL',
                    userPhotoUrl: newPhotoUrl
                })
                .where('userId', '=', userIdFromRequest)
                .executeTakeFirstOrThrow();

            if (Number(result.numUpdatedRows) !== Number(1)) {
                console.error('ERROR: Unable to update user photo url in db.');
                console.error(result);
            }
        } catch (e) {
            const result = await cdn.deleteImage(cloudflareImageId ?? '');
            if (!result.success) {
                console.error(
                    'ERROR: Unable to cleanup the uploaded image from the CDN after failure to update user in db.'
                );
            } else {
                console.log(
                    'Successfully cleaned up the uploaded image from the CDN after failure to update user in db.'
                );
            }

            throw new DatabaseError(`Unable to update photo url for user: ${e}`);
        }

        const responsePayload: UserPhotoCreateResponse = {
            count: 1,
            data: {
                imageId: cloudflareImageId ?? '',
                imageUrl: newPhotoUrl
            },
            object: 'UserPhoto',
            success: true
        };

        return new Response(JSON.stringify(responsePayload), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        });
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
