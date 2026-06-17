// Vitrine publica de jogos. Busca /api/catalog/games (publicados).
import { useState, useEffect } from 'react';
import api from '../services/api';
import GameCard from '../components/GameCard';
import { useTranslation } from 'react-i18next';

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('jogos')}</h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" /></div>
        ) : games.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Nenhum jogo publicado ainda.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {games.map((g) => <GameCard key={g.id} game={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}
