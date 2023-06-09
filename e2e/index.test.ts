import { expect, test } from '@playwright/test';

test('sucessfuly loads multiple categories', async ({ page }) => {
    await page.goto('/');
    const categories = await page.$$('[data-testid^="category-card"]');
    expect(categories.length).toBe(6);
});

test('successfully loads all images', async ({ page }) => {
    await page.goto('/');
    const images = await page.$$('img');

    await Promise.all(
        images.map(async (img) => {
            const src = await img.evaluate((img) => img.getAttribute('src'));
            expect(src).toBeTruthy();
            if (src) {
                const response = await fetch(`http://localhost:3000/${src}`);
                if (!response.ok) {
                    console.error(`\n[Error]: Unable to load image at ${src}\n`);
                }
                expect(response).toHaveProperty('status', 200);
            }
        })
    );
});
