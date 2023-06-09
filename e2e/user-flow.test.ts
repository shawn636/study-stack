import { expect, test } from '@playwright/test';

import { faker } from '@faker-js/faker';
import { auth } from './utils/auth';
import { initials } from './utils/user';

const ACCOUNTS = [
    {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        pass: faker.internet.password(8, false, /[a-z]/, 'Aa1!')
    }
];

test.describe('user flow', async () => {
    test.beforeAll(async () => {
        for (const account of ACCOUNTS) {
            await auth.deleteUserIfExists(account.email);
        }
    });
    test.afterAll(async () => {
        for (const account of ACCOUNTS) {
            await auth.deleteUserIfExists(account.email);
        }
    });

    test('should be able to make account', async ({ page }) => {
        const { name, email, pass } = ACCOUNTS[0];
        await page.goto('/');
        await page.getByRole('link', { name: 'Get Started' }).click();
        await page.waitForLoadState('networkidle');
        expect(page).toHaveURL('/auth/register');

        await page.getByPlaceholder('Name').fill(name);
        await page.getByPlaceholder('Email').fill(email);
        await page.getByRole('button', { name: 'continue' }).click();
        await page.locator('input[name="password1"]').fill(pass);
        await page.locator('input[name="password2"]').click();
        await page.locator('input[name="password2"]').fill(pass);
        await page.getByRole('button', { name: 'Submit' }).click();

        await page.waitForURL('/');
        await page.waitForLoadState('domcontentloaded');
        expect(page).toHaveURL('/');

        const user_initials = initials(name);

        await page.getByRole('button').filter({ hasText: user_initials }).click();
        expect(page.getByText(name)).toBeTruthy();
        expect(page.getByText(email)).toBeTruthy();
        await page.getByRole('button', { name: 'Sign Out' }).click();
    });
});
