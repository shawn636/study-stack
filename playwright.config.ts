import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run dev',
		port: 5173
	},
	testDir: 'tests'
};

export default config;
