import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import { customMovies } from '../data/customMovies';
import api from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import { useTranslation } from 'react-i18next';

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🔍 {t('discoverTitle')}
        </h1>

        <CategoryFilter
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
        />

        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('noMoviesFound')}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600 dark:text-gray-400">
              {filteredMovies.length} {filteredMovies.length === 1 ? t('contentFound') : t('contentsFound')}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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