// Detalhe de um jogo. Busca /api/catalog/games/:id e usa o LauncherBridge.
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Play, RefreshCw, ExternalLink, Loader2, Gamepad2, Package } from 'lucide-react';
import api from '../services/api';
import { isLauncher, getGameState, gameAction } from '../services/launcher';
import { platformMeta } from '../components/PlatformBadge';
import { useTranslation } from 'react-i18next';

export default function GameDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState('browser');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get('/catalog/games/' + id)
      .then((r) => { if (alive) setGame(r.data); })
      .catch(() => { if (alive) setGame(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    let alive = true;
    getGameState(id).then((s) => { if (alive) setState(s); });
    return () => { alive = false; };
  }, [id, game]);

  const p = game && (game.poster_path || game.capa);
  const imageUrl = !p ? null : (p.startsWith('http') || p.startsWith('/') ? p : '/' + p);
  const busy = state === 'installing' || state === 'downloading' || state === 'updating';

  const actionLabel = !isLauncher() ? t('games.actionOpenLauncher')
    : state === 'installed' ? t('games.actionPlay')
    : state === 'installing' ? t('games.actionInstalling')
    : state === 'downloading' ? t('games.actionDownloading')
    : state === 'updating' ? t('games.actionUpdate')
    : state === 'running' ? t('games.actionRunning')
    : t('games.actionInstall');

  // Icone do botao conforme o estado (apenas visual; nao altera a logica).
  const ActionIcon = !isLauncher() ? ExternalLink
    : busy ? Loader2
    : state === 'installed' ? Play
    : state === 'running' ? Play
    : state === 'updating' ? RefreshCw
    : Download;

  const onAction = async () => {
    if (!isLauncher()) {
      alert(t('games.launcherAlert'));
      return;
    }
    const act = state === 'installed' ? 'play' : (state === 'updating' ? 'update' : 'install');
    await gameAction(act, id);
    setState(await getGameState(id));
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-cinema-bg">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600 dark:border-accent-purple" />
    </div>
  );
  if (!game) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-cinema-bg">
      <div className="text-center">
        <div className="mx-auto mb-4 w-fit rounded-full bg-red-100 p-4 dark:bg-accent-red/10 dark:ring-1 dark:ring-accent-red/30">
          <Gamepad2 className="h-9 w-9 text-red-500 dark:text-accent-red" />
        </div>
        <p className="mb-4 font-display text-xl text-red-500 dark:text-accent-red">{t('games.notFound', { id })}</p>
        <button onClick={() => navigate('/games')} className="rounded-lg bg-purple-600 px-5 py-2 font-semibold text-white hover:bg-purple-700 dark:bg-accent-purple dark:text-cinema-bg dark:shadow-glow dark:hover:bg-accent-purple">{t('games.backToGames')}</button>
      </div>
    </div>
  );

  const genres = Array.isArray(game.genres) ? game.genres : [];
  const builds = Array.isArray(game.builds) ? game.builds : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg">
      {/* Banner de fundo (backdrop) com a capa esmaecida + scrim */}
      <div className="relative h-52 w-full overflow-hidden sm:h-64 md:h-72">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full scale-110 object-cover blur-xl dark:brightness-75" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-700 via-purple-900 to-gray-950
                          dark:from-cinema-elevated dark:via-cinema-surface dark:to-cinema-bg" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/60 to-black/30
                        dark:from-cinema-bg dark:via-cinema-bg/80 dark:to-transparent" />
        <button
          onClick={() => navigate('/games')}
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5
                     text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-black/70
                     dark:hover:ring-accent-purple/40"
        >
          <ArrowLeft className="h-4 w-4" /> {t('games.back')}
        </button>
      </div>

      <div className="mx-auto -mt-24 grid max-w-5xl gap-8 px-4 pb-12 md:grid-cols-3">
        {/* Coluna do poster + acao */}
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt={game.title}
                   className="aspect-[2/3] w-full rounded-card-lg object-cover shadow-2xl ring-1 ring-black/10
                              dark:shadow-poster dark:ring-white/10" />
            ) : (
              <div className="flex aspect-[2/3] w-full flex-col items-center justify-center gap-3 rounded-card-lg
                              bg-gradient-to-br from-purple-700 via-purple-900 to-zinc-900 shadow-2xl
                              dark:from-cinema-elevated dark:via-cinema-surface dark:to-cinema-bg dark:shadow-poster">
                <Gamepad2 className="h-14 w-14 text-white/80" />
                <span className="px-4 text-center font-display text-sm font-semibold text-white/90">{game.title}</span>
              </div>
            )}

            <button
              onClick={onAction}
              disabled={busy}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3.5
                         text-base font-semibold text-white shadow-lg shadow-purple-600/25 transition-all
                         hover:bg-purple-700 hover:shadow-purple-600/40 disabled:opacity-60
                         dark:bg-accent-purple dark:text-cinema-bg dark:shadow-glow
                         dark:hover:bg-accent-purple dark:hover:shadow-glow-strong"
            >
              <ActionIcon className={'h-5 w-5' + (busy ? ' animate-spin' : '')} />
              {actionLabel}
            </button>
            {!isLauncher() && (
              <p className="mt-2 text-center text-xs text-gray-400 dark:text-zinc-500">{t('games.launcherHint')}</p>
            )}
          </motion.div>
        </div>

        {/* Coluna de info */}
        <div className="md:col-span-2 md:pt-24">
          <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{game.title}</h1>

          {genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {genres.map((g, i) => (
                <span key={i} className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold
                                         text-purple-700 dark:bg-accent-purple/10 dark:text-accent-purple
                                         dark:ring-1 dark:ring-accent-purple/20">
                  {g}
                </span>
              ))}
            </div>
          )}

          <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-700 dark:text-zinc-300">
            {game.overview || t('games.noDescription')}
          </p>

          {builds.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-gray-900 dark:text-white">
                <Package className="h-5 w-5 text-purple-500 dark:text-accent-purple" /> {t('games.availableVersions')}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {builds.map((b) => {
                  const { Icon } = platformMeta(b.plataforma);
                  return (
                    <div key={b.id}
                         className="flex items-center gap-3 rounded-card border border-gray-200 bg-white p-3
                                    transition-colors dark:border-white/5 dark:bg-cinema-surface
                                    dark:shadow-poster dark:hover:border-accent-purple/30">
                      <div className="rounded-lg bg-purple-100 p-2 dark:bg-accent-purple/10">
                        <Icon className="h-5 w-5 text-purple-600 dark:text-accent-purple" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {b.plataforma}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                          v{b.versao}
                          {b.tamanho ? ' · ' + b.tamanho : ''}
                        </p>
                      </div>
                      {b.obrigatorio && (
                        <span className="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold
                                         text-purple-700 dark:bg-accent-purple/15 dark:text-accent-purple">
                          {t('games.required')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
