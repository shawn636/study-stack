import type { PlaywrightTestConfig } from '@playwright/test';

import { defineConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = defineConfig({
    fullyParallel: false,
    outputDir: 'e2e/artifacts',
    projects: [
        {
            grep: /(desktop|all)/,
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        { grep: /(desktop|all)/, name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { grep: /(desktop|all)/, name: 'webkit', use: { ...devices['Desktop Safari'] } },
        {
            grep: /(mobile|all)/,
            name: 'mobile chromium',
            use: { ...devices['Pixel 5'] }
        },
        {
            grep: /(mobile|all)/,
            name: 'Mobile Safari',
            use: { ...devices['iPhone 13'] }
        }
    ],
    reporter: [['html', { open: 'true', outputFolder: 'e2e/test-results' }]],
    retries: 0,
    testDir: 'e2e',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
    webServer: {
        command: 'scripts/shared/run.sh pnpm exec vite dev --port 3005 --host 0.0.0.0 --mode test',
        port: 3005
    },
    use: {
        headless: true
    }
});

export default config;
