// Vitrine publica de jogos. Busca /api/catalog/games (publicados).
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles } from 'lucide-react';
import api from '../services/api';
import GameCard from '../components/GameCard';
import { useTranslation } from 'react-i18next';

// Skeleton de card (mesma proporcao do GameCard real).
function GameCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-card bg-zinc-100 dark:bg-cinema-surface dark:shadow-poster">
      <div className="aspect-[2/3] w-full bg-zinc-200 dark:bg-cinema-elevated" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-zinc-200 dark:bg-cinema-elevated" />
        <div className="h-2.5 w-1/2 rounded bg-zinc-200 dark:bg-cinema-elevated" />
      </div>
    </div>
  );
}

export default function Games() {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api.get('/catalog/games')
      .then((r) => { if (alive) setGames(Array.isArray(r.data) ? r.data : []); })
      .catch(() => { if (alive) setGames([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const featured = games[0];
  const rest = featured ? games.slice(1) : games;

  const featuredImg = (() => {
    if (!featured) return null;
    const p = featured.poster_path || featured.capa;
    if (!p) return null;
    return p.startsWith('http') || p.startsWith('/') ? p : '/' + p;
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg">
      {/* Hero / cabecalho */}
      <div className="relative overflow-hidden border-b border-black/5 dark:border-white/5
                      bg-gradient-to-br from-purple-700 via-purple-900 to-gray-950
                      dark:from-cinema-elevated dark:via-cinema-surface dark:to-cinema-bg">
        <div className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-10"
             style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Glow âmbar cinematográfico (somente no escuro) */}
        <div className="pointer-events-none absolute -left-32 top-0 hidden h-96 w-96 rounded-full
                        bg-accent-purple/10 blur-3xl dark:block" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1
                             text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm
                             dark:bg-accent-purple/10 dark:text-accent-purple dark:ring-accent-purple/30">
              <Gamepad2 className="h-4 w-4" /> {t('jogos')}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {t('jogos')}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-purple-100/90 sm:text-lg dark:text-zinc-300">
              {t('games.heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => <GameCardSkeleton key={i} />)}
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-card-lg border border-dashed
                          border-gray-300 py-24 text-center dark:border-white/10 dark:bg-cinema-surface/40">
            <div className="mb-4 rounded-full bg-purple-100 p-5 dark:bg-accent-purple/10 dark:ring-1 dark:ring-accent-purple/20">
              <Gamepad2 className="h-10 w-10 text-purple-600 dark:text-accent-purple" />
            </div>
            <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
              {t('games.emptyTitle')}
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-zinc-400">
              {t('games.emptyMessage')}
            </p>
          </div>
        ) : (
          <>
            {/* Destaque opcional */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-10"
              >
                <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-gray-900 dark:text-white">
                  <Sparkles className="h-5 w-5 text-purple-500 dark:text-accent-purple" /> {t('games.featured')}
                </h2>
                <a
                  href={'/game/' + featured.id}
                  className="group relative block overflow-hidden rounded-card-lg shadow-lg ring-1 ring-black/5
                             dark:shadow-poster dark:ring-white/10 dark:hover:shadow-poster-hover"
                >
                  <div className="relative h-56 w-full overflow-hidden sm:h-72 md:h-80">
                    {featuredImg ? (
                      <img src={featuredImg} alt={featured.title}
                           className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-purple-700 via-purple-900 to-zinc-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  </div>
                  <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-6 sm:p-10">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-white drop-shadow sm:text-3xl">{featured.title}</h3>
                    {Array.isArray(featured.genres) && featured.genres.length > 0 && (
                      <p className="mt-1 text-sm font-medium text-purple-200 dark:text-accent-purple/90">{featured.genres.slice(0, 3).join(' · ')}</p>
                    )}
                    {featured.overview && (
                      <p className="mt-3 line-clamp-2 max-w-md text-sm text-gray-200/90">{featured.overview}</p>
                    )}
                    <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-purple-600 px-5 py-2
                                     text-sm font-semibold text-white transition-colors group-hover:bg-purple-500
                                     dark:bg-accent-purple dark:text-cinema-bg dark:shadow-glow dark:group-hover:bg-amber-400">
                      {t('games.viewDetails')}
                    </span>
                  </div>
                </a>
              </motion.div>
            )}

            {/* Grid */}
            <h2 className="mb-4 font-display text-lg font-semibold text-gray-900 dark:text-white">{t('games.allGames')}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-6">
              {rest.map((g) => <GameCard key={g.id} game={g} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
