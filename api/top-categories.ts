export const config = {
	runtime: 'edge'
};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: Request, res: Response) => {
	try {
		const orderedCategories = await prisma.category.findMany({
			select: {
				title: true,
				_count: {
					select: { courses: true }
				}
			},
			orderBy: {
				courses: {
					_count: 'desc'
				}
			}
		});
		prisma.$disconnect();
		return new Response(orderedCategories.toString());
	} catch (error) {
		console.log(error);
		prisma.$disconnect();
		return new Response('Internal Server Error', { status: 500 });
	}
};
