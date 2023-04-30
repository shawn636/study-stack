import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'api/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'jsdom',
		mockReset: true
	}
};

export default config;
