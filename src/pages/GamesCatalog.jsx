// Catálogo da central de jogos: grade completa, sem hero (a "loja"). Reusa
// GameCard e o mesmo endpoint público da vitrine.
import { useState, useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import GameCard from '../components/GameCard';

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

export default function GamesCatalog() {
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white">
        <Gamepad2 className="h-6 w-6 text-accent-green-bright" /> {t('games.navCatalog', 'Catálogo')}
      </h1>

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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((g) => <GameCard key={g.id} game={g} />)}
        </div>
      )}
    </div>
  );
}
