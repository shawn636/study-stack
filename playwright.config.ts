import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'PUBLIC_ENV=PROD vercel dev --listen 3000 --token $VERCEL_TOKEN --yes',
		port: 3000
	},
	testDir: 'e2e'
};

export default config;
