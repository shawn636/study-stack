import { Client } from '@planetscale/database';

export const config = {
	runtime: 'edge'
};

const db = new Client({
	url: process.env['DATABASE_URL']
});

const GET = async () => {
	const conn = db.connection();

	const topCategories = await conn.execute(`
		SELECT Category.title , COUNT(*) AS count
		FROM Course JOIN Category on Course.categoryId = Category.id
		GROUP BY categoryId
		ORDER BY count DESC
		LIMIT 5;`);

	const json = JSON.stringify(topCategories.rows);

	return new Response(json, {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
			'access-control-allow-origin': '*'
		}
	});
};

export default async function handler(req: Request) {
	switch (req.method) {
		case 'GET':
			return await GET();
		default:
			return new Response(null, { status: 405 });
	}
}
