import { PrismaClient } from '@prisma/client';
import { seedCategory } from './seeds/category';

const prisma = new PrismaClient();

async function main() {
	await seedCategory(prisma);
	// await prisma.$connect()
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
