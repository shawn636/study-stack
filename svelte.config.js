import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            runtime: 'edge',
            split: true
        }),
        csrf: false // CSRF protection is disabled since we use custom csrf implementation
    },

    preprocess: [vitePreprocess()]
};

export default config;
