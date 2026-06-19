import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';
import { customMovies } from '../data/customMovies';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { resolveDescription } from '../utils/i18nContent';
import TrailerModal from '../components/TrailerModal';
import { ArrowLeft, Play, Star, Clock, Calendar, Check, Plus } from 'lucide-react';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

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
  }, [id, i18n.language]);

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
      <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-accent-purple"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 dark:text-accent-red text-xl font-display mb-6">{t('details.notFound')} (ID: {id})</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-accent-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('details.back')}
          </button>
        </div>
      </div>
    );
  }

  const posterUrl = getImageUrl(movie.poster_path);
  const backdropUrl = getImageUrl(movie.backdrop_path);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg">
      {/* Modal do Trailer */}
      {showTrailer && movie.trailerUrl && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}

      {/* Backdrop cinematográfico full-bleed com scrim subindo do fundo */}
      {backdropUrl && (
        <div
          className="absolute inset-x-0 top-0 h-[60vh] min-h-[420px] bg-cover bg-center"
          style={{ backgroundImage: 'url(' + backdropUrl + ')' }}
        >
          {/* Scrim de baixo p/ cima — funde no fundo da página */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-cinema-bg via-gray-50/40 dark:via-cinema-bg/60 to-transparent" />
          {/* Vinheta lateral/superior p/ profundidade no dark */}
          <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-cinema-bg/80 dark:via-transparent dark:to-cinema-bg/40" />
        </div>
      )}

      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 ${backdropUrl ? 'pt-[34vh] sm:pt-[38vh]' : 'pt-10'} pb-16`}>
        <button
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-accent-purple transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('details.back')}
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-80 shrink-0">
            <img
              src={posterUrl || 'https://via.placeholder.com/500x750'}
              alt={movie.title}
              className="rounded-card-lg shadow-2xl dark:shadow-poster ring-1 ring-black/5 dark:ring-white/10 w-full max-w-[18rem] mx-auto lg:mx-0"
            />

            {/* Botões */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-6 max-w-[18rem] mx-auto lg:mx-0">
              {/* CTA principal — Assistir Trailer (âmbar no dark) */}
              {movie.trailerUrl && (
                <button
                  onClick={handleWatchClick}
                  className="flex-1 py-3 px-5 bg-green-600 hover:bg-green-700 dark:bg-accent-purple dark:hover:bg-accent-purple/90 text-white dark:text-cinema-bg rounded-card font-semibold dark:font-display transition-all dark:shadow-glow dark:hover:shadow-glow-strong flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" /> {t('details.watchTrailer')}
                </button>
              )}

              {/* Watchlist — secundário escuro no dark */}
              <button
                onClick={handleWatchlistClick}
                className={`flex-1 py-3 px-5 rounded-card font-semibold transition-colors flex items-center justify-center gap-2 ${
                  inWatchlist
                    ? 'bg-gray-200 dark:bg-cinema-elevated hover:bg-gray-300 dark:hover:bg-cinema-elevated/70 text-gray-800 dark:text-gray-200 dark:ring-1 dark:ring-white/10'
                    : 'bg-purple-600 hover:bg-purple-700 dark:bg-cinema-surface dark:hover:bg-cinema-elevated text-white dark:ring-1 dark:ring-white/10'
                }`}
              >
                {inWatchlist
                  ? (<><Check className="w-5 h-5" /> {t('details.inList')}</>)
                  : (<><Plus className="w-5 h-5" /> {t('details.addToList')}</>)}
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-3 text-gray-900 dark:text-gray-50 drop-shadow-sm">
              {movie.title}
            </h1>

            {movie.tagline && movie.tagline !== '...' && (
              <p className="text-lg sm:text-xl text-purple-600 dark:text-accent-purple/90 italic mb-6">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-green-500 dark:text-accent-purple fill-current" />
                <span className="text-2xl font-display font-semibold text-gray-900 dark:text-gray-50">{movie.vote_average?.toFixed(1)}</span>
                {movie.vote_count > 0 && (
                  <span className="text-gray-500 dark:text-gray-400 text-sm">({movie.vote_count} {t('details.votes')})</span>
                )}
              </div>
              {movie.release_date && movie.release_date !== '2000-0000' && (
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {movie.release_date.split('-')[0]}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {movie.runtime} {t('details.minutes')}
                </span>
              )}
            </div>

            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
              {resolveDescription(movie, t)}
            </p>

            {movie.genres && movie.genres.length > 0 && movie.genres[0].name && (
              <div className="flex gap-2 flex-wrap">
                {movie.genres.map((genre, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-gray-200 dark:bg-cinema-elevated rounded-full text-sm text-gray-700 dark:text-gray-300 dark:ring-1 dark:ring-white/10">
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