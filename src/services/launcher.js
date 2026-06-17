// Wrapper seguro do contrato LauncherBridge (window.launcher).
// No browser puro (sem o launcher Electron) o estado e "browser" e o botao de
// acao vira "Abrir no launcher". Quando o launcher existir, "liga" sem mudar nada.
const bridge = () => (typeof window !== 'undefined' ? window.launcher : undefined);

export function isLauncher() {
  const b = bridge();
  return !!(b && typeof b.isLauncher === 'function' && b.isLauncher());
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
