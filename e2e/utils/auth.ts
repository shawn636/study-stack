import { Client } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { KeyType, PrismaClient } from '@prisma/client';

import { hashPassword } from './crypto';
import { DATABASE_URL } from './env';

const client = new Client({
    url: DATABASE_URL
});
const adapter = new PrismaPlanetScale(client);
export const prisma = new PrismaClient({ adapter });

const createUser = async (email: string, password: string, name: string): Promise<string> => {
    const keyValue = await hashPassword(password);

    const createUserResult = await prisma.authUser.create({
        data: {
            authKeys: { create: { keyType: KeyType.CREDENTIAL_HASH, keyValue: keyValue } },
            email: email,
            user: { create: { email: email, name: name } }
        },
        include: { user: true }
    });

    let userId: number = -1;

    if (createUserResult.user?.id !== undefined && createUserResult.id !== undefined) {
        userId = createUserResult.user.id;
    }

    return userId.toString();
};

const deleteUserIfExists = async (email: string): Promise<void> => {
    const queryUserResult = await prisma.authUser.findFirst({
        include: { user: true },
        where: { email: email }
    });

    if (queryUserResult?.user?.id !== undefined && queryUserResult.id !== undefined) {
        await prisma.authUser.delete({ where: { id: queryUserResult.id } });
    }

    return;
};

export const auth = {
    createUser,
    deleteUserIfExists
};
