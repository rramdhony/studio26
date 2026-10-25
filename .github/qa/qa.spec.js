// Studio26 QA Gate — Playwright Test Suite
// Maps directly to Studio26_QA_Standard.md (3 pillars)
// Run via: npx playwright test --config .github/qa/playwright.config.js

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const BASE_URL = 'http://localhost:3000';

// Bring a page to its final visual state: load every lazy image, then let CSS animations finish.
async function settle(page, label) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(
    () => Array.from(document.images).every(img => img.complete && img.naturalWidth > 0),
    null, { timeout: 15000 }
  ).catch(() => {});
  const broken = await page.$$eval('img', imgs =>
    imgs.filter(img => !(img.complete && img.naturalWidth > 0)).map(img => img.currentSrc || img.src));
  expect(broken, `Images not loaded at ${label}:\n${broken.join('\n')}`).toEqual([]);
  await page.waitForFunction(
    () => document.getAnimations().every(a => a.playState !== 'running'),
    null, { timeout: 10000 }
  );
}

// ─────────────────────────────────────────────
// PILLAR 1 — FUNCTIONAL QA
// ─────────────────────────────────────────────
test.describe('Pillar 1 — Functional', () => {

  test('Zero console errors on page load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    expect(errors, `Console errors found:\n${errors.join('\n')}`).toEqual([]);
  });

  test('Zero 404s in network requests', async ({ page }) => {
    const notFound = [];
    page.on('response', res => {
      if (res.status() === 404) notFound.push(res.url());
    });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    expect(notFound, `404 responses:\n${notFound.join('\n')}`).toEqual([]);
  });

  test('All same-origin links resolve without 4xx/5xx', async ({ page }) => {
    await page.goto(BASE_URL);
    const hrefs = await page.$$eval('a[href]', anchors =>
      anchors
        .map(a => a.href)
        .filter(href =>
          href.startsWith('http://localhost') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:')
        )
    );
    const broken = [];
    for (const href of [...new Set(hrefs)]) {
      try {
        const res = await page.request.get(href);
        if (res.status() >= 400) broken.push(`${res.status()} — ${href}`);
      } catch {
        broken.push(`ERR — ${href}`);
      }
    }
    expect(broken, `Broken links:\n${broken.join('\n')}`).toEqual([]);
  });

});

// ─────────────────────────────────────────────
// PILLAR 2 — MOBILE RESPONSIVENESS
// ─────────────────────────────────────────────
test.describe('Pillar 2 — Mobile Responsiveness', () => {

  const VIEWPORTS = [
    { width: 375,  height: 812,  name: '375_iPhoneSE'  },
    { width: 390,  height: 844,  name: '390_iPhone14'  },
    { width: 430,  height: 932,  name: '430_iPhone14Plus' },
    { width: 768,  height: 1024, name: '768_iPad'      },
    { width: 1024, height: 768,  name: '1024_iPadLandscape' },
    { width: 1440, height: 900,  name: '1440_Desktop'  },
  ];

  for (const vp of VIEWPORTS) {
    test(`No horizontal scroll at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow, `Horizontal scroll present at ${vp.width}px`).toBe(false);
    });
  }

  test('Screenshot captures at all breakpoints (artifacts)', async ({ page }) => {
    // Six full loads, each waiting out the streaming hero video, lazy images and the opening animation.
    test.setTimeout(VIEWPORTS.length * 60000);
    const fs = require('fs');
    if (!fs.existsSync('qa-screenshots')) fs.mkdirSync('qa-screenshots', { recursive: true });
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await settle(page, vp.name);
      await page.screenshot({
        path: `qa-screenshots/${vp.name}.png`,
        fullPage: true,
      });
    }
  });

  for (const path of ['/', '/ai-video']) {
    test(`Interactive elements meet 44x44px tap target at 375px (${path})`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(BASE_URL + path);
      await page.waitForLoadState('networkidle');

      const violations = await page.evaluate(() => {
        const selectors = 'a, button, input, select, textarea, [role="button"], [role="link"]';
        return Array.from(document.querySelectorAll(selectors))
          .map(el => {
            // Visually hidden inputs are operated through their label, so the label is the target.
            const label = el.id ? document.querySelector(`label[for="${el.id}"]`) : null;
            const r = el.getBoundingClientRect();
            const invisible = getComputedStyle(el).opacity === '0' || r.width < 2 || r.height < 2;
            const target = el.tagName === 'INPUT' && label && invisible ? label : el;
            return { el, rect: target.getBoundingClientRect() };
          })
          .filter(({ el, rect }) => {
            if (rect.width === 0 && rect.height === 0) return false; // hidden
            if (el.closest('[aria-hidden="true"]') || el.getAttribute('tabindex') === '-1') return false; // not reachable
            if (el.tagName === 'A') {
              // Inline text link exemption: only when the link sits inside a longer run of text.
              const block = el.closest('p, li, td, dd');
              if (block && block.textContent.trim().length > el.textContent.trim().length) return false;
            }
            return rect.width < 44 || rect.height < 44;
          })
          .map(({ el, rect }) => `${Math.round(rect.width)}x${Math.round(rect.height)}px: ${el.outerHTML.slice(0, 80)}`);
      });

      expect(violations, `Tap targets below 44x44px:\n${violations.join('\n')}`).toEqual([]);
    });
  }

  test('Hero reel pane stays within the reel safe crop (2:3 to 9:10) on desktop sizes', async ({ page }) => {
    for (const [width, height] of [[1024, 768], [1024, 900], [1440, 900], [1920, 1080], [2560, 1080]]) {
      await page.setViewportSize({ width, height });
      await page.goto(BASE_URL);
      const ratio = await page.$eval('.hero-reel', el => { const r = el.getBoundingClientRect(); return r.width / r.height; });
      expect(ratio, `Reel pane ratio ${ratio.toFixed(2)} at ${width}x${height}`).toBeGreaterThanOrEqual(0.66);
      expect(ratio, `Reel pane ratio ${ratio.toFixed(2)} at ${width}x${height}`).toBeLessThanOrEqual(0.9);
    }
  });

  for (const path of ['/', '/ai-video']) {
    test(`Header items stay on one line at 1024, 1280 and 1440px (${path})`, async ({ page }) => {
      for (const width of [1024, 1280, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(BASE_URL + path);
        const wrapped = await page.$$eval('.site-head a', els =>
          els.filter(e => e.getBoundingClientRect().height > 52).map(e => e.textContent.trim()));
        expect(wrapped, `Header items wrapping at ${width}px`).toEqual([]);
        const overflow = await page.$eval('.site-head', h => h.scrollWidth > h.clientWidth + 1);
        expect(overflow, `Header overflows its column at ${width}px`).toBe(false);
      }
    });
  }

  test('No font size below 14px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const violations = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*'))
        .filter(el => {
          if (!el.textContent?.trim()) return false;
          const style = window.getComputedStyle(el);
          const size = parseFloat(style.fontSize);
          return size > 0 && size < 14;
        })
        .map(el => ({
          tag: el.tagName,
          fontSize: window.getComputedStyle(el).fontSize,
          text: el.textContent?.trim().slice(0, 40),
        }));
    });

    expect(violations, `Font sizes below 14px:\n${JSON.stringify(violations, null, 2)}`).toEqual([]);
  });

});

// ─────────────────────────────────────────────
// ENQUIRY FORM — the paths that reach the Worker and D1
// ─────────────────────────────────────────────
test.describe('Enquiry form', () => {
  const valid = { name: 'QA Test', email: 'qa@example.com', company: '', need: 'website', message: 'Automated QA enquiry.' };
  const post = (request, data, headers = {}) =>
    request.post(`${BASE_URL}/api/enquiry`, { headers: { Origin: BASE_URL, Accept: 'application/json', ...headers }, data });

  test('Empty submit shows inline errors linked to their fields and focuses the first', async ({ page }) => {
    await page.goto(`${BASE_URL}/#contact`);
    await page.click('#enquiry button[type="submit"]');
    await expect(page.locator('#formStatus')).toHaveText('Please check the highlighted fields.');
    for (const id of ['f-name', 'f-email', 'f-message']) {
      await expect(page.locator(`#${id}`)).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator(`#${id}`)).toHaveAttribute('aria-describedby', `${id}-error`);
      await expect(page.locator(`#${id}-error`)).toBeVisible();
    }
    await expect(page.locator('#f-name')).toBeFocused();
  });

  test('A valid enquiry passes Turnstile, is stored and confirmed', async ({ page }) => {
    await page.goto(`${BASE_URL}/#contact`);
    await page.fill('#f-name', valid.name);
    await page.fill('#f-email', valid.email);
    await page.fill('#f-message', valid.message);
    await page.click('label[for="need-both"]');
    await page.click('#enquiry button[type="submit"]');
    await expect(page.locator('#formStatus')).toHaveText(/Thank you/, { timeout: 20000 });
    await expect(page.locator('#f-name')).toHaveValue('');
  });

  test('API rejects a submission without a Turnstile token', async ({ request }) => {
    const res = await post(request, valid);
    expect(res.status()).toBe(403);
    expect((await res.json()).error).toMatch(/confirm you are a person/);
  });

  test('API rejects cross-origin posts', async ({ request }) => {
    const res = await post(request, valid, { Origin: 'https://evil.example' });
    expect(res.status()).toBe(403);
  });

  test('API rejects an invalid email', async ({ request }) => {
    const res = await post(request, { ...valid, email: 'not-an-email' });
    expect(res.status()).toBe(422);
  });

  test('Honeypot submissions get a silent success', async ({ request }) => {
    const res = await post(request, { ...valid, website: 'http://spam.example' });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test('Without JavaScript the form posts and gets a readable reply page', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/#contact`);
    await page.fill('#f-name', valid.name);
    await page.fill('#f-email', valid.email);
    await page.fill('#f-message', valid.message);
    // Keyboard submit: with JavaScript disabled, Playwright's click stability check never resolves.
    await page.locator('#enquiry button[type="submit"]').focus();
    await page.keyboard.press('Enter');
    // Turnstile needs JavaScript, so the honest reply is a clear refusal with a way back.
    await expect(page.locator('h1')).toHaveText('Your enquiry was not sent');
    await expect(page.getByText('email hello@studio26.me')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to studio26.me' })).toBeVisible();
    await context.close();
  });
});

// ─────────────────────────────────────────────
// OTHER PAGES — core checks from all three pillars
// ─────────────────────────────────────────────
for (const path of ['/ai-video', '/privacy']) {
  test.describe(`Other pages — ${path}`, () => {

    test('Zero console errors and 404s', async ({ page }) => {
      const problems = [];
      page.on('console', msg => { if (msg.type() === 'error') problems.push(msg.text()); });
      page.on('pageerror', err => problems.push(err.message));
      page.on('response', res => { if (res.status() === 404) problems.push(`404 ${res.url()}`); });
      await page.goto(BASE_URL + path);
      await page.waitForLoadState('networkidle');
      expect(problems, problems.join('\n')).toEqual([]);
    });

    test('No horizontal scroll at 375px and 1440px', async ({ page }) => {
      for (const width of [375, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(BASE_URL + path);
        await page.waitForLoadState('networkidle');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        expect(overflow, `Horizontal scroll at ${width}px`).toBe(false);
      }
    });

    test('axe-core WCAG 2.1 AA, one <h1>, skip link', async ({ page }) => {
      await page.goto(BASE_URL + path);
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations.map(v => `${v.id}: ${v.nodes[0].html.slice(0, 100)}`)).toEqual([]);
      expect(await page.$$eval('h1', els => els.length)).toBe(1);
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.getAttribute('href'))).toBe('#main-content');
    });

  });
}

// ─────────────────────────────────────────────
// PILLAR 3 — WCAG 2.1 AA ACCESSIBILITY
// ─────────────────────────────────────────────
test.describe('Pillar 3 — WCAG 2.1 AA', () => {

  test('axe-core: Full WCAG 2.1 AA audit', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (results.violations.length > 0) {
      const summary = results.violations.map(v =>
        `[${v.impact.toUpperCase()}] ${v.id}: ${v.description}\n` +
        v.nodes.slice(0, 2).map(n => `  → ${n.html.slice(0, 100)}`).join('\n')
      ).join('\n\n');
      expect.soft(results.violations, `axe violations:\n\n${summary}`).toEqual([]);
    }

    expect(results.violations).toEqual([]);
  });

  test('Exactly one <h1> on the page', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.$$eval('h1', els => els.length);
    expect(count, `Expected 1 <h1>, found ${count}`).toBe(1);
  });

  test('Heading hierarchy has no skipped levels', async ({ page }) => {
    await page.goto(BASE_URL);
    const levels = await page.$$eval('h1,h2,h3,h4,h5,h6', els =>
      els.map(el => parseInt(el.tagName[1]))
    );
    for (let i = 1; i < levels.length; i++) {
      const gap = levels[i] - levels[i - 1];
      expect(gap, `Heading level skipped: h${levels[i - 1]} → h${levels[i]}`).toBeLessThanOrEqual(1);
    }
  });

  test('<html> element has lang attribute', async ({ page }) => {
    await page.goto(BASE_URL);
    const lang = await page.$eval('html', el => el.getAttribute('lang'));
    expect(lang, '<html> missing lang attribute').toBeTruthy();
  });

  test('Viewport meta tag is present', async ({ page }) => {
    await page.goto(BASE_URL);
    const content = await page.$eval(
      'meta[name="viewport"]',
      el => el.getAttribute('content')
    ).catch(() => null);
    expect(content, 'Missing <meta name="viewport">').toBeTruthy();
  });

  test('<main id="main-content"> exists', async ({ page }) => {
    await page.goto(BASE_URL);
    const el = await page.$('main#main-content');
    expect(el, 'Missing <main id="main-content">').not.toBeNull();
  });

  test('Skip link is first focusable element and targets #main-content', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return { tag: el?.tagName, href: el?.getAttribute('href') };
    });
    expect(focused.href, 'First Tab focus should be skip link to #main-content').toBe('#main-content');
  });

  test('No buttons are <div> or <span> with click handlers', async ({ page }) => {
    await page.goto(BASE_URL);
    const fakeButtons = await page.$$eval('[onclick]:not(button):not(a):not(input)', els =>
      els.map(el => el.outerHTML.slice(0, 80))
    );
    expect(fakeButtons, `Non-semantic click handlers found:\n${fakeButtons.join('\n')}`).toEqual([]);
  });

  test('All inputs have associated <label>', async ({ page }) => {
    await page.goto(BASE_URL);
    const unlabelled = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input, select, textarea'))
        .filter(el => {
          if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button') return false;
          const id = el.id;
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          const hasAriaLabel = el.getAttribute('aria-label');
          const hasAriaLabelledBy = el.getAttribute('aria-labelledby');
          return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy;
        })
        .map(el => el.outerHTML.slice(0, 80));
    });
    expect(unlabelled, `Inputs without labels:\n${unlabelled.join('\n')}`).toEqual([]);
  });

  test('Decorative images have empty alt=""', async ({ page }) => {
    await page.goto(BASE_URL);
    // Flag images with no alt attribute at all (different from alt="")
    const missing = await page.$$eval('img:not([alt])', els =>
      els.map(el => el.outerHTML.slice(0, 80))
    );
    expect(missing, `Images missing alt attribute:\n${missing.join('\n')}`).toEqual([]);
  });

  test('Animations use prefers-reduced-motion', async ({ page }) => {
    await page.goto(BASE_URL);
    // Check that any @keyframes usage has a prefers-reduced-motion counterpart
    const hasAnimation = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule.type === CSSRule.KEYFRAMES_RULE) return true;
          }
        } catch { /* cross-origin sheet */ }
      }
      return false;
    });

    if (hasAnimation) {
      const hasMotionQuery = await page.evaluate(() => {
        const sheets = Array.from(document.styleSheets);
        for (const sheet of sheets) {
          try {
            const rules = Array.from(sheet.cssRules || []);
            for (const rule of rules) {
              if (
                rule.type === CSSRule.MEDIA_RULE &&
                rule.conditionText?.includes('prefers-reduced-motion')
              ) return true;
            }
          } catch { /* cross-origin sheet */ }
        }
        return false;
      });
      expect(hasMotionQuery, 'Animations found but no prefers-reduced-motion media query').toBe(true);
    }
  });

});
