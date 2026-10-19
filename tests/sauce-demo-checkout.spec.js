const { test, expect } = require('@playwright/test');

test('complete a purchase after verifying three cart products', async ({ page }) => {
  const products = [
    { name: 'Sauce Labs Backpack', price: '$29.99' },
    { name: 'Sauce Labs Bike Light', price: '$9.99' },
    { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
  ];

  await page.goto('/');

  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  for (const product of products.slice(1)) {
    await page
      .locator(
        `//a[@role="button" and normalize-space()="${product.name}"]/ancestor::div[contains(concat(" ", normalize-space(@class), " "), " inventory_item ")][1]//button[normalize-space()="Add to cart"]`,
      )
      .click();
  }

  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html/);

  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(3);

  const cartProducts = await cartItems.evaluateAll((items) =>
    items.map((item) => ({
      name: item.querySelector('a').textContent.trim(),
      price: item.querySelector('[data-test="inventory-item-price"]').textContent.trim(),
    })),
  );
  expect(cartProducts).toEqual(products);

  await cartItems
    .filter({ hasText: products[1].name })
    .getByRole('button', { name: 'Remove' })
    .click();
  await expect(cartItems).toHaveCount(2);
  await expect(cartItems.filter({ hasText: products[1].name })).toHaveCount(0);

  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByLabel('First Name').fill('Playwright');
  await page.getByLabel('Last Name').fill('Student');
  await page.getByLabel('Zip/Postal Code').fill('12345');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.locator('.cart_item')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();

  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();
});
