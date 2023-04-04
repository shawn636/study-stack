import type { PrismaClient } from '@prisma/client';

export async function seedCategory(client: PrismaClient) {
	await client.category.createMany({
		data: [
			{ title: 'Bible Study & Theology' },
			{ title: 'Biblical Languages' },
			{ title: 'Apologetics' },
			{ title: 'Leadership & Ministry' },
			{ title: 'Worldview & Philosophy' },
			{ title: 'Christian Counseling & Psychology' },
			{ title: 'Evangelism' },
			{ title: 'Worrship & Music' },
			{ title: 'Ministry & Service' }
		]
	});
}
