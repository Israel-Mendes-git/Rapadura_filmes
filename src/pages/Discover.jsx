import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import { customMovies } from '../data/customMovies';
import api from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import { useTranslation } from 'react-i18next';
import { Compass, Film } from 'lucide-react';

export default function Discover() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    let alive = true;
    // Mescla os filmes proprios do admin (/api/catalog/movies) com o catalogo
    // estatico, deduplicando por id. Em caso de erro, cai no estatico.
    api.get('/catalog/movies')
      .then((r) => {
        if (!alive) return;
        const adminMovies = Array.isArray(r.data) ? r.data : [];
        const adminIds = new Set(adminMovies.map((m) => m.id));
        setMovies([...adminMovies, ...customMovies.all.filter((m) => !adminIds.has(m.id))]);
      })
      .catch(() => { if (alive) setMovies(customMovies.all); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const filteredMovies = movies.filter(movie => {
    const matchesCategory = selectedCategory === 'all' || movie.category === selectedCategory;
    const matchesType = selectedType === 'all' || movie.type === selectedType;
    return matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-amber"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-card bg-gray-200 dark:bg-cinema-surface dark:border dark:border-white/5 text-accent-amber shadow-glow">
            <Compass className="w-6 h-6" />
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
            {t('discoverTitle')}
          </h1>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
        />

        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-card-lg bg-gray-200 dark:bg-cinema-surface dark:border dark:border-white/5 text-gray-400 dark:text-gray-600 mb-5">
              <Film className="w-8 h-8" />
            </span>
            <p className="text-xl font-display text-gray-600 dark:text-gray-300">
              {t('noMoviesFound')}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-display font-semibold text-accent-amber">
                {filteredMovies.length}
              </span>
              {filteredMovies.length === 1 ? t('contentFound') : t('contentsFound')}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-7">
              {filteredMovies.map(movie => (
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