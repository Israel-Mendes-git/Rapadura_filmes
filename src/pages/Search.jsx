import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { customMovies } from '../data/customMovies';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LoginAlert from '../components/LoginAlert';
import { Search as SearchIcon, SearchX } from 'lucide-react';

export default function Search() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }
    if (!user) {
      return <LoginAlert message="Faça login para pesquisar conteúdo" />;
    }
    setLoading(true);
    try {
      const results = customMovies.all.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setMovies(results);
    } catch (err) {
      console.error('Erro na busca:', err);
    } finally {
      setLoading(false);
    }
  }, [query, navigate, user]);

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-card bg-gray-200 dark:bg-cinema-surface dark:border dark:border-white/5 text-accent-amber shadow-glow">
            <SearchIcon className="w-6 h-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
            {t('searchPage.title')}:{' '}
            <span className="text-accent-amber">"{query}"</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-amber"></div>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-card-lg bg-gray-200 dark:bg-cinema-surface dark:border dark:border-white/5 text-gray-400 dark:text-gray-600 mb-5">
              <SearchX className="w-8 h-8" />
            </span>
            <p className="text-xl font-display text-gray-600 dark:text-gray-300">
              {t('searchPage.noResults')} "{query}"
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2.5 rounded-card bg-accent-amber text-cinema-bg font-display font-semibold shadow-glow hover:shadow-glow-strong transition-all"
            >
              {t('searchPage.backToHome')}
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-display font-semibold text-accent-amber">
                {movies.length}
              </span>
              {movies.length === 1 ? t('contentFound') : t('contentsFound')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-7">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  className="cursor-pointer"
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}