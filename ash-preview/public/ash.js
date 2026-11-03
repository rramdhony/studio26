// Ash bilingual preview. Runs entirely in the page: no model calls, storage,
// analytics or submission. The only request is for the static catalogue.

const EMAIL = 'hello@studio26.me';
const MAILTO = `mailto:${EMAIL}`;
const CATALOGUE_URL = new URL('./catalogue.v1.json', import.meta.url).href;
const FETCH_TIMEOUT_MS = 8000;
const MAX_QUESTION_LENGTH = 240;
const MAX_TURNS = 60;

export const FALLBACK_UNKNOWN = 'fallback-unknown';
export const FALLBACK_AMBIGUOUS = 'fallback-ambiguous';
export const FALLBACK_COMMITMENT = 'fallback-commitment';
const LANGUAGES = ['en', 'fr'];

const UI = {
  en: {
    pageTitle: 'Ask Ash, Studio26’s AI assistant',
    portrait: 'Portrait of Ash, Studio26’s AI assistant.',
    skip: 'Skip to Ash',
    lede: 'Ask about websites, AI video, pricing and how the studio works.',
    launcher: 'Ask Ash',
    preferEmail: 'Prefer to write?',
    disclosure:
      'Answers come from a fixed list of published information. What you type stays on this page and is forgotten when you clear or reload.',
    dialogTitle: 'Ask Ash',
    close: 'Close',
    dialogNote: 'Studio26’s AI assistant. Answers come from the studio’s published pages.',
    transcriptLabel: 'Conversation',
    intro:
      'Hi, I’m Ash. What would you like to make? Ask me about the studio, our work or our prices. Please keep personal details out of this preview.',
    you: 'You',
    ash: 'Ash',
    topicsLabel: 'Or choose a topic',
    inputLabel: 'Your question (required)',
    ask: 'Ask',
    clear: 'Clear chat',
    retry: 'Try again',
    loading: 'Loading Ash’s answers.',
    ready: 'Ash is ready.',
    failed:
      'Ash’s answers could not be loaded, so Ash cannot answer right now. Nothing has been sent. You can write to the studio yourself at hello@studio26.me.',
    unsupported:
      'This browser cannot open Ash’s conversation window. You can write to the studio yourself at hello@studio26.me.',
    emailLink: 'Email the studio (opens your mail app)',
    source: 'Source',
    newTab: 'opens in a new tab',
    emptyQuestion: 'Type a question first, or choose a topic.',
    cleared: 'Conversation cleared.',
    languageChanged: 'Language set to English.',
  },
  fr: {
    pageTitle: 'Demander à Ash, l’assistante IA de Studio26',
    portrait: 'Portrait d’Ash, l’assistante IA de Studio26.',
    skip: 'Aller à Ash',
    lede: 'Posez vos questions sur les sites web, la vidéo IA, les tarifs et le fonctionnement du studio.',
    launcher: 'Demander à Ash',
    preferEmail: 'Vous préférez écrire ?',
    disclosure:
      'Les réponses proviennent d’une liste fixe d’informations publiées. Ce que vous saisissez reste sur cette page et est oublié si vous effacez ou rechargez.',
    dialogTitle: 'Demander à Ash',
    close: 'Fermer',
    dialogNote: 'L’assistante IA de Studio26. Les réponses proviennent des pages publiées par le studio.',
    transcriptLabel: 'Conversation',
    intro:
      'Bonjour, je suis Ash. Quel projet avez-vous en tête ? Je peux vous renseigner sur le studio, nos réalisations et nos tarifs. Gardez vos coordonnées pour votre échange avec l’équipe.',
    you: 'Vous',
    ash: 'Ash',
    topicsLabel: 'Ou choisissez un sujet',
    inputLabel: 'Votre question (obligatoire)',
    ask: 'Demander',
    clear: 'Effacer',
    retry: 'Réessayer',
    loading: 'Chargement des réponses d’Ash.',
    ready: 'Ash est prête.',
    failed:
      'Les réponses d’Ash n’ont pas pu être chargées : Ash ne peut donc pas répondre pour le moment. Rien n’a été envoyé. Vous pouvez écrire vous-même au studio à hello@studio26.me.',
    unsupported:
      'Ce navigateur ne peut pas ouvrir la fenêtre de conversation d’Ash. Vous pouvez écrire vous-même au studio à hello@studio26.me.',
    emailLink: 'Écrire au studio (ouvre votre messagerie)',
    source: 'Source',
    newTab: 's’ouvre dans un nouvel onglet',
    emptyQuestion: 'Saisissez d’abord une question ou choisissez un sujet.',
    cleared: 'Conversation effacée.',
    languageChanged: 'Langue définie sur le français.',
  },
};

// Whole-token signals only. These choose which safe fallback is shown when no
// curated alias matched; they can never produce a substantive answer.
const COMMITMENT_TOKENS = new Set([
  'deadline', 'deadlines', 'tomorrow', 'today', 'tonight', 'asap', 'urgent', 'urgently',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'weekend',
  'january', 'february', 'march', 'april', 'june', 'july', 'august', 'september', 'october',
  'november', 'december',
  'deliver', 'delivery', 'delivered', 'guarantee', 'guarantees', 'guaranteed', 'promise', 'commit',
  'commitment', 'available', 'availability', 'book', 'booking', 'reserve', 'discount', 'refund',
  'contract', 'when', 'timeline', 'turnaround',
  'echeance', 'delai', 'delais', 'demain', 'aujourd', 'urgence', 'lundi', 'mardi', 'mercredi',
  'jeudi', 'vendredi', 'samedi', 'dimanche', 'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
  'livrer', 'livrez', 'livrerez', 'livraison', 'garantir', 'garantie', 'garantissez', 'promettre',
  'promesse', 'engagement', 'engager', 'disponible', 'disponibles', 'disponibilite', 'reserver',
  'reservation', 'remise', 'reduction', 'remboursement', 'contrat', 'quand',
]);
const COMMITMENT_PHRASES =
  /(?:^| )(?:how long|next (?:week|month)|this (?:week|month)|combien de temps|semaine prochaine|mois prochain|cette semaine|ce mois)(?: |$)/u;
const SEGMENT_SPLIT = /[?!.;:,…\n]+|(?:^|\s)(?:and|et)(?:\s|$)/u;

/** Case, accent, punctuation and whitespace folding. No stemming or fuzzy logic. */
export function normalizeQuery(raw) {
  return String(raw)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/œ/gu, 'oe')
    .replace(/æ/gu, 'ae')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    // “Comment est-ce qu’on…” and “comment est-ce que l’on…” mean “comment on…”.
    // Accept keyboard variants while keeping the rest of the question intact.
    .replace(/\bcomment est ce (?:qu ?on|que (?:l ?on|on))\b/gu, 'comment on')
    .trim();
}

/** Maps each normalized alias to the answer IDs that claim it. */
export function buildAliasIndex(answers) {
  const index = new Map();
  for (const answer of answers) {
    for (const lang of LANGUAGES) {
      for (const alias of answer[lang].aliases ?? []) {
        const key = normalizeQuery(alias);
        if (!key) continue;
        const entry = index.get(key) ?? { ids: new Set(), lang };
        if (entry.lang !== lang) entry.lang = null;
        entry.ids.add(answer.id);
        index.set(key, entry);
      }
    }
  }
  return index;
}

function hasCommitmentSignal(normalized) {
  if (COMMITMENT_PHRASES.test(normalized)) return true;
  return normalized.split(' ').some((token) => COMMITMENT_TOKENS.has(token));
}

/** True only if every segment is itself a curated alias and they disagree. */
function isMultipleIntent(raw, index) {
  const segments = String(raw)
    .normalize('NFKC')
    .toLowerCase()
    .split(SEGMENT_SPLIT)
    .map(normalizeQuery)
    .filter(Boolean);
  if (segments.length < 2) return false;
  const ids = new Set();
  for (const segment of segments) {
    const entry = index.get(segment);
    if (!entry) return false;
    entry.ids.forEach((id) => ids.add(id));
  }
  return ids.size > 1;
}

/**
 * Whole-string alias matching only, so irrelevant, negated or injected text
 * containing a topic word falls through to a fallback rather than an answer.
 * Returns the answer ID and, when an alias matched, the alias language.
 */
export function matchQuestion(raw, index) {
  const normalized = normalizeQuery(raw);
  if (!normalized || String(raw).length > MAX_QUESTION_LENGTH) {
    return { id: FALLBACK_UNKNOWN, lang: null };
  }
  // Greetings and courtesies may wrap a known whole question in either language.
  // Never discard a substantive clause to manufacture a match.
  const core = normalized
    .replace(/^(?:hello|hi|hey|bonjour|bonsoir|salut|please) /u, '')
    .replace(/ (?:please|thanks|thank you|merci|s il vous plait)$/u, '');
  const entry = index.get(normalized) ?? index.get(core);
  if (entry) {
    const id = entry.ids.size === 1 ? [...entry.ids][0] : FALLBACK_AMBIGUOUS;
    return { id, lang: entry.lang };
  }
  if (hasCommitmentSignal(normalized)) return { id: FALLBACK_COMMITMENT, lang: null };
  if (isMultipleIntent(raw, index)) return { id: FALLBACK_AMBIGUOUS, lang: null };
  return { id: FALLBACK_UNKNOWN, lang: null };
}

function isValidSource(source) {
  try {
    const url = new URL(source);
    return (
      url.protocol === 'https:' &&
      url.origin === 'https://studio26.me' &&
      !url.username &&
      !url.password &&
      !url.search &&
      url.hash.length > 1
    );
  } catch {
    return false;
  }
}

function isCleanCopy(value) {
  return typeof value === 'string' && value.trim() !== '' && !/\{\{|\}\}/u.test(value);
}

/** Throws on anything unsafe to show, including unreplaced price placeholders. */
export function validateCatalogue(data) {
  if (!data || typeof data !== 'object' || !data.version || !Array.isArray(data.answers)) {
    throw new Error('Catalogue shape is invalid');
  }
  const answers = new Map();
  for (const answer of data.answers) {
    if (typeof answer?.id !== 'string' || answers.has(answer.id) || !isValidSource(answer.source)) {
      throw new Error('Catalogue entry is invalid');
    }
    for (const lang of LANGUAGES) {
      const copy = answer[lang];
      const labelOk = copy?.label === undefined || isCleanCopy(copy.label);
      const aliasesOk = copy?.aliases === undefined || Array.isArray(copy.aliases);
      if (!isCleanCopy(copy?.text) || !labelOk || !aliasesOk) {
        throw new Error('Catalogue copy is invalid');
      }
    }
    answers.set(answer.id, answer);
  }
  for (const id of [FALLBACK_UNKNOWN, FALLBACK_AMBIGUOUS, FALLBACK_COMMITMENT]) {
    if (!answers.has(id)) throw new Error('Catalogue fallback is missing');
  }
  return {
    answers,
    index: buildAliasIndex(data.answers),
    topics: data.answers.filter((a) => a.en.label && a.fr.label).map((a) => a.id),
  };
}

function init() {
  const $ = (id) => document.getElementById(id);
  const dialog = $('ash-dialog');
  const launcher = $('ash-launcher');
  const titleEl = $('ash-dialog-title');
  const turnsEl = $('ash-turns');
  const topicsEl = $('ash-topics');
  const form = $('ash-form');
  const input = $('ash-input');
  const askButton = $('ash-ask');
  const hint = $('ash-hint');
  const failure = $('ash-failure');
  const retry = $('ash-retry');
  const status = $('ash-status');
  const pageStatus = $('ash-page-status');
  const coverStatus = $('ash-cover-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Conversation lives only in this array. Answers are held by ID so they can
  // be re-rendered in any language; typed questions are shown as written.
  const state = { lang: 'en', availability: 'loading', catalogue: null, turns: [] };
  let announceTimer = 0;
  let backPending = false;

  const ui = () => UI[state.lang];

  function announce(message) {
    const target = dialog.open ? status : pageStatus;
    window.clearTimeout(announceTimer);
    status.textContent = '';
    pageStatus.textContent = '';
    announceTimer = window.setTimeout(() => {
      target.textContent = message;
    }, 120);
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function emailLink() {
    const link = element('a', 'ash-action', ui().emailLink);
    link.href = MAILTO;
    return link;
  }

  function sourceLink(source) {
    const url = new URL(source);
    const shown = `${url.hostname}${url.pathname === '/' ? '/' : url.pathname}${url.hash}`;
    const link = element('a', 'ash-action', `${ui().source}: ${shown} (${ui().newTab})`);
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  function ashTurn(text, links = []) {
    const item = element('li', 'ash-turn ash-turn-ash');
    item.append(element('p', 'ash-who', ui().ash), element('p', 'ash-text', text));
    if (links.length) {
      const row = element('p', 'ash-links');
      row.append(...links);
      item.append(row);
    }
    return item;
  }

  function visitorTurn(turn) {
    const item = element('li', 'ash-turn ash-turn-visitor');
    item.append(element('p', 'ash-who', ui().you));
    if (turn.topic) {
      item.append(element('p', 'ash-text', state.catalogue.answers.get(turn.topic)[state.lang].label));
    } else {
      const text = element('p', 'ash-text', turn.question);
      text.lang = turn.questionLang;
      text.dir = 'auto';
      text.translate = false;
      item.append(text);
    }
    return item;
  }

  function answerTurn(id) {
    const answer = state.catalogue.answers.get(id);
    const links = [];
    if (answer.handoff) links.push(emailLink());
    if (!id.startsWith('fallback-')) links.push(sourceLink(answer.source));
    return ashTurn(answer[state.lang].text, links);
  }

  function renderTurns() {
    const nodes = [ashTurn(ui().intro)];
    let latestVisitorNode = null;
    if (state.catalogue) {
      for (const turn of state.turns) {
        latestVisitorNode = visitorTurn(turn);
        nodes.push(latestVisitorNode, answerTurn(turn.answerId));
      }
    }
    turnsEl.replaceChildren(...nodes);
    return latestVisitorNode;
  }

  function renderTopics() {
    const ids = state.availability === 'ready' ? state.catalogue.topics : [];
    const current = new Map([...topicsEl.children].map((b) => [b.dataset.answerId, b]));
    if (current.size !== ids.length) {
      topicsEl.replaceChildren(
        ...ids.map((id) => {
          const button = element('button', 'ash-topic');
          button.type = 'button';
          button.dataset.answerId = id;
          return button;
        }),
      );
    }
    // Text is updated in place so a focused button keeps focus across languages.
    for (const button of topicsEl.children) {
      button.textContent = state.catalogue.answers.get(button.dataset.answerId)[state.lang].label;
    }
  }

  function renderAvailability() {
    const ready = state.availability === 'ready';
    const failed = state.availability === 'failed';
    const unsupported = state.availability === 'unsupported';
    input.disabled = !ready;
    askButton.disabled = !ready;
    failure.hidden = !failed;
    coverStatus.textContent = failed ? ui().failed : unsupported ? ui().unsupported : '';
    renderTopics();
  }

  function setHint(message) {
    hint.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function renderLanguage() {
    document.documentElement.lang = state.lang;
    document.title = ui().pageTitle;
    document.querySelector('.cover-portrait').alt = ui().portrait;
    for (const node of document.querySelectorAll('[data-i18n]')) {
      node.textContent = ui()[node.dataset.i18n];
    }
    for (const node of document.querySelectorAll('[data-i18n-aria]')) {
      node.setAttribute('aria-label', ui()[node.dataset.i18nAria]);
    }
    for (const button of document.querySelectorAll('[data-lang]')) {
      button.setAttribute('aria-pressed', String(button.dataset.lang === state.lang));
    }
    if (hint.textContent) setHint(ui().emptyQuestion);
    renderAvailability();
    renderTurns();
  }

  function setLanguage(lang) {
    if (lang === state.lang || !LANGUAGES.includes(lang)) return;
    state.lang = lang;
    renderLanguage();
    announce(ui().languageChanged);
  }

  function addTurn(turn) {
    state.turns.push(turn);
    if (state.turns.length > MAX_TURNS) state.turns.shift();
    const latest = renderTurns();
    const response = latest?.nextElementSibling;
    response?.scrollIntoView({
      block: 'start',
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });
    announce(`${ui().ash}: ${state.catalogue.answers.get(turn.answerId)[state.lang].text}`);
  }

  function resetConversation() {
    state.turns = [];
    input.value = '';
    setHint('');
    renderTurns();
  }

  async function loadCatalogue() {
    state.availability = 'loading';
    renderAvailability();
    announce(ui().loading);
    try {
      const response = await fetch(CATALOGUE_URL, {
        credentials: 'omit',
        cache: 'no-cache',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!response.ok) throw new Error('Catalogue request failed');
      state.catalogue = validateCatalogue(await response.json());
      state.availability = 'ready';
      renderAvailability();
      renderTurns();
      announce(ui().ready);
      return true;
    } catch {
      state.catalogue = null;
      state.availability = 'failed';
      renderAvailability();
      announce(ui().failed);
      return false;
    }
  }

  function openDialog({ push = true } = {}) {
    if (dialog.open) return;
    dialog.showModal();
    // If an earlier close is still unwinding history, the popstate handler
    // re-adds this entry once that navigation lands.
    if (push && !backPending) window.history.pushState({ ashOpen: true }, '');
    titleEl.focus();
    if (state.availability === 'failed') announce(ui().failed);
  }

  // Native dialog events

  launcher.addEventListener('click', () => openDialog());
  $('ash-close').addEventListener('click', () => dialog.close());

  dialog.addEventListener('close', () => {
    status.textContent = '';
    launcher.focus();
    if (!backPending && window.history.state?.ashOpen) {
      backPending = true;
      window.history.back();
    }
  });

  window.addEventListener('popstate', (event) => {
    if (backPending) {
      backPending = false;
      if (dialog.open) window.history.pushState({ ashOpen: true }, '');
      return;
    }
    if (event.state?.ashOpen) openDialog({ push: false });
    else if (dialog.open) dialog.close();
  });

  // A page restored from the back/forward cache must also forget the chat.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    resetConversation();
    if (dialog.open) dialog.close();
  });

  // Controls

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-lang]');
    if (button) setLanguage(button.dataset.lang);
  });

  topicsEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-answer-id]');
    if (!button || state.availability !== 'ready') return;
    const id = button.dataset.answerId;
    addTurn({ topic: id, answerId: id });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (state.availability !== 'ready') return;
    const question = input.value.trim();
    if (!question) {
      setHint(ui().emptyQuestion);
      announce(ui().emptyQuestion);
      input.focus();
      return;
    }
    const match = matchQuestion(question, state.catalogue.index);
    input.value = '';
    setHint('');
    addTurn({ question, questionLang: match.lang ?? state.lang, answerId: match.id });
    input.focus({ preventScroll: true });
  });

  input.addEventListener('input', () => {
    if (hint.textContent) setHint('');
  });

  $('ash-clear').addEventListener('click', () => {
    resetConversation();
    announce(ui().cleared);
  });

  retry.addEventListener('click', async () => {
    if (state.availability === 'loading') return;
    const ok = await loadCatalogue();
    if (ok && dialog.open) input.focus();
    else if (dialog.open) retry.focus();
  });

  // Start up

  // A reload keeps history.state, so drop the open flag and start closed.
  if (window.history.state?.ashOpen) window.history.replaceState(null, '');
  input.value = '';

  if (typeof dialog.showModal !== 'function') {
    state.availability = 'unsupported';
    renderLanguage();
    return;
  }

  renderLanguage();
  launcher.hidden = false;
  loadCatalogue();
}

if (typeof document !== 'undefined') init();
