# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [Unreleased]

### Added
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
