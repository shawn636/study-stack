import { expect, test } from '@playwright/test';

import { faker } from '@faker-js/faker';
import { auth } from './utils/auth';

const ACCOUNTS = [
    {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        pass: faker.internet.password(8, false, /[a-z]/, 'Aa1!')
    },
    {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        pass: faker.internet.password(8, false, /[a-z]/, 'Aa1!')
    }
];

test.describe('all-user-flow', async () => {
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

        await page.goto('/auth/register');
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

        await page.getByTestId('profile-button').click();
        await expect(page.getByText(name)).toBeVisible();
        await expect(page.getByText(email)).toBeVisible();
        await page.getByRole('button', { name: 'Sign Out' }).click();
    });

    test('should show validation errors', async ({ page }) => {
        const { name, email, pass } = ACCOUNTS[1];
        await auth.createUser(email, pass, name);

        await page.goto('/auth/register');
        await page.waitForLoadState('networkidle');
        expect(page).toHaveURL('/auth/register');
        await expect(page.locator('[data-test-id="sign-up-form"]')).toBeVisible();

        await expect(page.getByRole('heading', { name: 'Welcome to Equipped' })).toBeVisible();
        await page.getByPlaceholder('Name').click();
        await page.locator('#main').click();

        await expect(page.getByText('Please enter your name')).toBeVisible();
        await expect(page.getByText('Oops! The email you entered is invalid')).toBeVisible();

        await page.getByPlaceholder('Name').fill(name);
        await page.locator('#main').click();
        await expect(page.getByTestId('Please enter your name')).not.toBeVisible();

        await page.getByPlaceholder('Email').fill(name);
        await page.locator('#main').click();
        await expect(page.getByText('Oops! The email you entered is invalid')).toBeVisible();

        await page.getByPlaceholder('Email').fill('test@com');
        await page.getByRole('button', { name: 'continue' }).click();
        await expect(page.getByRole('heading', { name: 'Welcome to Equipped' })).toBeVisible();
        await expect(page.getByText('Oops! The email you entered is invalid')).toBeVisible();

        await page.getByPlaceholder('Email').fill(email);
        await expect(page.getByText('Oops! The email you entered is invalid')).toBeVisible();
        await page.getByRole('button', { name: 'continue' }).click();
        await expect(page.getByRole('heading', { name: 'Choose a password' })).toBeVisible();

        expect(await page.locator('input[name="password1"]').getAttribute('type')).toBe('password');
        expect(await page.locator('input[name="password2"]').getAttribute('type')).toBe('password');
        await page.locator('input[name="password1"]').fill('Aa1!');
        await page.getByRole('heading', { name: 'Choose a password' }).click();
        await expect(page.getByText('Password should have at least 8 characters')).toBeVisible();

        await page.locator('input[name="password1"]').fill('Aa111111');
        await page.getByRole('heading', { name: 'Choose a password' }).click();
        await expect(page.getByText('Password should contain a special character')).toBeVisible();

        await page.locator('input[name="password1"]').fill('aa11111!');
        await page.getByRole('heading', { name: 'Choose a password' }).click();
        await expect(page.getByText('Password should contain an uppercase letter')).toBeVisible();

        await page.locator('input[name="password1"]').fill('AA11111!');
        await page.getByRole('heading', { name: 'Choose a password' }).click();
        await expect(page.getByText('Password should contain a lowercase letter')).toBeVisible();

        await page.locator('input[name="password1"]').fill('AaAaAaAaAa!');
        await page.getByRole('heading', { name: 'Choose a password' }).click();
        await expect(page.getByText('Password should contain a number')).toBeVisible();

        await page.locator('input[name="password1"]').fill(pass);
        await page.getByRole('heading', { name: 'Choose a password' }).click();
        await expect(page.getByText('Password should contain a number')).not.toBeVisible();
        await expect(
            page.getByText('Password should contain an uppercase letter')
        ).not.toBeVisible();
        await expect(
            page.getByText('Password should contain a lowercase letter')
        ).not.toBeVisible();
        await expect(
            page.getByText('Password should contain a special character')
        ).not.toBeVisible();

        await page.locator('input[name="password2"]').click();
        await page.getByRole('heading', { name: 'Choose a password' }).click();
        await expect(page.getByText('Passwords should match')).toBeVisible();

        await page.getByRole('button').first().click();
        expect(await page.locator('input[name="password1"]').getAttribute('type')).toBe('text');

        await page.locator('input[name="password2"]').fill(pass);
        await page.getByRole('heading', { name: 'Choose a password' }).click();
        await expect(page.getByText('Passwords should match')).not.toBeVisible();

        await page.getByRole('button', { name: 'Submit' }).click();

        await page.waitForLoadState('networkidle');
        await expect(page.getByText('This email is already in use')).toBeVisible();

        await page.getByRole('link', { name: 'Sign in' }).click();
        await page.waitForURL('/auth/login');
        expect(page).toHaveURL('/auth/login');
        await expect(page.locator('[data-test-id="sign-in-form"]')).toBeVisible();

        await page.locator('[data-test-id="sign-in-form"]').getByPlaceholder('Email').click();
        await page.locator('[data-test-id="sign-in-form"]').click();
        await expect(
            page
                .locator('[data-test-id="sign-in-form"]')
                .getByText('Oops! The email you entered is invalid')
        ).toBeInViewport();

        await page.getByPlaceholder('Password').click();
        await page.locator('[data-test-id="sign-in-form"]').click();
        await expect(
            page.locator('[data-test-id="sign-in-form"]').getByText('Please enter your password')
        ).toBeInViewport();

        await page.locator('[data-test-id="sign-in-form"]').getByPlaceholder('Email').fill(email);
        await page.locator('[data-test-id="sign-in-form"]').click();
        await expect(
            page
                .locator('[data-test-id="sign-in-form"]')
                .getByText('Oops! The email you entered is invalid')
        ).not.toBeInViewport();

        await page.getByPlaceholder('Password').fill(pass);
        await page.locator('[data-test-id="sign-in-form"]').click();
        await expect(
            page.locator('[data-test-id="sign-in-form"]').getByText('Please enter your password')
        ).not.toBeInViewport();

        await page
            .locator('[data-test-id="sign-in-form"]')
            .getByRole('button', { name: 'continue' })
            .click();

        await page.waitForTimeout(3000);
        expect(page).toHaveURL('/');

        await page.getByTestId('profile-button').click();
        await expect(page.getByText(name)).toBeVisible();
        await expect(page.getByText(email)).toBeVisible();
    });
});
