import { loadTurnstile } from './turnstile.js';

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

const NEEDS_LABELS = {
  en: {
    website: 'A custom website (from US$2,500)',
    'website-ai': 'Website + dedicated AI assistant (from US$4,000 + US$95/mo)',
    video: 'AI video ads & films (from US$450)',
    both: 'Both website and AI video',
    unsure: 'Not sure yet',
  },
  fr: {
    website: 'Un site web sur mesure (à partir de 2 500 USD)',
    'website-ai': 'Site web + assistant IA dédié (à partir de 4 000 USD + 95 USD/mois)',
    video: 'Publicités et films vidéo IA (à partir de 450 USD)',
    both: 'Site web et vidéo IA',
    unsure: 'Je ne sais pas encore',
  },
};

const UI = {
  en: {
    fabTitle: 'Ask Ash',
    fabSub: 'AI studio assistant',
    dialogTitle: 'Ask Ash',
    close: 'Close',
    dialogNote: 'Studio26’s AI assistant. Answers come from the studio’s published pages.',
    transcriptLabel: 'Conversation',
    intro:
      'Hi, I’m Ash. What would you like to make? Ask me about our websites, AI assistants, AI video ads or prices, or send a project brief to Ruben and the team.',
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
      'Ash’s answers could not be loaded right now. You can send a project brief or write to hello@studio26.me.',
    unsupported:
      'This browser cannot open Ash’s conversation window. You can write to hello@studio26.me.',
    emailLink: 'Email the studio (opens your mail app)',
    briefOpen: 'Send a project brief',
    briefTitle: 'Send a project brief to Ruben',
    briefLede: 'Fill in your details below. You will review everything before it is sent.',
    briefReviewTitle: 'Review your project brief',
    briefReviewLede: 'Please check these details. Nothing is sent until you confirm.',
    nameLabel: 'Your name (required)',
    emailLabel: 'Your email (required)',
    companyLabel: 'Company (optional)',
    needLabel: 'What do you need? (required)',
    needChoose: 'Choose one',
    messageLabel: 'About the project (required)',
    reviewBtn: 'Review brief',
    backToChatBtn: 'Back to chat',
    confirmSendBtn: 'Confirm & send to Ruben',
    sendingBtn: 'Sending brief...',
    editBriefBtn: 'Edit brief',
    privacyNote: 'Handled under the Mauritius Data Protection Act 2017. Read our ',
    privacyLink: 'privacy notice',
    errName: 'Please enter your name.',
    errEmail: 'Please enter a valid email address.',
    errNeed: 'Please choose what you need.',
    errMessage: 'Please tell us a little about your project.',
    errSend: 'We could not send your brief right now. Please try again or email hello@studio26.me.',
    sentTurnVisitor: 'Sent project brief',
    sentTurnAsh:
      'Thank you, {name}. Your project brief ({need}) has been sent to Ruben and the team. We will reply to {email} by email.',
    source: 'Source',
    newTab: 'opens in a new tab',
    emptyQuestion: 'Type a question first, or choose a topic.',
    cleared: 'Conversation cleared.',
    languageChanged: 'Language set to English.',
  },
  fr: {
    fabTitle: 'Demander à Ash',
    fabSub: 'Assistante IA du studio',
    dialogTitle: 'Demander à Ash',
    close: 'Fermer',
    dialogNote: 'L’assistante IA de Studio26. Les réponses proviennent des pages publiées par le studio.',
    transcriptLabel: 'Conversation',
    intro:
      'Bonjour, je suis Ash. Quel projet avez-vous en tête ? Posez-moi vos questions sur nos sites web, assistants IA, vidéos IA et tarifs, ou envoyez un brief à Ruben et à son équipe.',
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
      'Les réponses d’Ash n’ont pas pu être chargées pour le moment. Vous pouvez envoyer un brief ou écrire à hello@studio26.me.',
    unsupported:
      'Ce navigateur ne peut pas ouvrir la fenêtre de conversation d’Ash. Vous pouvez écrire à hello@studio26.me.',
    emailLink: 'Écrire au studio (ouvre votre messagerie)',
    briefOpen: 'Envoyer un brief',
    briefTitle: 'Envoyer un brief à Ruben',
    briefLede: 'Renseignez vos informations ci-dessous. Vous pourrez tout relire avant l’envoi.',
    briefReviewTitle: 'Vérifiez votre brief',
    briefReviewLede: 'Merci de vérifier ces informations. Rien n’est envoyé avant votre confirmation.',
    nameLabel: 'Votre nom (obligatoire)',
    emailLabel: 'Votre e-mail (obligatoire)',
    companyLabel: 'Entreprise (facultatif)',
    needLabel: 'De quoi avez-vous besoin ? (obligatoire)',
    needChoose: 'Choisissez une option',
    messageLabel: 'À propos du projet (obligatoire)',
    reviewBtn: 'Vérifier le brief',
    backToChatBtn: 'Retour au chat',
    confirmSendBtn: 'Confirmer et envoyer à Ruben',
    sendingBtn: 'Envoi en cours...',
    editBriefBtn: 'Modifier le brief',
    privacyNote: 'Traité conformément au Data Protection Act 2017 de Maurice. Consultez notre ',
    privacyLink: 'politique de confidentialité',
    errName: 'Veuillez indiquer votre nom.',
    errEmail: 'Veuillez saisir une adresse e-mail valide.',
    errNeed: 'Veuillez choisir ce dont vous avez besoin.',
    errMessage: 'Veuillez décrire brièvement votre projet.',
    errSend: 'Votre brief n’a pas pu être envoyé pour le moment. Veuillez réessayer ou écrire à hello@studio26.me.',
    sentTurnVisitor: 'Brief de projet envoyé',
    sentTurnAsh:
      'Merci, {name}. Votre brief ({need}) a bien été transmis à Ruben et à son équipe. Nous vous répondrons par e-mail à {email}.',
    source: 'Source',
    newTab: 's’ouvre dans un nouvel onglet',
    emptyQuestion: 'Saisissez d’abord une question ou choisissez un sujet.',
    cleared: 'Conversation effacée.',
    languageChanged: 'Langue définie sur le français.',
  },
};

// Whole-token signals only. These choose which safe fallback is shown when no
// curated alias matched; they can never produce a substantive answer.
const COMMITMENT_SIGNAL =
  /\b(?:deadlines?|deliver(?:ed|y)?|guarantee[ds]?|promise|commit(?:ment)?|availability|available|booking|book|reserve|discount|refund|contract|timeline|turnaround|echeance|delais?|livrer|livrez|livrerez|livraison|garantir|garantie|garantissez|promettre|promesse|engagement|engager|disponibles?|disponibilite|reserver|reservation|remise|reduction|remboursement|contrat)\b/u;
const TIMING_SIGNAL =
  /\b(?:today|tomorrow|tonight|asap|urgently?|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekend|january|february|march|april|june|july|august|september|october|november|december|when|how long|(?:next|this) (?:week|month)|aujourd hui|demain|urgence|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre|quand|combien de temps|semaine prochaine|mois prochain|cette semaine|ce mois)\b/u;
const PROJECT_SIGNAL =
  /\b(?:studio26|project|projet|brief|websites?|site web|sites web|chatbots?|ai assistants?|assistants? ia|video|videos|film|films|launch|lancement|mise en ligne)\b/u;
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
    .trim()
    // Common English contractions and compound spellings.
    .replace(/\b(what|who|where|how) s\b/gu, '$1 is')
    .replace(/\bweb sites\b/gu, 'websites')
    .replace(/\bweb site\b/gu, 'website')
    .replace(/\bchat bots\b/gu, 'chatbots')
    .replace(/\bchat bot\b/gu, 'chatbot')
    .replace(/\be mail\b/gu, 'email')
    .replace(/\b(existing|current) site\b/gu, '$1 website')
    .replace(/\bfrench and english\b/gu, 'english and french')
    .replace(/\banglais et francais\b/gu, 'francais et anglais')
    // Indirect question word order after “Can you tell me…” / “I’d like to know…”.
    .replace(/\bhow much (a|an|the|your) ([a-z0-9 ]+?) costs$/gu, 'how much does $1 $2 cost')
    .replace(/\bhow much (a|an|the|your) ([a-z0-9 ]+?) is$/gu, 'how much is $1 $2')
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
  return COMMITMENT_SIGNAL.test(normalized) ||
    (TIMING_SIGNAL.test(normalized) && PROJECT_SIGNAL.test(normalized));
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
const NEGATION_OR_OOS =
  /\b(?:no|not|dont|do not|never|without|instead|lend|loan|fund|money|bank|insurance|assurance|crypto|bitcoin|job|jobs|hiring|internship|stage|emploi|recrutement|ne|pas|jamais|aucun|sans)\b/u;
const FR_SIGNAL =
  /\b(?:le|la|les|un|une|des|du|vous|votre|vos|quel|quelle|quels|quelles|combien|ou|qui|que|quoi|est|sont|faites|creez|proposez|pouvez|puis|site|sites|tarif|tarifs|prix|video|videos|entreprise|entreprises|maurice|roupies|francais|confidentialite|accessibilite|delai|forfait|forfaits|droits|equipe)\b/u;
const EN_SIGNAL =
  /\b(?:the|do|you|your|what|where|who|how|can|are|is|for|with|website|websites|chatbot|chatbots|video|videos|price|prices|pricing|cost|costs|business|businesses|company|companies|location|located|based|offer|create|build|make|develop)\b/u;

function detectLang(q) {
  const fr = FR_SIGNAL.test(q);
  const en = EN_SIGNAL.test(q);
  if (fr && !en) return 'fr';
  if (en && !fr) return 'en';
  return null;
}

/**
 * Deterministic Tier-2 intent classifier for natural phrasings that wrap
 * published Studio26 topics (e.g. "Do you create websites for businesses?",
 * "Where is the location of Studio26?", "Tell me about AI videos").
 * Never fires on negated, out-of-scope or commitment-bearing queries.
 */
function matchIntent(q) {
  if (NEGATION_OR_OOS.test(q)) return null;
  const lang = detectLang(q);
  const hasPrice =
    /\b(?:price|prices|pricing|cost|costs|rate|rates|how much|charge|fee|fees|budget|tarif|tarifs|prix|cout|coute|coutent|combien|facturez)\b/u.test(q);
  const hasVideo =
    /\b(?:video|videos|reel|reels|tiktok|shorts|youtube|film|films|documentary|documentaries|spot|spots|pub|pubs|publicite|publicites|documentaire)\b/u.test(q);
  const hasChatbot =
    /\b(?:chatbot|chatbots|ai assistant|ai assistants|virtual assistant|assistant ia|assistants ia|assistant virtuel|agent ia)\b/u.test(q);
  const hasWebsite =
    /\b(?:website|websites|web design|web development|webpage|site|sites|site web|sites web|site internet|sites internet)\b/u.test(q);

  if (/\b(?:contact|email|reach|talk to|speak to|write to|get in touch|contacter|joindre|ecrire|parler a|coordonnees|courriel)\b/u.test(q)) {
    return { id: 'contact', lang };
  }
  if (
    /\b(?:where|location|located|based|country|office|offices|address|headquarters|situated|ou|localisation|situe|situes|base|bases|adresse|bureau|bureaux|pays)\b/u.test(q) &&
    /\b(?:studio26|studio|you|your|team|company|office|offices|location|localisation|vous|votre|equipe|bureau|bureaux)\b/u.test(q)
  ) {
    return { id: 'location', lang };
  }
  if (/\b(?:privacy|private|cookie|cookies|tracker|trackers|tracking|dpa|data protection|personal data|confidentialite|prive|privee|traceur|traceurs|donnees personnelles|protection des donnees)\b/u.test(q)) {
    return { id: 'privacy-data', lang };
  }
  if (/\b(?:accessibility|accessible|wcag|screen reader|contrast|accessibilite|accessibles)\b/u.test(q)) {
    return { id: 'accessibility', lang };
  }
  if (
    !(hasPrice && (hasWebsite || hasChatbot || hasVideo)) &&
    /\b(?:currency|currencies|mur|rupees?|usd|dollars?|devises?|roupies?)\b/u.test(q) &&
    /\b(?:your (?:prices|rates|quotes)|vos (?:prix|tarifs|devis)|(?:pay|invoice|bill|quote)(?: you| us| me)? in|(?:payer|facturer|facturez|regler) en)\b/u.test(q)
  ) {
    return { id: 'currency', lang };
  }
  if (/\b(?:french|bilingual|language|languages|francais|bilingue|langue|langues)\b/u.test(q)) {
    return { id: 'languages', lang };
  }
  if (/\b(?:concept|concepts|fictional|maree|volume|zest|maison filaos|filaos|kestrel|fictif|fictifs)\b/u.test(q)) {
    return { id: 'concepts', lang };
  }
  if (/\b(?:portfolio|past clients|past work|selected work|examples of your work|arizen|diaspora|mauradio|nextalent|awi|realisations|anciens clients)\b/u.test(q)) {
    return { id: 'work-clients', lang };
  }
  if (
    /\b(?:who|qui)\b/u.test(q) &&
    /\b(?:build|builds|building|develop|develops|developing|create|creates|make|makes|cree|creer|developpe|developper|construit)\b/u.test(q) &&
    (hasChatbot || hasWebsite)
  ) {
    return { id: 'chatbot-builder', lang };
  }
  if (/\b(?:ruben|ramdhony|founder|owner|atelier|juniors|fondateur|equipe|team)\b/u.test(q) && !hasWebsite && !hasChatbot && !hasVideo) {
    return { id: 'team', lang };
  }

  if (hasVideo && hasWebsite && !hasChatbot) {
    return { id: hasPrice ? 'pricing' : 'services', lang };
  }
  if (hasVideo) {
    if (/\b(?:right|rights|own|ownership|licence|license|commercial|broadcast|tv|television|cinema|droit|droits|licence|proprietaire|diffusion)\b/u.test(q)) {
      return { id: 'video-rights', lang };
    }
    if (/\b(?:format|formats|ratio|ratios|size|sizes|vertical|horizontal|landscape|portrait|9 16|4 5|16 9|dimension|dimensions|paysage)\b/u.test(q)) {
      return { id: 'video-formats', lang };
    }
    if (/\b(?:template|templates|on brand|colours|colors|logo|gabarit|charte)\b/u.test(q)) {
      return { id: 'video-template', lang };
    }
    if (/\b(?:revision|revisions|change|changes|round|rounds|modification|modifications|retouche|retouches)\b/u.test(q)) {
      return { id: 'video-revisions', lang };
    }
    if (/\b(?:cancel|cancellation|pause|switch|rolling|lock in|minimum|resilier|resiliation|annuler|suspendre|sans engagement)\b/u.test(q)) {
      return { id: 'video-flexibility', lang };
    }
    if (/\b(?:turnaround|how fast|how quickly|working days|5 to 7|five to seven|combien de jours|en combien de temps|rapidement)\b/u.test(q)) {
      return { id: 'video-turnaround', lang };
    }
    if (/\b(?:starter|growth|always on|compare|difference|tier|tiers|750|1350|1 350|2400|2 400|comparer|formule|formules)\b/u.test(q)) {
      return { id: 'video-plans-compare', lang };
    }
    if (/\b(?:oneoff|one off|single|just one|1 video|450|ponctuel|ponctuelle|une seule|unique)\b/u.test(q)) {
      return { id: 'video-one-off', lang };
    }
    if (/\b(?:documentary|documentaries|longer|long film|brand film|explainer|egypt|ancient egypt|chronicles|documentaire|film long|film de marque|explicative|egypte)\b/u.test(q)) {
      return { id: 'video-films', lang };
    }
    if (/\b(?:fake|robotic|generic|3d|hand|craft|quality|artificiel|robotique|qualite|montage)\b/u.test(q)) {
      return { id: 'video-craft', lang };
    }
    return { id: hasPrice ? 'video-rates' : 'ai-video', lang };
  }

  if (hasChatbot) {
    if (/\b(?:95|monthly|per month|a month|maintenance|1000|1 000|api key|api keys|token|tokens|mensuel|par mois|cle api|cles api)\b/u.test(q)) {
      return { id: 'website-ai-monthly', lang };
    }
    if (/\b(?:existing|current|already have|standalone|only the chatbot|just a chatbot|existant|actuel|deja un site|uniquement le chatbot|ajouter un chatbot)\b/u.test(q)) {
      return { id: 'chatbot-standalone', lang };
    }
    return { id: 'website-ai', lang };
  }

  if (hasWebsite) {
    if (/\b(?:wordpress|wix|squarespace|shopify|webflow|template|templates|theme|themes|scratch|hand built|hand coded|cloudflare|hosting|hosted|heberge|hebergement|zero)\b/u.test(q)) {
      return { id: 'website-custom', lang };
    }
    return { id: 'website', lang };
  }

  if (/\b(?:process|how do you work|how does it work|steps|get started|start a project|discovery call|processus|methode|comment travaillez|comment ca marche|etapes|commencer|demarrer|appel de decouverte)\b/u.test(q)) {
    return { id: 'process', lang };
  }
  if (/\b(?:service|services|what do you offer|what do you do|what can you build|specialize|specialise|prestation|prestations|que proposez vous|que faites vous)\b/u.test(q)) {
    return { id: 'services', lang };
  }
  if (/\b(?:about studio26|what is studio26|who is studio26|tell me about studio26|a propos de studio26|qu est ce que studio26)\b/u.test(q)) {
    return { id: 'about', lang };
  }
  return null;
}

export function matchQuestion(raw, index) {
  const normalized = normalizeQuery(raw);
  if (!normalized || String(raw).length > MAX_QUESTION_LENGTH) {
    return { id: FALLBACK_UNKNOWN, lang: null };
  }
  // Greetings and courtesies may wrap a known whole question in either language.
  // Never discard a substantive clause to manufacture a match.
  const core = normalized
    .replace(/^(?:(?:hello|hi|hey|good morning|good afternoon|good evening|bonjour|bonsoir|salut|coucou)(?: ash| studio26| there| team)?|ash|please|svp|s il vous plait|s il te plait) /u, '')
    .replace(/^(?:can you tell me|could you tell me|i would like to know|i d like to know|i want to know|pouvez vous me dire|peux tu me dire|est ce que vous pouvez me dire|est ce que tu peux me dire|je voudrais savoir|j aimerais savoir|je veux savoir|dis moi|dites moi) /u, '')
    .replace(/ (?:please|thanks|thank you|thank you very much|merci|merci beaucoup|s il vous plait|s il te plait|svp|ash)$/u, '');
  const entry = index.get(normalized) ?? index.get(core);
  if (entry) {
    const id = entry.ids.size === 1 ? [...entry.ids][0] : FALLBACK_AMBIGUOUS;
    return { id, lang: entry.lang };
  }
  if (hasCommitmentSignal(normalized)) return { id: FALLBACK_COMMITMENT, lang: null };
  if (isMultipleIntent(raw, index)) return { id: FALLBACK_AMBIGUOUS, lang: null };
  const intent = matchIntent(core);
  if (intent) return intent;
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
  return typeof value === 'string' && value.trim() !== '' && !/\{\{|\}\}|—/u.test(value);
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
  if (!dialog || !launcher) return;
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
  const briefPanel = $('ash-brief-panel');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const state = {
    lang: 'en',
    availability: 'loading',
    catalogue: null,
    turns: [],
    briefStep: 'closed', // 'closed' | 'draft' | 'review' | 'sending'
    briefDraft: { name: '', email: '', company: '', need: '', message: '', idempotencyKey: '' },
    briefError: '',
  };
  let announceTimer = 0;
  let backPending = false;
  let lastTrigger = launcher;

  const ui = () => UI[state.lang];

  function announce(message) {
    const target = dialog.open ? status : pageStatus;
    if (!target) return;
    window.clearTimeout(announceTimer);
    if (status) status.textContent = '';
    if (pageStatus) pageStatus.textContent = '';
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

  function briefTriggerButton() {
    const btn = element('button', 'ash-action ash-action-btn', ui().briefOpen);
    btn.type = 'button';
    btn.dataset.ashBriefOpen = 'true';
    return btn;
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
    if (turn.type === 'brief') {
      item.append(element('p', 'ash-text', `${ui().sentTurnVisitor}: ${turn.name} (${NEEDS_LABELS[state.lang][turn.need] || turn.need})`));
    } else if (turn.topic) {
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

  function answerTurn(turn) {
    if (turn.type === 'brief') {
      const msg = ui().sentTurnAsh
        .replace('{name}', turn.name)
        .replace('{need}', NEEDS_LABELS[state.lang][turn.need] || turn.need)
        .replace('{email}', turn.email);
      return ashTurn(msg, []);
    }
    const id = turn.answerId;
    const answer = state.catalogue.answers.get(id);
    const links = [];
    if (answer.handoff || id === 'contact') {
      links.push(briefTriggerButton(), emailLink());
    }
    if (!id.startsWith('fallback-')) links.push(sourceLink(answer.source));
    return ashTurn(answer[state.lang].text, links);
  }

  function renderTurns() {
    const nodes = [ashTurn(ui().intro, [briefTriggerButton()])];
    let latestVisitorNode = null;
    if (state.catalogue) {
      for (const turn of state.turns) {
        latestVisitorNode = visitorTurn(turn);
        nodes.push(latestVisitorNode, answerTurn(turn));
      }
    }
    turnsEl.replaceChildren(...nodes);
    return latestVisitorNode;
  }

  let briefWidget = null;
  function renderBriefPanel() {
    if (!briefPanel) return;
    if (briefWidget !== null) {
      window.turnstile.remove(briefWidget);
      briefWidget = null;
    }
    if (state.briefStep === 'closed') {
      briefPanel.hidden = true;
      briefPanel.replaceChildren();
      return;
    }
    briefPanel.hidden = false;
    const d = state.briefDraft;
    if (state.briefStep === 'draft') {
      const title = element('h3', 'ash-brief-title', ui().briefTitle);
      title.id = 'ash-brief-heading';
      title.tabIndex = -1;
      const lede = element('p', 'ash-brief-lede', ui().briefLede);
      const fields = element('div', 'ash-brief-fields');

      const makeInputField = (id, labelText, type, key, required, auto) => {
        const wrap = element('div', 'ash-brief-field');
        const label = element('label', '', labelText);
        label.htmlFor = id;
        const inp = element('input');
        inp.id = id;
        inp.type = type;
        inp.value = d[key];
        inp.maxLength = key === 'email' ? 200 : 120;
        if (required) inp.required = true;
        if (auto) inp.autocomplete = auto;
        const err = element('p', 'ash-field-error');
        err.id = `${id}-err`;
        err.hidden = true;
        inp.setAttribute('aria-describedby', err.id);
        inp.addEventListener('input', () => {
          d[key] = inp.value;
          inp.removeAttribute('aria-invalid');
          err.hidden = true;
          err.textContent = '';
        });
        wrap.append(label, inp, err);
        return { wrap, inp, err };
      };

      const fName = makeInputField('ash-b-name', ui().nameLabel, 'text', 'name', true, 'name');
      const fEmail = makeInputField('ash-b-email', ui().emailLabel, 'email', 'email', true, 'email');
      const fCompany = makeInputField('ash-b-company', ui().companyLabel, 'text', 'company', false, 'organization');

      const needWrap = element('div', 'ash-brief-field');
      const needLabel = element('label', '', ui().needLabel);
      needLabel.htmlFor = 'ash-b-need';
      const needSelect = element('select');
      needSelect.id = 'ash-b-need';
      needSelect.required = true;
      const optEmpty = element('option', '', ui().needChoose);
      optEmpty.value = '';
      needSelect.append(optEmpty);
      for (const [val, text] of Object.entries(NEEDS_LABELS[state.lang])) {
        const opt = element('option', '', text);
        opt.value = val;
        if (d.need === val) opt.selected = true;
        needSelect.append(opt);
      }
      const needErr = element('p', 'ash-field-error');
      needErr.id = 'ash-b-need-err';
      needErr.hidden = true;
      needSelect.setAttribute('aria-describedby', needErr.id);
      needSelect.addEventListener('change', () => {
        d.need = needSelect.value;
        needSelect.removeAttribute('aria-invalid');
        needErr.hidden = true;
        needErr.textContent = '';
      });
      needWrap.append(needLabel, needSelect, needErr);

      const msgWrap = element('div', 'ash-brief-field');
      const msgLabel = element('label', '', ui().messageLabel);
      msgLabel.htmlFor = 'ash-b-msg';
      const msgArea = element('textarea');
      msgArea.id = 'ash-b-msg';
      msgArea.required = true;
      msgArea.maxLength = 4000;
      msgArea.value = d.message;
      const msgErr = element('p', 'ash-field-error');
      msgErr.id = 'ash-b-msg-err';
      msgErr.hidden = true;
      msgArea.setAttribute('aria-describedby', msgErr.id);
      msgArea.addEventListener('input', () => {
        d.message = msgArea.value;
        msgArea.removeAttribute('aria-invalid');
        msgErr.hidden = true;
        msgErr.textContent = '';
      });
      msgWrap.append(msgLabel, msgArea, msgErr);

      fields.append(fName.wrap, fEmail.wrap, fCompany.wrap, needWrap, msgWrap);

      const actions = element('div', 'ash-brief-actions');
      const reviewBtn = element('button', 'ash-ask', ui().reviewBtn);
      reviewBtn.type = 'button';
      reviewBtn.id = 'ash-b-review';
      const cancelBtn = element('button', 'ash-secondary', ui().backToChatBtn);
      cancelBtn.type = 'button';
      cancelBtn.addEventListener('click', () => {
        state.briefStep = 'closed';
        renderBriefPanel();
        input.focus();
      });

      reviewBtn.addEventListener('click', () => {
        let firstInvalid = null;
        const setErr = (ctrl, errEl, msg) => {
          ctrl.setAttribute('aria-invalid', 'true');
          errEl.textContent = msg;
          errEl.hidden = false;
          if (!firstInvalid) firstInvalid = ctrl;
        };
        if (!d.name.trim()) setErr(fName.inp, fName.err, ui().errName);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) setErr(fEmail.inp, fEmail.err, ui().errEmail);
        if (!d.need) setErr(needSelect, needErr, ui().errNeed);
        if (!d.message.trim()) setErr(msgArea, msgErr, ui().errMessage);
        if (firstInvalid) {
          firstInvalid.focus();
          return;
        }
        if (!d.idempotencyKey) {
          const rand = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now());
          d.idempotencyKey = `ash_brief_${rand}`;
        }
        state.briefError = '';
        state.briefStep = 'review';
        renderBriefPanel();
        $('ash-b-confirm')?.focus();
      });

      actions.append(reviewBtn, cancelBtn);
      briefPanel.replaceChildren(title, lede, fields, actions);
      return;
    }

    // Step 2: Review & Confirm
    const title = element('h3', 'ash-brief-title', ui().briefReviewTitle);
    title.id = 'ash-brief-heading';
    title.tabIndex = -1;
    const lede = element('p', 'ash-brief-lede', ui().briefReviewLede);
    const dl = element('dl', 'ash-brief-summary');
    const addRow = (label, val) => {
      if (!val) return;
      const row = element('div');
      row.append(element('dt', '', label.replace(/ \(.*\)$/, '')), element('dd', '', val));
      dl.append(row);
    };
    addRow(ui().nameLabel, d.name.trim());
    addRow(ui().emailLabel, d.email.trim());
    if (d.company.trim()) addRow(ui().companyLabel, d.company.trim());
    addRow(ui().needLabel, NEEDS_LABELS[state.lang][d.need] || d.need);
    addRow(ui().messageLabel, d.message.trim());

    const priv = element('p', 'ash-brief-privacy', ui().privacyNote);
    const privLink = element('a', '', ui().privacyLink);
    privLink.href = '/privacy#collection';
    privLink.target = '_blank';
    privLink.rel = 'noopener noreferrer';
    priv.append(privLink, '.');

    const errBanner = element('p', 'ash-field-error', state.briefError);
    errBanner.role = 'alert';
    errBanner.hidden = !state.briefError;

    const actions = element('div', 'ash-brief-actions');
    const sending = state.briefStep === 'sending';
    const confirmBtn = element('button', 'ash-ask', sending ? ui().sendingBtn : ui().confirmSendBtn);
    confirmBtn.type = 'button';
    confirmBtn.id = 'ash-b-confirm';
    confirmBtn.disabled = true;
    const challenge = element('div', 'ash-brief-challenge');
    let token = '';
    if (!sending) {
      const sitekey = document.querySelector('script[src="/assets/contact-form.js"]')?.dataset.sitekey;
      const challengeFailed = () => {
        if (!challenge.isConnected) return;
        token = '';
        confirmBtn.disabled = true;
        errBanner.textContent = ui().errSend;
        errBanner.hidden = false;
      };
      loadTurnstile().then((turnstile) => {
        if (!challenge.isConnected) return;
        briefWidget = turnstile.render(challenge, {
          sitekey,
          action: 'ash_brief',
          language: state.lang,
          size: 'flexible',
          appearance: 'interaction-only',
          callback(value) {
            if (!challenge.isConnected) return;
            token = value;
            confirmBtn.disabled = false;
          },
          'expired-callback': () => {
            token = '';
            confirmBtn.disabled = true;
            if (challenge.isConnected && briefWidget !== null) turnstile.reset(briefWidget);
          },
          'error-callback': challengeFailed,
        });
      }).catch(challengeFailed);
    }
    const editBtn = element('button', 'ash-secondary', ui().editBriefBtn);
    editBtn.type = 'button';
    editBtn.disabled = sending;
    editBtn.addEventListener('click', () => {
      state.briefStep = 'draft';
      d.idempotencyKey = '';
      renderBriefPanel();
      $('ash-b-name')?.focus();
    });

    confirmBtn.addEventListener('click', async () => {
      if (!token || state.briefStep === 'sending') return;
      state.briefStep = 'sending';
      state.briefError = '';
      renderBriefPanel();
      try {
        const res = await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: d.name.trim(),
            email: d.email.trim(),
            company: d.company.trim(),
            need: d.need,
            message: d.message.trim(),
            idempotency_key: d.idempotencyKey,
            source: 'ash_brief',
            'cf-turnstile-response': token,
            hp_field: '',
          }),
        });
        const out = await res.json().catch(() => ({}));
        if (res.ok && out.ok) {
          const submitted = {
            type: 'brief',
            name: d.name.trim(),
            email: d.email.trim(),
            need: d.need,
          };
          state.briefStep = 'closed';
          state.briefDraft = { name: '', email: '', company: '', need: '', message: '', idempotencyKey: '' };
          renderBriefPanel();
          state.turns.push(submitted);
          if (state.turns.length > MAX_TURNS) state.turns.shift();
          const latest = renderTurns();
          latest?.nextElementSibling?.scrollIntoView({
            block: 'start',
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
          });
          input.focus();
          return;
        }
        state.briefStep = 'review';
        state.briefError = out.error || ui().errSend;
        renderBriefPanel();
      } catch {
        state.briefStep = 'review';
        state.briefError = ui().errSend;
        renderBriefPanel();
      }
    });

    actions.append(confirmBtn, editBtn);
    briefPanel.replaceChildren(title, lede, dl, priv, challenge, errBanner, actions);
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
    for (const button of topicsEl.children) {
      button.textContent = state.catalogue.answers.get(button.dataset.answerId)[state.lang].label;
    }
  }

  function renderAvailability() {
    const ready = state.availability === 'ready';
    const failed = state.availability === 'failed';
    input.disabled = !ready;
    askButton.disabled = !ready;
    failure.hidden = !failed;
    renderTopics();
  }

  function setHint(message) {
    hint.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function renderLanguage() {
    dialog.lang = state.lang;
    launcher.lang = state.lang;
    for (const node of document.querySelectorAll('[data-ash-i18n]')) {
      const key = node.dataset.ashI18n;
      if (ui()[key]) node.textContent = ui()[key];
    }
    for (const node of dialog.querySelectorAll('[data-i18n]')) {
      const key = node.dataset.i18n;
      if (ui()[key]) node.textContent = ui()[key];
    }
    for (const node of dialog.querySelectorAll('[data-i18n-aria]')) {
      const key = node.dataset.i18nAria;
      if (ui()[key]) node.setAttribute('aria-label', ui()[key]);
    }
    for (const button of dialog.querySelectorAll('[data-lang]')) {
      button.setAttribute('aria-pressed', String(button.dataset.lang === state.lang));
    }
    if (hint.textContent) setHint(ui().emptyQuestion);
    renderAvailability();
    renderTurns();
    renderBriefPanel();
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
    state.briefStep = 'closed';
    input.value = '';
    setHint('');
    renderTurns();
    renderBriefPanel();
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

  function openDialog({ push = true, trigger = launcher } = {}) {
    if (dialog.open) return;
    lastTrigger = trigger || launcher;
    dialog.showModal();
    if (push && !backPending) window.history.pushState({ ashOpen: true }, '');
    titleEl.focus();
    if (state.availability === 'failed') announce(ui().failed);
  }

  launcher.addEventListener('click', () => openDialog({ trigger: launcher }));
  for (const chatBtn of document.querySelectorAll('[data-chat]')) {
    chatBtn.hidden = false;
    chatBtn.addEventListener('click', () => openDialog({ trigger: chatBtn }));
  }

  $('ash-close').addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    status.textContent = '';
    const toFocus = lastTrigger || launcher;
    setTimeout(() => toFocus?.focus({ preventScroll: true }), 0);
    if (!backPending && window.history.state?.ashOpen) {
      backPending = true;
      window.history.back();
    }
  });

  window.addEventListener('popstate', (event) => {
    if (backPending) {
      backPending = false;
      if (dialog.open) window.history.pushState({ ashOpen: true }, '');
      else setTimeout(() => (lastTrigger || launcher)?.focus({ preventScroll: true }), 0);
      return;
    }
    if (event.state?.ashOpen) openDialog({ push: false });
    else if (dialog.open) dialog.close();
  });

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    resetConversation();
    if (dialog.open) dialog.close();
  });

  dialog.addEventListener('click', (event) => {
    const langBtn = event.target.closest?.('[data-lang]');
    if (langBtn) {
      setLanguage(langBtn.dataset.lang);
      return;
    }
    const briefBtn = event.target.closest?.('[data-ash-brief-open]');
    if (briefBtn) {
      state.briefStep = 'draft';
      state.briefDraft.idempotencyKey = '';
      renderBriefPanel();
      briefPanel.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      $('ash-b-name')?.focus();
    }
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

  if (window.history.state?.ashOpen) openDialog({ push: false });
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
