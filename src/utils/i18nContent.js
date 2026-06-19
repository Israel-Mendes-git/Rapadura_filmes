// Ponte entre dados de conteúdo e o i18n.
//
// Descrições de conteúdo curado (ex.: itens de `customMovies.featured`) podem
// declarar uma `overviewKey` apontando para uma chave de tradução em i18n.js.
// Conteúdo dinâmico vindo do backend não tem chave e cai no fallback: o texto
// único cadastrado em `overview`.

/**
 * Resolve a descrição traduzida de um item de conteúdo.
 * @param {{ overviewKey?: string, overview?: string }} item
 * @param {(key: string) => string} t - função de tradução do react-i18next
 * @returns {string} descrição traduzida (se houver chave) ou o overview cru
 */
export function resolveDescription(item, t) {
  if (!item) return '';
  if (item.overviewKey) {
    const translated = t(item.overviewKey);
    // i18next retorna a própria chave quando não encontra tradução;
    // nesse caso preferimos o overview cru a exibir a chave.
    if (translated && translated !== item.overviewKey) return translated;
  }
  return item.overview || '';
}
