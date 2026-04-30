import { useWatchlist } from '../contexts/WatchlistContext';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const navigate = useNavigate();
  const inWatchlist = isInWatchlist(movie.id);

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=Sem+Imagem';

  const handleCardClick = (e) => {
    // Não navegar se clicou no botão da watchlist
    if (e.target.closest('.watchlist-btn')) return;
    navigate(`/movie/${movie.id}`);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div 
      className="group relative bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <img 
        src={posterUrl} 
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-semibold text-sm line-clamp-2 text-white mb-1">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">★</span>
          <span className="text-zinc-300 text-sm font-medium">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
          <span className="text-zinc-500 text-xs ml-auto">
            {movie.release_date ? movie.release_date.substring(0, 4) : ''}
          </span>
        </div>
      </div>

      {/* Botão da watchlist */}
      <button
        className={`watchlist-btn absolute top-2 right-2 p-2 rounded-full transition-all ${
          inWatchlist 
            ? 'bg-purple-600 hover:bg-purple-700' 
            : 'bg-black/60 hover:bg-purple-600'
        } opacity-0 group-hover:opacity-100 transition-opacity`}
        onClick={handleWatchlistClick}
        title={inWatchlist ? 'Remover da lista' : 'Adicionar à lista'}
      >
        {inWatchlist ? '✓' : '+'}
      </button>
    </div>
  );
}