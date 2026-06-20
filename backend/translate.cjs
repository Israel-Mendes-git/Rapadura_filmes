// =====================================================================
//  Serviço de tradução automática de conteúdo dinâmico do catálogo.
//
//  Traduz campos de texto (sinopse/overview, tagline, descricao) do PT para
//  en/es/zh usando um provider externo configurável, com CACHE persistente na
//  tabela `translations`. Degradação graciosa: qualquer falha/timeout do
//  provider retorna null e o chamador faz fallback para o texto PT original.
//
//  Config por ambiente (PROD não precisa mudar nada para funcionar no default):
//    TRANSLATE_PROVIDER  'mymemory' (default, grátis, sem chave) | 'deepl' | 'libre' | 'off'
//    TRANSLATE_API_KEY   chave do provider (deepl/libre/google)
//    TRANSLATE_URL       endpoint base (libre self-host); opcional p/ deepl
//    TRANSLATE_EMAIL     e-mail opcional p/ aumentar a cota anônima do MyMemory
// =====================================================================
const crypto = require('crypto');

const LANGS = ['en', 'es', 'zh'];                 // idiomas-alvo (espelha o i18n, menos pt)
const SUPPORTED = new Set(['pt', ...LANGS]);
const SOURCE = 'pt';
const PROVIDER = (process.env.TRANSLATE_PROVIDER || 'mymemory').toLowerCase();
const TIMEOUT_MS = Number(process.env.TRANSLATE_TIMEOUT_MS || 8000);

function sourceHash(text) {
  return crypto.createHash('sha256').update(text || '', 'utf8').digest('hex');
}

// Resolve o idioma efetivo de um request: ?lang= tem prioridade, depois
// Accept-Language; só aceita idiomas suportados, default 'pt'.
function resolveLang(req) {
  const q = String(req.query.lang || '').toLowerCase().slice(0, 2);
  if (SUPPORTED.has(q)) return q;
  const al = String(req.headers['accept-language'] || '').toLowerCase().slice(0, 2);
  if (SUPPORTED.has(al)) return al;
  return SOURCE;
}

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// --- Providers: cada um recebe (text, targetLang) e devolve string | null ---
async function viaMyMemory(text, target) {
  const pair = `${SOURCE}|${target === 'zh' ? 'zh-CN' : target}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`
    + (process.env.TRANSLATE_EMAIL ? `&de=${encodeURIComponent(process.env.TRANSLATE_EMAIL)}` : '');
  const r = await fetchWithTimeout(url);
  if (!r.ok) throw new Error(`MyMemory HTTP ${r.status}`);
  const j = await r.json();
  const out = j && j.responseData && j.responseData.translatedText;
  if (!out || /^(MYMEMORY WARNING|INVALID|PLEASE )/i.test(out)) {
    throw new Error(`MyMemory resposta inválida: ${String(out).slice(0, 60)}`);
  }
  return out;
}

async function viaDeepL(text, target) {
  const key = process.env.TRANSLATE_API_KEY;
  if (!key) throw new Error('DeepL requer TRANSLATE_API_KEY');
  const base = process.env.TRANSLATE_URL
    || (key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com');
  const body = new URLSearchParams({
    text, source_lang: SOURCE.toUpperCase(), target_lang: target.toUpperCase(),
  });
  const r = await fetchWithTimeout(`${base}/v2/translate`, {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!r.ok) throw new Error(`DeepL HTTP ${r.status}`);
  const j = await r.json();
  const out = j && j.translations && j.translations[0] && j.translations[0].text;
  if (!out) throw new Error('DeepL resposta vazia');
  return out;
}

async function viaLibre(text, target) {
  const base = process.env.TRANSLATE_URL || 'https://libretranslate.com';
  const r = await fetchWithTimeout(`${base}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text, source: SOURCE, target, format: 'text',
      ...(process.env.TRANSLATE_API_KEY ? { api_key: process.env.TRANSLATE_API_KEY } : {}),
    }),
  });
  if (!r.ok) throw new Error(`LibreTranslate HTTP ${r.status}`);
  const j = await r.json();
  if (!j || !j.translatedText) throw new Error('LibreTranslate resposta vazia');
  return j.translatedText;
}

const PROVIDERS = { mymemory: viaMyMemory, deepl: viaDeepL, libre: viaLibre };

const CJK = /[㐀-鿿豈-﫿]/;   // ideogramas Han (zh)

// Guard de qualidade: rejeita resultados claramente inválidos para não gravar
// lixo no cache (ex.: MyMemory devolvendo "Test" para zh, ou ecoando o PT).
// Retornar false faz o chamador cair no fallback (texto original em PT).
function isValidTranslation(text, target, source) {
  if (!text || !String(text).trim()) return false;
  const out = String(text).trim();
  // alvo chinês precisa conter ao menos um ideograma
  if (target === 'zh' && !CJK.test(out)) return false;
  // eco da fonte (não traduziu) — só rejeita se a fonte tinha tamanho relevante
  if (source && String(source).trim().length > 3
      && out.toLowerCase() === String(source).trim().toLowerCase()) return false;
  return true;
}

// Traduz um texto; retorna null (sem lançar) em qualquer falha/validação — o
// chamador decide o fallback. 'off' desliga a tradução por completo.
async function translateText(text, target) {
  if (PROVIDER === 'off') return null;
  if (!text || !String(text).trim()) return null;
  const fn = PROVIDERS[PROVIDER];
  if (!fn) {
    console.error(`[translate] provider desconhecido: ${PROVIDER}`);
    return null;
  }
  try {
    const out = await fn(String(text), target);
    if (!isValidTranslation(out, target, text)) {
      console.error(`[translate] resultado inválido (${PROVIDER} → ${target}) descartado: "${String(out).slice(0, 40)}"`);
      return null;
    }
    return out;
  } catch (e) {
    console.error(`[translate] falha (${PROVIDER} → ${target}): ${e.message}`);
    return null;
  }
}

// Factory que liga o serviço ao banco (better-sqlite3, síncrono).
module.exports = function createTranslator(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS translations (
      entity_type TEXT NOT NULL,        -- 'movie' | 'game'
      entity_id   INTEGER NOT NULL,
      field       TEXT NOT NULL,        -- 'overview' | 'tagline'
      lang        TEXT NOT NULL,        -- 'en' | 'es' | 'zh'
      text        TEXT NOT NULL,
      source_hash TEXT NOT NULL,        -- sha256 do texto-fonte PT (invalidação)
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (entity_type, entity_id, field, lang)
    );
  `);

  const selStmt = db.prepare(
    'SELECT text, source_hash FROM translations WHERE entity_type=? AND entity_id=? AND field=? AND lang=?'
  );
  const upsertStmt = db.prepare(`
    INSERT INTO translations (entity_type, entity_id, field, lang, text, source_hash, updated_at)
    VALUES (@entity_type, @entity_id, @field, @lang, @text, @source_hash, CURRENT_TIMESTAMP)
    ON CONFLICT(entity_type, entity_id, field, lang)
    DO UPDATE SET text=@text, source_hash=@source_hash, updated_at=CURRENT_TIMESTAMP
  `);

  // Leitura síncrona do cache; só retorna se o hash do fonte ainda bate (não
  // serve tradução obsoleta de um texto que já mudou).
  function getCached(entityType, id, field, lang, sourceText) {
    if (!sourceText || lang === SOURCE) return null;
    const row = selStmt.get(entityType, id, field, lang);
    if (row && row.source_hash === sourceHash(sourceText)) return row.text;
    return null;
  }

  // Traduz (best-effort) os campos de uma entidade para todos os LANGS,
  // pulando o que já está em cache com o mesmo hash. Assíncrono e tolerante a
  // falha: nunca lança para o chamador.
  async function translateEntity(entityType, id, fields) {
    for (const { field, text } of fields) {
      const src = text == null ? '' : String(text);
      if (!src.trim()) continue;
      const hash = sourceHash(src);
      for (const lang of LANGS) {
        const existing = selStmt.get(entityType, id, field, lang);
        if (existing && existing.source_hash === hash) continue; // já em cache e atual
        const translated = await translateText(src, lang);
        if (translated) {
          upsertStmt.run({ entity_type: entityType, entity_id: id, field, lang, text: translated, source_hash: hash });
        }
      }
    }
  }

  // Dispara translateEntity em background, logando erros sem afetar a resposta.
  function translateEntityInBackground(entityType, id, fields) {
    Promise.resolve()
      .then(() => translateEntity(entityType, id, fields))
      .catch((e) => console.error(`[translate] erro inesperado (${entityType}#${id}): ${e.message}`));
  }

  // Varre o catálogo existente e traduz o que ainda não tem cache. Throttled
  // para não estourar a cota do provider. Roda em background no startup.
  async function backfillAll() {
    if (PROVIDER === 'off') return;
    try {
      const movies = db.prepare("SELECT id, sinopse, tagline FROM movies WHERE fonte='proprio'").all();
      for (const m of movies) {
        await translateEntity('movie', m.id, [
          { field: 'overview', text: m.sinopse },
          { field: 'tagline', text: m.tagline },
        ]);
      }
      const games = db.prepare('SELECT id, descricao FROM games').all();
      for (const g of games) {
        await translateEntity('game', g.id, [{ field: 'overview', text: g.descricao }]);
      }
      console.log(`[translate] backfill concluído (${movies.length} filmes, ${games.length} jogos)`);
    } catch (e) {
      console.error(`[translate] backfill falhou: ${e.message}`);
    }
  }

  return { LANGS, resolveLang, getCached, translateEntity, translateEntityInBackground, backfillAll };
};
