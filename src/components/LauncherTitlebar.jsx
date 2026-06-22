// Barra de título PRÓPRIA do launcher (janela frameless, estilo Steam/Epic).
// Só é renderizada DENTRO do launcher (gated por isLauncher no GamesLayout), então
// o site no navegador não é afetado. Região arrastável + controles de janela +
// auto-update do app + biblioteca + configurações (pasta/versão/sair).
import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Gamepad2, RefreshCw, LibraryBig, Settings, FolderOpen, Power, Info,
  Minus, Square, X,
} from 'lucide-react';
import { win, update, appVersion, openGamesFolder } from '../services/launcher';

// drag = a janela inteira move; no-drag = elementos clicáveis
const DRAG = { WebkitAppRegion: 'drag' };
const NODRAG = { WebkitAppRegion: 'no-drag' };

export default function LauncherTitlebar() {
  const { t } = useTranslation();
  const [upd, setUpd] = useState({ status: 'idle', version: null });
  const [version, setVersion] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    appVersion().then(setVersion);
    const off = update.onStatus(setUpd);
    update.check(); // dispara checagem inicial; status volta via onStatus
    return off;
  }, []);

  // fecha o menu ao clicar fora
  useEffect(() => {
    if (!menuOpen) return;
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  // Mapeia o status do update p/ rótulo + ação do botão "Atualizar".
  // SEMPRE visível (mesmo em dev / já-atualizado), pra não sumir e confundir.
  const updView = (() => {
    switch (upd.status) {
      case 'checking': return { label: t('games.updChecking', 'Verificando…'), spin: true, onClick: null, hot: false };
      case 'downloading': return { label: t('games.updDownloading', 'Baixando…'), spin: true, onClick: null, hot: false };
      case 'downloaded': return { label: t('games.updRestart', 'Reiniciar p/ atualizar'), spin: false, onClick: () => update.quitAndInstall(), hot: true };
      case 'error': return { label: t('games.updRetry', 'Tentar de novo'), spin: false, onClick: () => update.check(), hot: false };
      default: return { label: t('games.update', 'Atualizar'), spin: false, onClick: () => update.check(), hot: false };
    }
  })();

  return (
    <div style={DRAG}
      className="sticky top-0 z-[60] flex h-11 select-none items-center justify-between border-b border-accent-green/15 bg-cinema-bg px-3 text-zinc-200">
      {/* Marca */}
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-accent-deep/40 to-accent-green/30 ring-1 ring-accent-green/40">
          <Gamepad2 className="h-4 w-4 text-accent-green-bright" />
        </span>
        <span className="font-display text-sm font-bold tracking-tight">
          FILMERAMA <span className="text-accent-green-bright">GAMES</span>
        </span>
      </div>

      {/* Controles à direita (não arrastáveis) */}
      <div style={NODRAG} className="flex items-center gap-1.5">
        {/* Atualizar */}
        {updView && (
          <button onClick={updView.onClick || undefined} disabled={!updView.onClick}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors
              ${updView.hot
                ? 'bg-accent-green text-cinema-bg shadow-glow-green hover:bg-accent-green-bright'
                : 'text-zinc-300 hover:bg-cinema-elevated hover:text-accent-green-bright disabled:opacity-60'}`}>
            <RefreshCw className={`h-3.5 w-3.5 ${updView.spin ? 'animate-spin' : ''}`} /> {updView.label}
          </button>
        )}

        {/* Biblioteca */}
        <NavLink to="/games/biblioteca"
          className={({ isActive }) => `inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors
            ${isActive ? 'text-accent-green-bright' : 'text-zinc-300 hover:bg-cinema-elevated hover:text-accent-green-bright'}`}>
          <LibraryBig className="h-3.5 w-3.5" /> {t('games.library', 'Biblioteca')}
        </NavLink>

        {/* Configurações */}
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((v) => !v)} aria-label={t('games.settings', 'Configurações')}
            className="rounded-md p-1.5 text-zinc-300 transition-colors hover:bg-cinema-elevated hover:text-accent-green-bright">
            <Settings className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-white/10 bg-cinema-elevated shadow-glow-green">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400">
                <Info className="h-3.5 w-3.5" /> {t('games.version', 'Versão')} {version ? `v${version}` : '—'}
              </div>
              <div className="h-px bg-white/5" />
              <button onClick={() => { openGamesFolder(); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-cinema-surface hover:text-accent-green-bright">
                <FolderOpen className="h-4 w-4" /> {t('games.openFolder', 'Abrir pasta dos jogos')}
              </button>
              <button onClick={() => win.close()}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-red-600 hover:text-white">
                <Power className="h-4 w-4" /> {t('games.quit', 'Sair')}
              </button>
            </div>
          )}
        </div>

        {/* Controles de janela */}
        <div className="ml-1 flex items-center">
          <button onClick={() => win.minimize()} aria-label={t('games.minimize', 'Minimizar')}
            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-cinema-elevated hover:text-white">
            <Minus className="h-4 w-4" />
          </button>
          <button onClick={() => win.maximizeToggle()} aria-label={t('games.maximize', 'Maximizar')}
            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-cinema-elevated hover:text-white">
            <Square className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => win.close()} aria-label={t('games.close', 'Fechar')}
            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-600 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
