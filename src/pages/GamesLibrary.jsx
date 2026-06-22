// Biblioteca = jogos INSTALADOS localmente pelo launcher (estilo aba Biblioteca
// da Steam). Só faz sentido dentro do launcher; no navegador mostra um aviso.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LibraryBig, Play, Download, FolderOpen, Loader2 } from 'lucide-react';
import api from '../services/api';
import { isLauncher, listInstalled, gameAction, getGameState, onStateChange, openGamesFolder } from '../services/launcher';

export default function GamesLibrary() {
  const inLauncher = isLauncher();
  const [items, setItems] = useState(null); // null = carregando
  const [states, setStates] = useState({}); // gameId -> estado (running/installed...)

  useEffect(() => {
    if (!inLauncher) { setItems([]); return; }
    let alive = true;
    (async () => {
      const installed = await listInstalled();
      // Enriquecer com título/capa do catálogo (best-effort).
      let catalog = [];
      try { catalog = (await api.get('/catalog/games')).data || []; } catch { /* offline ok */ }
      const byId = new Map(catalog.map((g) => [String(g.id), g]));
      const merged = installed.map((rec) => ({ ...rec, meta: byId.get(String(rec.gameId)) || null }));
      if (alive) setItems(merged);
      // estados atuais
      for (const rec of installed) {
        getGameState(rec.gameId).then((s) => alive && setStates((m) => ({ ...m, [rec.gameId]: s })));
      }
    })();
    const off = onStateChange((e) => setStates((m) => ({ ...m, [e.gameId]: e.state })));
    return () => { alive = false; off(); };
  }, [inLauncher]);

  if (!inLauncher) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-accent-green/10 ring-1 ring-accent-green/20">
          <LibraryBig className="h-8 w-8 text-accent-green-bright" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Biblioteca</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
          A biblioteca de jogos instalados aparece dentro do launcher Filmerama Games.
        </p>
        <Link to="/download" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-green px-5 py-2.5
                                        text-sm font-bold text-cinema-bg shadow-glow-green hover:bg-accent-green-bright">
          <Download className="h-4 w-4" /> Baixar o launcher
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white">
          <LibraryBig className="h-6 w-6 text-accent-green-bright" /> Biblioteca
        </h1>
        <button onClick={() => openGamesFolder()}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs
                     font-medium text-zinc-300 hover:border-accent-green/40 hover:text-accent-green-bright">
          <FolderOpen className="h-4 w-4" /> Abrir pasta
        </button>
      </div>

      {items === null ? (
        <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card-lg border border-dashed
                        border-accent-green/15 bg-cinema-surface/40 py-24 text-center">
          <LibraryBig className="mb-3 h-10 w-10 text-accent-green-bright/80" />
          <h2 className="font-display text-lg font-semibold text-white">Nenhum jogo instalado ainda</h2>
          <p className="mt-2 max-w-md text-sm text-zinc-400">Instale um jogo pelo catálogo e ele aparece aqui.</p>
          <Link to="/games/catalogo" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-green px-4 py-2
                                                text-sm font-bold text-cinema-bg shadow-glow-green hover:bg-accent-green-bright">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => {
            const title = it.meta?.title || `Jogo ${it.gameId}`;
            const cover = (() => {
              const p = it.meta?.backdrop_path || it.meta?.poster_path || it.meta?.capa;
              return p ? (p.startsWith('http') || p.startsWith('/') ? p : '/' + p) : null;
            })();
            const running = states[it.gameId] === 'running';
            return (
              <div key={it.gameId} className="overflow-hidden rounded-card bg-cinema-surface ring-1 ring-white/5 shadow-poster">
                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-accent-deep/40 via-cinema-elevated to-black">
                  {cover && <img src={cover} alt={title} className="h-full w-full object-cover" />}
                </div>
                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-semibold text-white">{title}</h3>
                    <p className="text-[11px] text-zinc-500">{it.version ? `v${it.version}` : 'instalado'}</p>
                  </div>
                  <button onClick={() => gameAction('play', it.gameId)} disabled={running}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent-green px-3 py-1.5 text-xs
                               font-bold text-cinema-bg shadow-glow-green transition-colors hover:bg-accent-green-bright
                               disabled:opacity-60">
                    <Play className="h-3.5 w-3.5 fill-current" /> {running ? 'Rodando…' : 'Jogar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
