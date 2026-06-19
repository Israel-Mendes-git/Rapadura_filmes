# Session: tradução automática das descrições dinâmicas do catálogo

**Date**: 2026-06-19
**Tier**: 3 — Full
**Specialist**: backend

## Task
"faça com que as traduções atinjam as descrições tbm" — esclarecido: além do
conteúdo curado (resolvido no ciclo Tier 2), traduzir também as descrições
**dinâmicas** cadastradas no admin (ex.: tagline "Uma amizade que ilumina").
Abordagem escolhida pelo usuário: **tradução automática via API + cache**.

## What Was Done
- Novo serviço `backend/translate.cjs`: tradução provider-agnóstica (default
  `mymemory` grátis; `deepl`/`libre`/`off` via env), com timeout e fallback null.
- Tabela `translations` (cache) criada por migração idempotente; invalidação por
  `source_hash` (sha256 do texto PT).
- `backend/server.cjs`:
  - `movieRowToCatalog(m, lang)` / `gameRowToCatalog(g, lang)` leem o cache.
  - `?lang=` resolvido (querystring → Accept-Language → `pt`) nas 4 rotas
    públicas de catálogo.
  - Tradução em background no save (POST/PUT de movies e games).
  - Backfill no boot (traduz catálogo existente sem cache).
- Frontend: interceptor em `src/services/api.js` injeta `?lang=<i18n.language>`;
  Home/Discover/Games/MovieDetails/GameDetails re-buscam ao trocar idioma.

## Decisions Made
- **Cache + tradução no save/backfill, leitura só do cache no GET**: evita N
  chamadas de rede por request nas listas; GET fica rápido; fallback PT seguro.
- **`source_hash` para invalidar**: tradução obsoleta de texto que mudou não é
  servida (re-traduzida no próximo save/backfill).
- **Tradução best-effort em background no save**: não bloqueia nem quebra a
  resposta do admin; erro é logado. Conteúdo novo pode aparecer em PT por
  segundos até o cache popular.
- **Provider via env, default grátis sem chave**: funciona out-of-the-box em
  dev/prod; DeepL recomendado em produção para qualidade (taglines poéticas).
- **Idioma via interceptor do axios (1 ponto)**: DRY; rotas não-catálogo ignoram
  o parâmetro. Re-fetch ao trocar idioma via `i18n.language` nas deps.

## Validation
- Boot end-to-end (DB temporário): seed PT → backfill → `GET ?lang=en/es`
  retornando traduções corretas; `?lang=pt` mantém o cru.
- `npm run build` OK; nenhum lint novo (os 3 erros restantes são pré-existentes:
  `otherMovies` unused em Home; `set-state-in-effect` em Movie/GameDetails).

## Modified Files
- `backend/translate.cjs` — novo serviço + cache
- `backend/server.cjs` — serializers com lang, ?lang= nas rotas, save+backfill
- `src/services/api.js` — interceptor de idioma
- `src/pages/{Home,Discover,Games,MovieDetails,GameDetails}.jsx` — re-fetch por idioma
- `docs/decisions/2026-06-19-traducao-automatica-catalogo.md` — ADR
- `docs/CHANGELOG.md` — entrada em [Unreleased]

## Config (produção)
Variáveis de ambiente do backend:
- `TRANSLATE_PROVIDER` = `mymemory` (default) | `deepl` | `libre` | `off`
- `TRANSLATE_API_KEY`  = chave (DeepL/Libre)
- `TRANSLATE_URL`      = endpoint base (Libre self-host; opcional DeepL)
- `TRANSLATE_EMAIL`    = e-mail p/ cota maior do MyMemory (opcional)
- `TRANSLATE_TIMEOUT_MS` = timeout por chamada (default 8000)
