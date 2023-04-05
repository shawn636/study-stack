import { faker } from '@faker-js/faker';

export const config = {
	runtime: 'edge'
};

export default (req: Request) => {
	return new Response(`Hello, from ${faker.name.firstName()} I'm now an Edge Function!`);
};
