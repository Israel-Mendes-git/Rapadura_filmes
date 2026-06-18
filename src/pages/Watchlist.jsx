import { useWatchlist } from '../contexts/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LoginAlert from '../components/LoginAlert';
import { Bookmark, Plus } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-card-lg bg-gray-200 dark:bg-cinema-surface dark:border dark:border-white/5 text-accent-amber shadow-glow mb-6">
            <Bookmark className="w-8 h-8" />
          </span>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">{t('watchlistPage.empty')}</h2>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">{t('watchlistPage.emptyMessage')}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-card bg-accent-amber text-cinema-bg font-display font-semibold shadow-glow hover:shadow-glow-strong transition-all"
          >
            {t('home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg pt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-card bg-gray-200 dark:bg-cinema-surface dark:border dark:border-white/5 text-accent-amber shadow-glow">
              <Bookmark className="w-6 h-6" />
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
              {t('watchlistPage.title')}
            </h1>
          </div>
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
            <span className="font-display font-semibold text-accent-amber">
              {watchlist.length}
            </span>
            {watchlist.length === 1 ? t('watchlistPage.items_one') : t('watchlistPage.items_other')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-7">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-card bg-gray-200 dark:bg-cinema-surface dark:border dark:border-white/5 text-gray-700 dark:text-gray-200 font-display font-medium hover:bg-gray-300 dark:hover:bg-cinema-elevated transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('watchlistPage.addMore')}
          </button>
        </div>
      </div>
    </div>
  );
}