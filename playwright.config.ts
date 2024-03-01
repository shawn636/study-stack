import type { PlaywrightTestConfig } from '@playwright/test';

import { defineConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = defineConfig({
    fullyParallel: false,
    outputDir: 'e2e/artifacts',
    projects: [
        {
            grep: /(desktop|all)/,
            name: 'Google Chrome',
            use: { ...devices['Desktop Chrome'], channel: 'chrome' }
        },
        {
            grep: /(desktop|all)/,
            name: 'Microsoft Edge',
            use: { channel: 'msedge' }
        },
        { grep: /(desktop|all)/, name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { grep: /(desktop|all)/, name: 'webkit', use: { ...devices['Desktop Safari'] } },
        {
            grep: /(mobile|all)/,
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] }
        },
        {
            grep: /(mobile|all)/,
            name: 'Mobile Safari',
            use: { ...devices['iPhone 13'] }
        }
    ],
    reporter: [['html', { open: 'true', outputFolder: 'e2e/test-results' }]],
    retries: 3,
    testDir: 'e2e',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
    use: {
        baseURL: 'http://localhost:3005'
    },
    webServer: {
        command: 'vercel dev --token $VERCEL_TOKEN --yes --listen 3005',
        port: 3005
    },
    workers: 1
});

export default config;
