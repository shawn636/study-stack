import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = defineConfig({
    testDir: 'e2e',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
    // fullyParallel: true,
    use: {
        baseURL: 'http://localhost:3000'
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } }
        // { name: 'Safari(Mobile)', use: { ...devices['iPhone 13'] } }
    ],
    webServer: {
        command: 'npm run vercel-dev',
        port: 3000
    }
});

export default config;
