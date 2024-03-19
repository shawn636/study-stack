import { DATABASE_URL } from '$env/static/private';
import { Client } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { PrismaClient } from '@prisma/client';

const config = {
    url: DATABASE_URL
};

const client = new Client(config);
const adapter = new PrismaPlanetScale(client);

export const db = client;
export const prisma = new PrismaClient({ adapter });
