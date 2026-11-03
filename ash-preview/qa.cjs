// Run against the local Worker or its dedicated preview using the website's Playwright dependencies.
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const base = new URL(process.env.ASH_QA_URL || 'http://127.0.0.1:3186');
assert.ok(['127.0.0.1','localhost','studio26-ash-slice1-preview.ruben-ramdhony.workers.dev'].includes(base.hostname));
const browserOptions = { channel: 'chrome', headless: true };
const results = [];
async function run() {
  const browser = await chromium.launch(browserOptions);
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: {width: 1280, height: 800} });
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('request', r => requests.push({ url:r.url(), method:r.method() }));
    page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
    const response = await page.goto(base.href);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    async function scan(label) {
      const {violations} = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
      assert.deepEqual(violations.map(v => [v.id, v.nodes.map(n => n.target)]), [], label);
      results.push(label);
    }
    async function screenshot(name) {
      if (process.env.ASH_QA_SHOTS) await page.screenshot({path:path.join(process.env.ASH_QA_SHOTS, name + '.png')});
    }

    const launch = page.locator('#ash-launcher');
    const dialog = page.locator('#ash-dialog');
    const input = page.locator('#ash-input');
    const turns = page.locator('#ash-turns');
    const clear = page.locator('#ash-clear');
    async function changeLanguage() {
      const current = await page.locator('html').getAttribute('lang');
      await dialog.locator('[data-lang="' + (current === 'en' ? 'fr' : 'en') + '"]').click();
    }
    async function ask(question) {
      await input.fill(question);
      await input.press('Enter');
    }
    const includes = async (pattern) => assert.match((await turns.innerText()).replace(/[\u00a0\u202f]/g,' '), pattern);
    await page.locator('.cover-portrait').evaluate(image => image.decode());
    const corpus = await page.evaluate(async () => {
      const { validateCatalogue, matchQuestion } = await import('./ash.js');
      const data = await (await fetch('./catalogue.v1.json')).json();
      const { index } = validateCatalogue(data);
      const misses = [];
      let tested = 0;
      for (const answer of data.answers) {
        for (const language of ['en','fr']) {
          for (const alias of answer[language].aliases || []) {
            tested++;
            if (matchQuestion(alias, index).id !== answer.id) misses.push(alias);
          }
        }
      }
      const probes = [
        ['Hey, where is your studio based?', 'location'],
        ['Bonjour, quel est le prix d’un site avec un chatbot ?', 'website-ai'],
        ['Who reviews my website before launch, please?', 'team'],
        ['Vous êtes basés où, merci ?', 'location'],
        ['Hello, I do not need a website but can you fund my business?', 'fallback-unknown'],
        ['Bonjour, combien coûte un site si vous livrez demain ?', 'fallback-commitment'],
      ];
      for (const [question, id] of probes) {
        if (matchQuestion(question,index).id !== id) misses.push(question);
      }
      return {tested,misses};
    });
    assert.deepEqual(corpus.misses, []);
    results.push(corpus.tested + ' catalogue aliases plus six mixed-phrasing and boundary probes');
    await screenshot('ash-cover');
    await launch.click();
    await input.waitFor({state:'visible'});
    await page.waitForFunction(() => !document.querySelector('#ash-input').disabled);
    await ask('Hi, how much is a website with an AI assistant?');
    await includes(/4,000/);
    await includes(/95/);
    await includes(/1,000/);
    assert.equal(await turns.locator('a[href="https://studio26.me/#services"]').count(),1);
    await changeLanguage();
    await includes(/4 000/);
    await includes(/1 000/);
    await clear.click();
    await ask('Bonjour, combien coûte un site avec un assistant ?');
    await includes(/4 000/);
    await includes(/95/);
    for (const q of ['Pouvez-vous livrer vendredi ?', 'Can you deliver a website by Friday?', 'I do not want a website. Will you lend me money?', '<img src=x onerror=alert(1)>']) {
      await clear.click();
      await ask(q);
      assert.equal(await turns.locator('a[href^="https://studio26.me"]').count(),0,q);
      assert.equal(await turns.locator('a[href="mailto:hello@studio26.me"]').count(),1,q);
      assert.equal(await turns.locator('img[src="x"]').count(),0);
    }
    await clear.click();
    await dialog.locator('#ash-topics button').first().click();
    assert.ok(await turns.locator('a[href^="https://studio26.me/"]').count() > 0);
    await page.goBack();
    await dialog.waitFor({state:'hidden'});
    await launch.click();
    await dialog.waitFor({state:'visible'});
    await dialog.locator('#ash-close').click();
    await dialog.waitFor({state:'hidden'});
    await page.reload();
    await launch.click();
    await dialog.waitFor({state:'visible'});
    assert.equal(await turns.locator('a[href^="https://studio26.me/"]').count(), 0, 'Reload forgets chat');
    await page.keyboard.press('Escape');
    await dialog.waitFor({state:'hidden'});
    results.push('EN/FR pricing, language continuity, handoff, injection, suggested topic, clear, history and reload');
    // Mobile responsiveness after completing the functional flows.
    for (const width of [320,375,390,430,768,1024,1440]) {
      await page.setViewportSize({width,height:width < 768 ? 667 : 900});
      const geometry = () => page.evaluate(() => {
        const dialog = document.querySelector('dialog[open]');
        const root = dialog || document.body;
        const visible = [...root.querySelectorAll('button,input:not([type=hidden]),textarea')].filter(el => el.getClientRects().length);
        return {
          inner: innerWidth, width: document.documentElement.scrollWidth,
          dialogOverflow: dialog ? dialog.scrollWidth - dialog.clientWidth : 0,
          small: visible.filter(el => {
            const r = el.getBoundingClientRect();
            return r.width < 43.9 || r.height < 43.9;
          }).map(el => el.id || el.textContent.trim())
        };
      });
      for (const open of [false,true]) {
        if (open) await launch.click();
        const g = await geometry();
        assert.ok(g.width <= g.inner && g.dialogOverflow <= 1, JSON.stringify({width,open,g}));
        assert.deepEqual(g.small, [], 'undersized controls at ' + width);
        if (open) {
          for (const lang of ['en','fr']) {
            await dialog.locator('[data-lang="' + lang + '"]').click();
            const overlap = await dialog.locator('.ash-title').evaluate(el => {
              const range = document.createRange();
              range.selectNodeContents(el);
              const buttons = [...el.parentElement.querySelectorAll('button')].map(b => b.getBoundingClientRect());
              return [...range.getClientRects()].some(r => buttons.some(b =>
                r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top));
            });
            assert.ok(!overlap, 'Title overlaps a control at ' + width + ' in ' + lang);
            const translated = await geometry();
            assert.ok(translated.width <= translated.inner && translated.dialogOverflow <= 1);
            assert.deepEqual(translated.small, []);
          }
        }
        if (open && width === 390) await screenshot('ash-mobile');
        if (open) { await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'}); }
      }
      results.push('Layout and controls ' + width + 'px');
    }
    // WCAG after functional and responsive checks, in each modal language.
    await scan('Cover accessibility');
    await launch.focus();
    await page.keyboard.press('Enter');
    await dialog.waitFor({state:'visible'});
    assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)));
    await scan('Open dialog accessibility');
    await changeLanguage();
    await scan('Second language accessibility');
    await page.keyboard.press('Escape');
    await dialog.waitFor({state:'hidden'});
    assert.ok(await launch.evaluate(el => el === document.activeElement));
    assert.deepEqual(errors, []);
    assert.deepEqual(requests.filter(r => r.method !== 'GET' || new URL(r.url).origin !== base.origin || new URL(r.url).search), []);
    await context.close();
    console.log(JSON.stringify(results,null,2));
  } finally {
    await browser.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
