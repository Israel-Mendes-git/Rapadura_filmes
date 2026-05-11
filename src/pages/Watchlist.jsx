import { useWatchlist } from '../contexts/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LoginAlert from '../components/LoginAlert';

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };
  
  if (!user) {
    return <LoginAlert message="Faça login para ver sua lista personalizada" />;
  }

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">{t('watchlistPage.empty')}</h2>
          <p className="text-zinc-400 mb-6">{t('watchlistPage.emptyMessage')}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {t('home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('watchlistPage.title')}
          </h1>
          <p className="text-zinc-400">
            {watchlist.length} {watchlist.length === 1 ? t('watchlistPage.items_one') : t('watchlistPage.items_other')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <div key={movie.id} className="relative group">
              <div onClick={() => handleMovieClick(movie.id)} className="cursor-pointer">
                <MovieCard movie={movie} />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 pb-12">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            + {t('watchlistPage.addMore')}
          </button>
        </div>
      </div>
    </div>
  );
}