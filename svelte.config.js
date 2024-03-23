import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            // runtime: 'edge', // temporarily disabled until prisma fixes middleware support for edge and sveltekit
            split: false // Can only be enabled on edge runtime since we hit cap of 12 functions
        }),
        csrf: false // CSRF protection is disabled since we use custom csrf implementation
    },

    preprocess: [vitePreprocess()]
};

export default config;
