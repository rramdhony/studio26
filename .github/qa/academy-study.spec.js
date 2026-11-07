const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('particle opening renders, pauses, replays and ends without blocking content', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.stage')).toHaveAttribute('data-ready','true');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'Pause motion',exact:true}).click();
  await expect(page.locator('.stage')).toHaveAttribute('data-playing','false');
  await page.getByRole('button',{name:'Resume motion',exact:true}).click();
  await expect(page.locator('.stage')).toHaveAttribute('data-playing','true');
  await expect(page.locator('.stage')).toHaveAttribute('data-playing','false',{timeout:10000});
  await page.getByRole('button',{name:'Replay opening',exact:true}).click();
  await expect(page.locator('.stage')).toHaveAttribute('data-playing','true');
  expect(errors).toEqual([]);
});

test('logo handoff reveals the existing wordmark and supports keyboard selection', async ({page}) => {
  await page.goto('/');
  const select=page.getByRole('button',{name:'Homepage reveal',exact:true});
  await select.focus();await page.keyboard.press('Enter');
  await expect(select).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.stage')).toHaveAttribute('data-playing','false',{timeout:8000});
  expect(await page.locator('.logo-reveal').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
  expect(await page.locator('.logo-reveal img').evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  expect((await page.locator('.logo-reveal img').boundingBox()).width).toBeLessThan(450);
  expect(await page.locator('.homepage-copy').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
  await page.setViewportSize({width:390,height:844});
  const mark=await page.locator('.logo-reveal img').boundingBox();
  expect(mark.width).toBeLessThan(300);
  expect(mark.y+mark.height).toBeLessThan((await page.locator('.homepage-copy').boundingBox()).y);
  await page.getByRole('button',{name:'Academy opening',exact:true}).click();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Learn by making.Grow by doing.');
});

test('responsive study remains legible and passes automated accessibility checks', async ({page}) => {
  await page.goto('/');
  for(const width of [320,375,390,430,768,1024,1440]) {
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});
  const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(a.violations).toEqual([]);
  const buttons=await page.locator('button:visible').evaluateAll(nodes=>nodes.map(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})));
  for(const box of buttons){expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);}
});

test('reduced motion presents static artwork without starting WebGL', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.stage')).toHaveAttribute('data-playing','false');
  expect(await page.locator('.stage').getAttribute('data-ready')).toBeNull();
  await expect(page.locator('#pause-motion')).toBeHidden();
  await page.getByRole('button',{name:'Homepage reveal',exact:true}).click();
  expect(await page.locator('.logo-reveal').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
});

test('no-JavaScript and lost graphics contexts preserve the content and static artwork', async ({browser,page}) => {
  const ctx=await browser.newContext({javaScriptEnabled:false});
  const staticPage=await ctx.newPage();await staticPage.goto('http://127.0.0.1:3002/');
  await expect(staticPage.getByRole('heading',{level:1})).toBeVisible();
  await expect(staticPage.locator('.still')).toBeVisible();
  await ctx.close();
  await page.goto('/');
  await expect(page.locator('.stage')).toHaveAttribute('data-ready','true');
  await page.locator('canvas').evaluate(c=>c.getContext('webgl').getExtension('WEBGL_lose_context').loseContext());
  await expect(page.locator('.stage')).toHaveAttribute('data-ready','false');
  await expect(page.locator('#pause-motion')).toBeHidden();
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
});

test('study server exposes only review assets and prevents indexing', async ({request}) => {
  expect((await request.get('/')).headers()['x-robots-tag']).toContain('noindex');
  for(const path of ['/.dev.vars','/src/index.js','/package.json','/public/index.html']) expect((await request.get(path)).status()).toBe(404);
});
