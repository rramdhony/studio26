import { EmailMessage } from 'cloudflare:email';

// Static assets are matched first except /video/* (for HTTP 206 Range seeking) and /api/*.
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return handleApi(request, env, ctx, url);
    if (url.pathname.startsWith('/video/')) return handleVideoRange(request, env, url);
    return env.ASSETS.fetch(request);
  },
};

async function handleVideoRange(request, env, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const assetReq = new Request(url.toString(), { method: 'GET' });
  const assetRes = await env.ASSETS.fetch(assetReq);
  if (!assetRes.ok) return assetRes;

  const buf = await assetRes.arrayBuffer();
  const total = buf.byteLength;
  const contentType = assetRes.headers.get('Content-Type') || (url.pathname.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream');
  const baseHeaders = {
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  };

  const rangeHeader = request.headers.get('Range');
  if (!rangeHeader) {
    return new Response(request.method === 'HEAD' ? null : buf, {
      status: 200,
      headers: { ...baseHeaders, 'Content-Length': String(total) },
    });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!match || (match[1] === '' && match[2] === '')) {
    return new Response(null, {
      status: 416,
      headers: { ...baseHeaders, 'Content-Range': `bytes */${total}` },
    });
  }

  let start;
  let end;
  if (match[1] === '') {
    const suffix = parseInt(match[2], 10);
    if (suffix === 0) {
      return new Response(null, {
        status: 416,
        headers: { ...baseHeaders, 'Content-Range': `bytes */${total}` },
      });
    }
    start = Math.max(0, total - suffix);
    end = total - 1;
  } else {
    start = parseInt(match[1], 10);
    end = match[2] ? Math.min(total - 1, parseInt(match[2], 10)) : total - 1;
  }

  if (Number.isNaN(start) || Number.isNaN(end) || start >= total || start > end) {
    return new Response(null, {
      status: 416,
      headers: { ...baseHeaders, 'Content-Range': `bytes */${total}` },
    });
  }

  const chunk = buf.slice(start, end + 1);
  return new Response(request.method === 'HEAD' ? null : chunk, {
    status: 206,
    headers: {
      ...baseHeaders,
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Length': String(chunk.byteLength),
    },
  });
}

const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

const NEEDS = { website: 'A website', video: 'An AI video ad', both: 'Both', unsure: 'Not sure yet' };
const MAX = { name: 120, email: 200, company: 160, message: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 20_000;
const DEFAULT_PER_IP_PER_HOUR = 5;

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY_HEADERS, ...extra },
  });
}

// For visitors without JavaScript, who post the form directly.
function page(title, message, status = 200) {
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)} · Studio26</title><link rel="stylesheet" href="/assets/site.css"></head><body><main id="main-content" class="notice"><h1 class="section-title">${esc(title)}</h1><p>${esc(message)}</p><p><a class="btn btn-ink" href="/">Back to studio26.me</a></p></main></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS } });
}

async function handleApi(request, env, ctx, url) {
  if (url.pathname === '/api/enquiry') {
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });
    return handleEnquiry(request, env, ctx, url);
  }
  return json({ error: 'Not found' }, 404);
}

async function handleEnquiry(request, env, ctx, url) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const fail = (message, status) => (wantsJson ? json({ error: message }, status) : page('Your enquiry was not sent', message, status));

  // Same-origin only: the form is the one legitimate caller.
  if (request.headers.get('Origin') !== url.origin) return fail('This form can only be sent from studio26.me.', 403);
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) return fail('That message is too long.', 413);

  let data;
  try {
    const type = request.headers.get('Content-Type') || '';
    data = type.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return fail('We could not read the form. Please try again.', 400);
  }

  const field = (k) => (typeof data[k] === 'string' ? data[k].trim() : '');
  const enquiry = {
    name: field('name'),
    email: field('email'),
    company: field('company'),
    need: field('need'),
    message: field('message'),
  };

  // Honeypot: real visitors never see this field. Pretend success so bots learn nothing.
  if (field('hp_field')) return wantsJson ? json({ ok: true }) : page('Thank you', 'Your enquiry is in, and we will reply by email.');

  if (!enquiry.name || enquiry.name.length > MAX.name) return fail('Please tell us your name.', 422);
  if (!EMAIL_RE.test(enquiry.email) || enquiry.email.length > MAX.email) return fail('Please enter an email address we can reply to.', 422);
  if (enquiry.company.length > MAX.company) return fail('The company name is too long.', 422);
  if (!(enquiry.need in NEEDS)) return fail('Please choose what you need.', 422);
  if (!enquiry.message || enquiry.message.length > MAX.message) return fail('Please tell us a little about the project.', 422);

  // Without a salt the stored IP hashes are trivially reversible, so treat it as a configuration error.
  if (!env.DB || !env.IP_SALT) return fail('Enquiries are temporarily unavailable. Please email hello@studio26.me.', 503);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await verifyTurnstile(field('cf-turnstile-response'), ip, env))) {
    return fail('We could not confirm you are a person. Please try again, or email hello@studio26.me.', 403);
  }

  const ipHash = await hash(ip + env.IP_SALT);
  const limit = Number(env.ENQUIRY_LIMIT_PER_HOUR) || DEFAULT_PER_IP_PER_HOUR;
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM enquiries WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')"
  ).bind(ipHash).first();
  if (recent && recent.n >= limit) return fail('You have sent several enquiries already. Please email hello@studio26.me.', 429);

  await env.DB.prepare(
    'INSERT INTO enquiries (name, email, company, need, message, ip_hash, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    enquiry.name, enquiry.email, enquiry.company || null, enquiry.need, enquiry.message,
    ipHash, (request.headers.get('User-Agent') || '').slice(0, 300)
  ).run();

  // The enquiry is already saved, so an email failure must not fail the request.
  ctx.waitUntil(notify(enquiry, env).catch((err) => console.error('notify failed', err)));

  return wantsJson ? json({ ok: true }) : page('Thank you', 'Your enquiry is in, and we will reply by email.');
}

// Fail closed: without a configured secret, nothing gets through.
async function verifyTurnstile(token, ip, env) {
  if (!env.TURNSTILE_SECRET || !token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }),
  });
  if (!res.ok) return false;
  const out = await res.json();
  return out.success === true;
}

async function hash(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Email alert to Studio26 through Cloudflare Email Routing. Skipped until the NOTIFY binding
// (send_email, to a verified destination) and the NOTIFY_FROM / NOTIFY_TO vars are set.
function b64(s) {
  let bin = '';
  new TextEncoder().encode(s).forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

// RFC 2047: keep each encoded word short by encoding the subject in small chunks.
function mimeWord(s) {
  const chars = [...s];
  const words = [];
  for (let i = 0; i < chars.length; i += 20) words.push(`=?UTF-8?B?${b64(chars.slice(i, i + 20).join(''))}?=`);
  return words.join('\r\n ');
}

async function notify(e, env) {
  if (!env.NOTIFY || !env.NOTIFY_TO || !env.NOTIFY_FROM) return;
  const oneLine = (s) => String(s).replace(/[\r\n]+/g, ' ');
  const replyTo = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/.test(e.email) ? e.email : '';
  const body = [
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    `Company: ${e.company || '-'}`,
    `Needs: ${NEEDS[e.need]}`,
    '',
    e.message.replace(/\r\n|\r|\n/g, '\r\n'),
    '',
    'Reply to this email to answer the enquiry.',
  ].join('\r\n');
  const raw = [
    `From: Studio26 website <${env.NOTIFY_FROM}>`,
    `To: ${env.NOTIFY_TO}`,
    `Subject: ${mimeWord(oneLine(`New enquiry: ${e.name.slice(0, 60)} (${NEEDS[e.need]})`))}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Message-ID: <${crypto.randomUUID()}@studio26.me>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(body).replace(/.{76}/g, '$&\r\n'),
  ].filter((line) => line !== null).join('\r\n');
  await env.NOTIFY.send(new EmailMessage(env.NOTIFY_FROM, env.NOTIFY_TO, raw));
}