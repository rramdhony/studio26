const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('Discovery: sitemap pages expose canonical, content and valid structured data without JS', async ({ browser, request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const paths = [...(await response.text()).matchAll(/<loc>https:\/\/studio26.me([^<]+)<\/loc>/g)].map(m => m[1]);
  expect(paths).toContain('/websites-ai-chatbots');
  const context = await browser.newContext({ javaScriptEnabled: false });
  for (const path of paths) {
    const page = await context.newPage();
    expect((await page.goto(path)).status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://studio26.me${path}`);
    expect((await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.map(n => n.content))).join(' ')).not.toContain('noindex');
    for (const json of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(json)).not.toThrow();
    if (path === '/websites-ai-chatbots') {
      await expect(page.locator('main')).toContainText('$4,000');
      await expect(page.locator('main')).toContainText('not a live generative model');
      for (const href of await page.locator('main a[href^="#"]').evaluateAll(links => links.map(a => a.getAttribute('href')))) await expect(page.locator(href)).toHaveCount(1);
    }
    await page.close();
  }
  await context.close();
});

test('Discovery: common crawler exclusion and no public email in AI summary', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /api/');
  expect(robots.match(/User-agent:/g)).toHaveLength(1);
  const summary = await (await request.get('/llms.txt')).text();
  expect(summary).not.toMatch(/hello@studio26\.me/);
  expect(summary).toContain('/websites-ai-chatbots');
  expect((await request.get('/missing-seo-regression-page')).status()).toBe(404);
});

test('Service guide: mobile reflow, landmarks, contrast, keyboard and enquiry dialog', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/websites-ai-chatbots');
  for (const width of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(a11y.violations).toEqual([]);
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Discuss your project' }).click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  expect(errors).toEqual([]);
  await page.goto('/websites-ai-chatbots');
  await page.screenshot({ path: 'test-results/seo/service-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'test-results/seo/service-desktop.png', fullPage: true });
});
