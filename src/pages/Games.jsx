// Home da CENTRAL DE JOGOS. Busca /api/catalog/games (publicados).
// Identidade própria: preto + verde (gamer) com toque roxo da marca.
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, Play } from 'lucide-react';
import api from '../services/api';
import GameCard from '../components/GameCard';
import { useTranslation } from 'react-i18next';
import { resolveDescription } from '../utils/i18nContent';

// Skeleton de card (landscape 16:9, mesma proporção do GameCard real).
function GameCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-card bg-cinema-surface shadow-poster">
      <div className="aspect-video w-full bg-cinema-elevated" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-cinema-elevated" />
        <div className="h-2.5 w-1/2 rounded bg-cinema-elevated" />
      </div>
    </div>
  );
}

export default function Games() {
  const { t, i18n } = useTranslation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api.get('/catalog/games')
      .then((r) => { if (alive) setGames(Array.isArray(r.data) ? r.data : []); })
      .catch(() => { if (alive) setGames([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [i18n.language]);

  const featured = games[0];
  const rest = featured ? games.slice(1) : games;

  const featuredImg = (() => {
    if (!featured) return null;
    const p = featured.backdrop_path || featured.poster_path || featured.capa;
    if (!p) return null;
    return p.startsWith('http') || p.startsWith('/') ? p : '/' + p;
  })();

  return (
    <div className="min-h-screen bg-cinema-bg">
      {/* Hero: preto com glow roxo→verde */}
      <div className="relative overflow-hidden border-b border-accent-green/10
                      bg-gradient-to-br from-cinema-elevated via-cinema-surface to-cinema-bg">
        {/* malha de pontos sutil */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
             style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* glows: roxo à esquerda, verde à direita */}
        <div className="pointer-events-none absolute -left-32 -top-10 h-96 w-96 rounded-full bg-accent-deep/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-accent-green/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-green/10 px-3 py-1
                             text-xs font-semibold text-accent-green-bright ring-1 ring-accent-green/30 backdrop-blur-sm">
              <Gamepad2 className="h-4 w-4" /> {t('games.badge', 'Central de Jogos')}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-6xl">
              {t('games.heroTitle', 'Jogos da Filmerama')}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-zinc-300 sm:text-lg">
              {t('games.heroSubtitle', 'Baixe, instale e jogue pelo launcher — direto no seu computador.')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <GameCardSkeleton key={i} />)}
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-card-lg border border-dashed
                          border-accent-green/15 bg-cinema-surface/40 py-24 text-center">
            <div className="mb-4 rounded-full bg-accent-green/10 p-5 ring-1 ring-accent-green/20">
              <Gamepad2 className="h-10 w-10 text-accent-green-bright" />
            </div>
            <h2 className="font-display text-xl font-semibold text-white">{t('games.emptyTitle', 'Nenhum jogo ainda')}</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-400">{t('games.emptyMessage', 'Em breve novos jogos por aqui.')}</p>
          </div>
        ) : (
          <>
            {/* Destaque */}
            {featured && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
                <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-white">
                  <Sparkles className="h-5 w-5 text-accent-green-bright" /> {t('games.featured', 'Em destaque')}
                </h2>
                <a href={'/game/' + featured.id}
                   className="group relative block overflow-hidden rounded-card-lg ring-1 ring-white/10
                              shadow-poster transition-shadow hover:ring-accent-green/50 hover:shadow-glow-green-strong">
                  <div className="relative h-56 w-full overflow-hidden sm:h-72 md:h-80">
                    {featuredImg ? (
                      <img src={featuredImg} alt={featured.title}
                           className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-accent-deep/50 via-cinema-elevated to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                  </div>
                  <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-6 sm:p-10">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-white drop-shadow sm:text-3xl">{featured.title}</h3>
                    {Array.isArray(featured.genres) && featured.genres.length > 0 && (
                      <p className="mt-1 text-sm font-medium text-accent-green-bright/90">{featured.genres.slice(0, 3).join(' · ')}</p>
                    )}
                    {featured.overview && (
                      <p className="mt-3 line-clamp-2 max-w-md text-sm text-zinc-200/90">{resolveDescription(featured, t)}</p>
                    )}
                    <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-accent-green px-5 py-2.5
                                     text-sm font-bold text-cinema-bg shadow-glow-green transition-colors group-hover:bg-accent-green-bright">
                      <Play className="h-4 w-4 fill-current" /> {t('games.viewDetails', 'Ver detalhes')}
                    </span>
                  </div>
                </a>
              </motion.div>
            )}

            {/* Grade */}
            <h2 className="mb-4 font-display text-lg font-semibold text-white">{t('games.allGames', 'Todos os jogos')}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rest.map((g) => <GameCard key={g.id} game={g} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
