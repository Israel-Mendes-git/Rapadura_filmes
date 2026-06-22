// Wrapper seguro do contrato LauncherBridge (window.launcher).
// No browser puro (sem o launcher Electron) o estado e "browser" e o botao de
// acao vira "Abrir no launcher". Quando o launcher existir, "liga" sem mudar nada.
const bridge = () => (typeof window !== 'undefined' ? window.launcher : undefined);

export function isLauncher() {
  const b = bridge();
  return !!(b && typeof b.isLauncher === 'function' && b.isLauncher());
}

/**
 * O launcher tem a "casca de app" (janela frameless + controles de janela)?
 * Detecta a CAPACIDADE (`window.launcher.win`), não só a presença do launcher —
 * assim um launcher antigo (framed, sem essa API) NÃO renderiza a barra própria,
 * evitando barra dupla até ele se auto-atualizar.
 */
export function hasAppChrome() {
  const b = bridge();
  return !!(isLauncher() && b && b.win && typeof b.win.close === 'function');
}

export async function getGameState(id) {
  if (!isLauncher()) return 'browser';
  try { return await bridge().getGameState(String(id)); }
  catch { return 'not-installed'; }
}

export async function gameAction(action, id) {
  const b = bridge();
  if (!isLauncher() || !b || typeof b[action] !== 'function') return false;
  try { await b[action](String(id)); return true; }
  catch { return false; }
}

export function onStateChange(cb) {
  const b = bridge();
  if (!isLauncher() || !b || typeof b.onStateChange !== 'function') return () => {};
  try { return b.onStateChange(cb) || (() => {}); }
  catch { return () => {}; }
}

// ---- Chrome do app (frameless / estilo Steam) — só fazem algo no launcher ----

/** Controles da janela. */
export const win = {
  minimize: () => bridge()?.win?.minimize?.(),
  maximizeToggle: () => bridge()?.win?.maximizeToggle?.(),
  close: () => bridge()?.win?.close?.(),
};

/** Versão do launcher (string) ou null fora dele. */
export async function appVersion() {
  if (!isLauncher()) return null;
  try { return await bridge().appVersion(); } catch { return null; }
}

/** Abre a pasta de instalação dos jogos no explorador do SO. */
export function openGamesFolder() {
  try { return bridge()?.openGamesFolder?.(); } catch { /* noop */ }
}

/** Lista de jogos instalados localmente (array) ou [] fora do launcher. */
export async function listInstalled() {
  if (!isLauncher()) return [];
  try { return (await bridge().listInstalled()) || []; } catch { return []; }
}

/** Auto-update do launcher. */
export const update = {
  check: () => bridge()?.update?.check?.(),
  quitAndInstall: () => bridge()?.update?.quitAndInstall?.(),
  onStatus: (cb) => {
    const b = bridge();
    if (!isLauncher() || !b?.update?.onStatus) return () => {};
    try { return b.update.onStatus(cb) || (() => {}); } catch { return () => {}; }
  },
};
