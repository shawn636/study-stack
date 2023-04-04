import { PrismaClient } from '@prisma/client';
import { seedCategory } from './seeds/category';
import { seedContentType } from './seeds/content-type';
import { seedOrganization } from './seeds/organization';
import { seedUser } from './seeds/user';

const prisma = new PrismaClient();

async function main() {
	await Promise.all([seedCategory(prisma), seedContentType(prisma), seedOrganization(prisma)]);
	await seedUser(prisma);
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
