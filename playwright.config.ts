import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run vercel-dev',
		port: 3000
	},
	testDir: 'e2e'
};

export default config;
