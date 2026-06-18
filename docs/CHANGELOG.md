# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [Unreleased]

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
