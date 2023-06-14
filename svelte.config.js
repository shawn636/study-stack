import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess()],

    kit: {
        csrf: false,
        adapter: adapter({
            runtime: 'edge',
            split: true
        })
    }
};

export default config;
