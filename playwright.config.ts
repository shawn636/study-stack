import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = defineConfig({
    testDir: 'e2e',
    outputDir: 'e2e/artifacts',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
    fullyParallel: false,
    workers: 1,
    use: {
        baseURL: 'http://localhost:3000'
    },
    projects: [
        {
            name: 'Google Chrome',
            use: { ...devices['Desktop Chrome'], channel: 'chrome' },
            grep: /(desktop|all)/
        },
        {
            name: 'Microsoft Edge',
            use: { channel: 'msedge' },
            grep: /(desktop|all)/
        },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] }, grep: /(desktop|all)/ },
        { name: 'webkit', use: { ...devices['Desktop Safari'] }, grep: /(desktop|all)/ },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
            grep: /(mobile|all)/
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 13'] },
            grep: /(mobile|all)/
        }
    ],
    webServer: {
        command: 'npm run vercel-dev',
        port: 3000
    },
    reporter: [['html', { open: 'true', outputFolder: 'e2e/test-results' }]]
});

export default config;
