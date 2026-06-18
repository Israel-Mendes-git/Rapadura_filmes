import { useWatchlist } from '../contexts/WatchlistContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Check, Plus } from 'lucide-react';

export default function MovieCard({ movie }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inWatchlist = isInWatchlist(movie.id);
  const [imgError, setImgError] = useState(false);

  const getImageUrl = () => {
    if (imgError) {
      return 'https://via.placeholder.com/300x450/2d2d2d/ffffff?text=' + encodeURIComponent(movie.title);
    }
    
    if (movie.poster_path) {
      if (movie.poster_path.startsWith('http')) {
        return movie.poster_path;
      }
      if (movie.poster_path.startsWith('/')) {
        return movie.poster_path;
      }
      return '/' + movie.poster_path;
    }
    
    return 'https://via.placeholder.com/300x450/2d2d2d/ffffff?text=' + encodeURIComponent(movie.title);
  };

  const posterUrl = getImageUrl();

  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navegação SPA (sem recarregar a página inteira)
    navigate('/movie/' + movie.id);
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <motion.div
      className="group relative bg-zinc-100 dark:bg-cinema-surface rounded-card-lg overflow-hidden cursor-pointer shadow-poster"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick(e);
        }
      }}
    >
      <img
        src={posterUrl}
        alt={movie.title}
        loading="lazy"
        className="w-full aspect-[2/3] object-cover pointer-events-none"
        onError={() => setImgError(true)}
      />

      <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-accent-amber/40 rounded-card-lg transition-all duration-300 pointer-events-none" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <h3 className="font-display font-bold text-sm line-clamp-2 text-white mb-1">
          {movie.title}
        </h3>

        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 fill-accent-amber text-accent-amber" />
          <span className="text-zinc-200 text-sm font-medium">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
          <span className="text-zinc-400 text-xs ml-auto">
            {movie.release_date ? movie.release_date.substring(0, 4) : ''}
          </span>
        </div>
      </div>

      <button
        className="watchlist-btn absolute top-2 right-2 p-2 rounded-full transition-all bg-black/60 hover:bg-accent-amber hover:text-cinema-bg text-white opacity-0 group-hover:opacity-100 z-10"
        onClick={handleWatchlistClick}
        title={inWatchlist ? t('details.removeFromList') : t('details.addToList')}
      >
        {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </motion.div>
  );
}