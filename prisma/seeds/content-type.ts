import type { PrismaClient } from '@prisma/client/edge';

export async function seedContentType(client: PrismaClient) {
	await client.contentType.createMany({
		data: [
			{ title: 'paragraph' },
			{ title: 'question' },
			{ title: 'image' },
			{ title: 'video' },
			{ title: 'quote' },
			{ title: 'code' }
		]
	});
}
