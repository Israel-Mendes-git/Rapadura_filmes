import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';
import { customMovies } from '../data/customMovies';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import TrailerModal from '../components/TrailerModal';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const movieId = Number(id);
    const foundMovie = customMovies.all.find(m => Number(m.id) === movieId);

    if (foundMovie) {
      setMovie(foundMovie);
      setLoading(false);
      return;
    }
    // Nao esta no catalogo estatico -> busca um filme proprio no backend.
    let alive = true;
    setLoading(true);
    api.get(`/catalog/movies/${movieId}`)
      .then((r) => { if (alive) setMovie(r.data); })
      .catch(() => { if (alive) setMovie(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  // Título da aba reflete o filme atual (SEO/UX)
  useEffect(() => {
    document.title = movie ? `${movie.title} — Rapadura Atômica` : 'Rapadura Atômica';
    return () => { document.title = 'Rapadura Atômica'; };
  }, [movie]);

  const inWatchlist = movie ? isInWatchlist(movie.id) : false;

  // Login só é exigido aqui: ao tentar assistir o filme
  const handleWatchClick = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/movie/${id}` } } });
      return;
    }
    setShowTrailer(true);
  };

  const handleWatchlistClick = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return path;
    return '/' + path;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{t('details.notFound')} (ID: {id})</p>
          <button 
            onClick={() => navigate('/')}
            className="mb-8 text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
          >
            ← {t('details.back')}
          </button>
        </div>
      </div>
    );
  }

  const posterUrl = getImageUrl(movie.poster_path);
  const backdropUrl = getImageUrl(movie.backdrop_path);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Modal do Trailer */}
      {showTrailer && movie.trailerUrl && (
        <TrailerModal 
          trailerUrl={movie.trailerUrl} 
          title={movie.title}
          onClose={() => setShowTrailer(false)} 
        />
      )}

      {backdropUrl && (
        <div 
          className="h-[400px] w-full bg-cover bg-center relative"
          style={{ backgroundImage: 'url(' + backdropUrl + ')' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
        >
          ← {t('details.back')}
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-80">
            <img 
              src={posterUrl || 'https://via.placeholder.com/500x750'}
              alt={movie.title}
              className="rounded-xl shadow-2xl w-full"
            />
            
            {/* Botões */}
            <div className="flex gap-3 mt-4">
              {/* Botão Assistir Trailer - Verde */}
              {movie.trailerUrl && (
                <button
                  onClick={handleWatchClick}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  ▶ {t('details.watchTrailer')}
                </button>
              )}
              
              {/* Botão Watchlist - Roxo */}
              <button
                onClick={handleWatchlistClick}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  inWatchlist 
                    ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {inWatchlist ? t('details.inList') : t('details.addToList')}
              </button>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{movie.title}</h1>
            
            {movie.tagline && movie.tagline !== '...' && (
              <p className="text-xl text-purple-600 dark:text-purple-400 italic mb-6">{movie.tagline}</p>
            )}           

            <div className="flex gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-2xl">★</span>
                <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{movie.vote_average?.toFixed(1)}</span>
                {movie.vote_count > 0 && (
                  <span className="text-gray-500 dark:text-gray-400">({movie.vote_count} {t('details.votes')})</span>
                )}
              </div>
              {movie.release_date && movie.release_date !== '2000-0000' && (
                <span className="text-gray-600 dark:text-gray-400">{movie.release_date.split('-')[0]}</span>
              )}
              {movie.runtime > 0 && (
                <span className="text-gray-600 dark:text-gray-400">{movie.runtime} {t('details.minutes')}</span>
              )}
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              {movie.overview}
            </p>

            {movie.genres && movie.genres.length > 0 && movie.genres[0].name && (
              <div className="flex gap-2 flex-wrap">
                {movie.genres.map((genre, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}