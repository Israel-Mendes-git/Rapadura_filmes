# ADR: Tradução automática de conteúdo dinâmico do catálogo

**Date**: 2026-06-19
**Status**: Accepted
**Context**: backend (catálogo) + frontend (consumo i18n)

## Context

A UI é internacionalizada (react-i18next, pt/en/es/zh), mas as descrições
cadastradas no admin — `sinopse`/`overview` e `tagline` de filmes, `descricao`
de jogos — são gravadas em PT único e exibidas cruas em qualquer idioma. O
conteúdo curado estático (`customMovies.featured`) já havia sido traduzido via
chaves i18n num ciclo anterior; faltava o conteúdo dinâmico do banco
(`backend/filmerama.db`).

O usuário pediu para traduzir esse conteúdo dinâmico **com baixo esforço de
cadastro** (sem digitar manualmente cada idioma no admin).

## Decision

Traduzir automaticamente via serviço externo, com **cache persistente** no banco.

- **Provider configurável por env** (`TRANSLATE_PROVIDER`): default `mymemory`
  (grátis, sem chave); `deepl` e `libre` suportados; `off` desliga. Chave/URL via
  `TRANSLATE_API_KEY` / `TRANSLATE_URL`. Módulo: `backend/translate.cjs`.
- **Cache** na tabela `translations (entity_type, entity_id, field, lang, text,
  source_hash)`, criada por migração idempotente. `source_hash` (sha256 do texto
  PT) invalida a tradução quando o original muda.
- **Quando traduz**: no *save* do admin (POST/PUT de movies/games, em background,
  best-effort) e via *backfill* no boot (idempotente, só o que falta).
- **Quando lê**: as rotas públicas `/api/catalog/*` resolvem o idioma de `?lang=`
  (fallback `Accept-Language`, default `pt`) e **apenas leem o cache** — sem
  chamada de rede inline. Cache ausente ou provider em falha → **fallback ao PT**.
- **Frontend**: um interceptor do axios injeta `?lang=<i18n.language>` em toda
  request; os componentes de catálogo re-buscam ao trocar de idioma
  (`i18n.language` nas deps do efeito). O helper `resolveDescription` continua
  como camada de fallback.

## Consequences

- (+) Zero digitação extra no admin; leitura rápida (cache, sem rede no GET);
  degradação graciosa (nunca quebra save nem GET).
- (+) Provider trocável sem mexer no resto (DeepL p/ qualidade em produção,
  grátis p/ dev).
- (−) Qualidade de MT variável — taglines poéticas podem sair literais
  (ex.: "Uma amizade que ilumina" → "A friendship that illuminates"). Aceito.
- (−) Dependência/custo de serviço externo; conteúdo recém-criado pode aparecer
  em PT por alguns segundos até o cache popular (tradução assíncrona no save).

## Alternatives Considered

- **Campos por idioma no admin (manual)**: melhor qualidade, porém muito
  trabalho de cadastro — descartado pela preferência por baixo esforço.
- **Híbrido (auto + revisão no admin)**: melhor dos dois, adiável como evolução.
- **Tradução inline no GET**: latência e custo por request (N itens nas listas)
  — descartado em favor de cache + save/backfill.

## Validação realizada

Boot end-to-end com DB temporário: seed de filme PT → backfill populou o cache →
`GET ?lang=en` retornou "A magical adventure about friendship." / "A friendship
that illuminates"; `?lang=es` "Una aventura mágica sobre la amistad." / "Una
amistad que ilumina"; `?lang=pt` manteve o texto cru. Build do frontend OK.
