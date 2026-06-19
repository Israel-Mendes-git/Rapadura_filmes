# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [Unreleased]

### Added
- **Tradução automática das descrições dinâmicas do catálogo** (sinopse/overview e tagline de filmes; descricao de jogos) para en/es/zh, com cache no banco. Serviço `backend/translate.cjs` (provider configurável por env: `mymemory` default grátis, `deepl`, `libre`, `off`), tabela `translations` (invalidação por `source_hash` do texto PT). Tradução acontece no save do admin (background) e via backfill no boot; rotas públicas `/api/catalog/*` leem só o cache via `?lang=` com fallback para PT. ADR: `docs/decisions/2026-06-19-traducao-automatica-catalogo.md`.
  - Arquivos afetados: `backend/translate.cjs` (novo), `backend/server.cjs` (serializers `movieRowToCatalog`/`gameRowToCatalog` com `lang`, `?lang=` nas 4 rotas públicas, tradução no save de movies/games, backfill no boot), `src/services/api.js` (interceptor injeta `?lang=`), `src/pages/Home.jsx`, `src/pages/Discover.jsx`, `src/pages/Games.jsx`, `src/pages/MovieDetails.jsx`, `src/pages/GameDetails.jsx` (re-fetch ao trocar idioma)
- Script `backend/scripts/backfill-translations.cjs` para traduzir sob demanda o catálogo **já existente** sem reiniciar o backend (idempotente; respeita `DB_PATH`/`TRANSLATE_*`). Ex.: `DB_PATH=/caminho/filmerama.db node backend/scripts/backfill-translations.cjs`.
  - Arquivos afetados: `backend/scripts/backfill-translations.cjs` (novo)
- Cobertura de i18n para as **descrições** de conteúdo curado: os `overview` dos itens de `customMovies.featured` (Sofia, Brawl Stars) agora são traduzidos nos 4 idiomas (pt/en/es/zh) via chaves `descriptions.*` em `i18n.js`, em vez de ficarem fixos em PT ao trocar de idioma.
  - Novo helper `resolveDescription(item, t)` em `src/utils/i18nContent.js` faz a ponte dados ↔ i18n: usa `item.overviewKey` quando existe e cai no `overview` cru (fallback seguro) para conteúdo dinâmico do backend ou chave ausente.
  - Pontos de render migrados para o helper: `HeroCarousel.jsx`, `Games.jsx`, `MovieDetails.jsx`, `GameDetails.jsx`.
  - Arquivos afetados: `src/i18n.js`, `src/data/customMovies.js`, `src/utils/i18nContent.js`, `src/components/HeroCarousel.jsx`, `src/pages/Games.jsx`, `src/pages/MovieDetails.jsx`, `src/pages/GameDetails.jsx`
- Rota pública de download de build para o launcher (Launcher L2): `GET /api/catalog/builds/:buildId/download` — espelha a rota admin (HTTP Range + `X-Checksum-Sha256`, streaming) porém **sem autenticação**, gated por `status='publicado'` do jogo dono da build (builds de jogos rascunho/arquivado retornam 404). Ver ADR `Downloads/demandas/docs/decisions/2026-06-18-launcher-l2-download-publico.md`.
  - Arquivos afetados: `backend/server.cjs`
- Campos `checksum`, `nome_arquivo` e `download_url` em cada item de `builds[]` no detalhe público do catálogo (`GET /api/catalog/games/:id`), para o launcher resolver o que baixar. `download_url` só é preenchido quando o binário já foi enviado.
  - Arquivos afetados: `backend/server.cjs`

### Removed
- Bundle `index-2nxjlXEA.js` versionado por engano na raiz do repo (artefato de build do Vite, sem referência em nenhum HTML/JS).
  - Arquivos afetados: `index-2nxjlXEA.js`
- `server.cjs` stale da raiz (pedia `sqlite3`; backend real é `backend/server.cjs` com `better-sqlite3` + express 5).
  - Arquivos afetados: `server.cjs`

### Changed
- Scripts `server`/`start` do `package.json` repontados para `node backend/server.cjs` (o backend real do monorepo).
  - Arquivos afetados: `package.json`
- `origin` migrado de HTTPS (sem credential helper) para SSH, destravando `git push` no ambiente.

### Added
- Guarda no `.gitignore` (`/index-*.js`) para impedir que bundles do Vite voltem a ser versionados na raiz.
  - Arquivos afetados: `.gitignore`

### Fixed
- Divergência fonte-da-verdade ↔ produção: a branch `redesign/cinematografico` (redesign cinematográfico + blindagem) foi pushada para o GitHub e o `_frontend_src` da VPS foi sincronizado para essa branch. Antes, um rebuild a partir do `_frontend_src` (que estava em `login`/`d85c86d`) reverteria todo o redesign que estava no ar só como `dist`.
