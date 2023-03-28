export const config = {
	runtime: 'edge'
};

export default (req: Request) => {
	return new Response(`Hello, from ${process.env['MY_SECRET']} I'm now an Edge Function!`);
};
