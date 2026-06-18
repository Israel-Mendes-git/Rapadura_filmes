import { lazy } from 'react';

// Flag única de sessão: compartilhada com o listener global em main.jsx
// para garantir UM ÚNICO reload por sessão e nunca entrar em loop.
export const CHUNK_RELOAD_KEY = 'chunk-failed-once';

// Detecta a falha típica de chunk obsoleto (após deploy o hash muda e o
// .js antigo some → 404 → ChunkLoadError / "Failed to fetch dynamically
// imported module").
export function isChunkLoadError(error) {
  if (!error) return false;
  const name = error.name || '';
  const message = error.message || String(error);
  return (
    name === 'ChunkLoadError' ||
    /Loading chunk [\d]+ failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
}

// Envolve um import dinâmico em React.lazy com auto-reload único na falha.
export function lazyWithRetry(importFn) {
  return lazy(async () => {
    try {
      const mod = await importFn();
      // Import bem-sucedido: limpa a flag para permitir um novo reload
      // numa futura sessão de navegação.
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      return mod;
    } catch (err) {
      if (!sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
        window.location.reload();
        // Segura o componente até a página recarregar.
        return new Promise(() => {});
      }
      // Já recarregamos uma vez e ainda falhou: propaga o erro para
      // cair no ErrorBoundary (evita loop de reload).
      throw err;
    }
  });
}
