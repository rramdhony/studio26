// Generate the preview release from reviewed bilingual copy and published Studio26 facts.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

const read = (file) => readFileSync(new URL(file, import.meta.url), 'utf8');
const pages = new Map([['/', read('../public/index.html')], ['/ai-video', read('../public/ai-video.html')], ['/privacy', read('../public/privacy.html')]]);
const knowledge = read('../docs/content/assistant-knowledge-base.md');
const discovery = read('../public/llms.txt');
const values = new Map();
for (const html of pages.values()) {
  for (const match of html.matchAll(/data-price="([^"]+)">\$(\d[\d,]*)<\/span>/g)) {
    const [, key, grouped] = match;
    const value = Number(grouped.replaceAll(',', ''));
    if (values.has(key)) assert.equal(values.get(key), value, 'Inconsistent published price for ' + key);
    values.set(key, value);
  }
}
const allowance = pages.get('/').match(/up to ([\d,]+) visitor chats\)/);
assert.ok(allowance && knowledge.includes(allowance[1] + ' visitor chats') && discovery.includes(allowance[1] + ' visitor conversations'), 'Chat allowance diverged across published sources');
values.set('limit', Number(allowance[1].replaceAll(',', '')));
const required = ['website','website-ai','ai-monthly','limit','video','video-starter','video-growth','video-always'];
const used = { en: new Set(), fr: new Set() };
for (const key of required) {
  assert.ok(values.has(key), 'Missing published fact ' + key);
  if (key === 'limit') continue;
  const published = '$' + values.get(key).toLocaleString('en-US');
  assert.ok(knowledge.includes(published) && discovery.includes(published), 'Published price absent from KB or llms.txt for ' + key);
}
const template = JSON.parse(read('./catalogue.template.json'));
assert.ok(template.version && template.answers?.length, 'Missing version or answers');
const ids = new Set();
for (const answer of template.answers) {
  assert.ok(answer.id && !ids.has(answer.id), 'Missing or duplicate answer ID');
  ids.add(answer.id);
  const source = new URL(answer.source);
  const page = pages.get(source.pathname);
  assert.ok(source.origin === 'https://studio26.me' && !source.search && !source.username && !source.password && source.hash && page?.includes('id="' + source.hash.slice(1) + '"'), 'Unpublished citation: ' + answer.source);
}
function expand(node, lang) {
  if (typeof node === 'string') {
    return node.replace(/\{\{([^{}]+)\}\}/g, (_, key) => {
      assert.ok(used[lang] && required.includes(key), 'Unexpected fact or missing language for ' + key);
      used[lang].add(key);
      return values.get(key).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US');
    });
  }
  if (Array.isArray(node)) return node.map((item) => expand(item, lang));
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, expand(value, Object.hasOwn(used, key) ? key : lang)]));
  }
  return node;
}
const release = expand(template);
for (const lang of ['en','fr']) assert.deepEqual([...used[lang]].sort(), [...required].sort(), 'Missing facts in ' + lang);
writeFileSync(new URL('./public/catalogue.v1.json', import.meta.url), JSON.stringify(release, null, 2) + '\n');
console.log('Ash preview catalogue generated with ' + ids.size + ' bilingual, source-linked answers.');
