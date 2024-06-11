import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import { auth } from './utils/auth';

const testEmailDomain = 'e2e-tests.equipped.co';

type Account = {
    email: string;
    name: string;
    pass: string;
};

const generateAccount = (): Account => {
    const emailBase = auth.cuid();
    return {
        email: `${emailBase}@${testEmailDomain}`,
        name: faker.person.fullName(),
        pass: faker.internet.password({
            length: 8,
            memorable: false,
            pattern: /[a-z]/,
            prefix: 'Aa1!'
        })
    };
};

test.describe('all-user-flow', async () => {
    test.afterAll(async () => {
        await auth.deleteE2eTestUsers();
    });
    test('should be able to make account', async ({ page }) => {
        const { email, name, pass } = generateAccount();

        await page.goto('/auth/register');
        await page.waitForLoadState('networkidle');
        expect(page).toHaveURL('/auth/register');

        await page.getByTestId('name-input').fill(name);
        await page.getByTestId('email-input').fill(email);
        await page.getByTestId('password1-input').fill(pass);
        await page.getByTestId('password2-input').fill(pass);
        await page.getByTestId('submit-button').click();

        await page.waitForURL('/');
        await page.waitForLoadState('networkidle');
        expect(page).toHaveURL('/');

        await page.getByTestId('profile-button').click();
        await expect(page.getByTestId('profile-popup-name')).toBeVisible();
        await expect(page.getByTestId('profile-popup-email')).toBeVisible();
    });

    test('should show name validation errors', async ({ page }) => {
        const { email, name, pass } = generateAccount();
        await auth.createUser(email, pass, name);

        await page.goto('/auth/register');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/auth/register');

        const nameInput = page.locator('[data-testid="name-input"]');
        const nameError = page.locator('[data-testid="name-error"]');

        await nameInput.click();
        await nameInput.evaluate((input) => input.blur());

        await expect(nameError).toBeVisible();

        await nameInput.fill(name);
        await nameInput.evaluate((input) => input.blur());
        await expect(nameError).not.toBeVisible();
    });

    test('should show email validation errors', async ({ page }) => {
        const { email, name, pass } = generateAccount();
        await auth.createUser(email, pass, name);

        await page.goto('/auth/register');
        await page.waitForLoadState('networkidle');
        expect(page).toHaveURL('/auth/register');

        await page.getByTestId('email-input').click();
        await page.keyboard.press('Tab');

        await expect(page.getByTestId('email-error')).toBeVisible();

        await page.getByTestId('email-input').fill(email);
        await page.keyboard.press('Tab');
        await expect(page.getByTestId('email-error')).not.toBeVisible();
    });

    test('should show password1 validation errors', async ({ page }) => {
        const { email, name, pass } = generateAccount();
        await auth.createUser(email, pass, name);

        await page.goto('/auth/register');
        await page.waitForLoadState('networkidle');
        expect(page).toHaveURL('/auth/register');

        await page.getByTestId('password1-input').click();
        await page.keyboard.press('Tab');

        await expect(page.getByTestId('password1-error')).toBeVisible();

        await page.getByTestId('password1-input').fill(pass);
        await page.keyboard.press('Tab');
        await expect(page.getByTestId('password1-error')).not.toBeVisible();
    });

    test('should show password2 validation errors', async ({ page }) => {
        const { email, name, pass } = generateAccount();
        await auth.createUser(email, pass, name);

        await page.goto('/auth/register');
        await page.waitForLoadState('networkidle');
        expect(page).toHaveURL('/auth/register');

        await page.getByTestId('password2-input').click();
        await page.keyboard.press('Tab');

        await expect(page.getByTestId('password2-error')).toBeVisible();

        await page.getByTestId('password1-input').fill(pass);
        await page.getByTestId('password2-input').fill(pass);
        await page.keyboard.press('Tab');
        await expect(page.getByTestId('password2-error')).not.toBeVisible();
    });
});
