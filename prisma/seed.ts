import { PrismaClient } from '@prisma/client';
import type { User, Post } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
async function main() {
	await prisma.post.deleteMany({});
	await prisma.user.deleteMany({});

	const usersToGenerate = 200;
	const users: User[] = [];
	const posts: Post[] = [];

	for (let i = 0; i < usersToGenerate; i++) {
		const user: User = {
			id: i + 1,
			name: faker.name.fullName(),
			email: faker.internet.email()
		};

		users.push(user);

		const numPosts = Math.floor(Math.random() * 51);
		for (let j = 0; j < numPosts; j++) {
			const post: Post = {
				id: i * 50 + j + 1,
				title: faker.lorem.sentence(),
				content: faker.lorem.paragraph(),
				published: faker.datatype.boolean(),
				userId: user.id
			};
			posts.push(post);
		}
	}

	await prisma.user.createMany({ data: users });
	await prisma.post.createMany({ data: posts });
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
