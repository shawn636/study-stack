import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = defineConfig({
    testDir: 'e2e',
    outputDir: 'e2e/artifacts',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
    fullyParallel: true,
    use: {
        baseURL: 'http://localhost:3000'
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] }, grep: /(desktop|all)/ },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] }, grep: /(desktop|all)/ },
        { name: 'webkit', use: { ...devices['Desktop Safari'] }, grep: /(desktop|all)/ },
        { name: 'Safari(Mobile)', use: { ...devices['iPhone 13'] }, grep: /(mobile|all)/ }
    ],
    webServer: {
        command: 'npm run vercel-dev',
        port: 3000
    },
    reporter: [['html', { open: 'true', outputFolder: 'e2e/test-results' }]]
});

export default config;
