#!/usr/bin/env node
// =====================================================================
//  Backfill de traduções do catálogo JÁ EXISTENTE.
//
//  Traduz (en/es/zh) as descrições dos filmes/jogos já cadastrados e popula a
//  tabela `translations`. Idempotente: pula o que já está em cache com o mesmo
//  source_hash. Use para aplicar a tradução ao conteúdo antigo sem precisar
//  reabrir/salvar cada item no admin nem reiniciar o servidor.
//
//  Uso (no servidor, mesmas envs do backend):
//    node backend/scripts/backfill-translations.cjs
//    DB_PATH=/caminho/filmerama.db TRANSLATE_PROVIDER=deepl \
//      TRANSLATE_API_KEY=xxx node backend/scripts/backfill-translations.cjs
// =====================================================================
const path = require('path');
const Database = require('better-sqlite3');

// Mesma resolução de caminho do server.cjs (que roda a partir de backend/).
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'filmerama.db');

(async () => {
  console.log(`[backfill] banco: ${DB_PATH}`);
  console.log(`[backfill] provider: ${process.env.TRANSLATE_PROVIDER || 'mymemory (default)'}`);
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  const translator = require('../translate.cjs')(db);
  try {
    await translator.backfillAll();
    console.log('[backfill] OK');
    process.exit(0);
  } catch (e) {
    console.error('[backfill] FALHOU:', e.message);
    process.exit(1);
  } finally {
    db.close();
  }
})();
