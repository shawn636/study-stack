import { expect, test } from '@playwright/test';

test('sucessfuly loads multiple categories', async ({ page }) => {
	await page.goto('/');
	const categories = await page.$$('[data-testid^="category-card"]');
	expect(categories.length).toBe(5);
});

test('successfully loads all images', async ({ page }) => {
	await page.waitForLoadState();

	const images = await page.$$('img');

	for (const image of images) {
		const imageSrc = await image.getAttribute('src');
		const imageExists = await page.evaluate(async (src) => {
			try {
				if (!src) {
					throw new Error('Image source is empty, unable to load image.');
				}

				await new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = resolve;
					img.onerror = reject;
					img.src = src;
				});
				return true;
			} catch (err) {
				return false;
			}
		}, imageSrc);

		expect(imageExists).toBe(true);
	}
});
