import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import MovieCarousel from '../components/MovieCarousel';
import { customMovies } from '../data/customMovies';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [activeTab, setActiveTab] = useState('all');
  // Filmes próprios cadastrados no painel de admin (fonte='proprio').
  // São buscados do backend e mesclados ao catálogo estático sem quebrar
  // o fluxo atual: se a chamada falhar, fica só com os filmes estáticos.
  const [adminMovies, setAdminMovies] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    let alive = true;
    api.get('/catalog/movies')
      .then((r) => { if (alive && Array.isArray(r.data)) setAdminMovies(r.data); })
      .catch(() => { /* sem catálogo dinâmico: segue com os estáticos */ });
    return () => { alive = false; };
  }, []);

  // Mescla catálogo estático + filmes do admin, deduplicando por id
  // (filmes do admin têm precedência e aparecem primeiro).
  const staticMovies = customMovies.all;
  const adminIds = new Set(adminMovies.map((m) => m.id));
  const allMovies = [...adminMovies, ...staticMovies.filter((m) => !adminIds.has(m.id))];

  const getMoviesByCategory = (category) => {
    if (category === 'all') return allMovies;
    return allMovies.filter(movie => movie.category === category);
  };

  const getMoviesByType = (type) => {
    return allMovies.filter(movie => movie.type === type);
  };

  const currentMovies = getMoviesByCategory(activeTab);
  const otherMovies = currentMovies;

  const autoralMovies = allMovies.filter(m => m.category === 'autorais');
  const jogosMovies = allMovies.filter(m => m.category === 'jogos');
  const parceriasMovies = allMovies.filter(m => m.category === 'parcerias');

  const seriesMovies = getMoviesByType('series');
  const curtasMovies = getMoviesByType('curtas');
  const longasMovies = getMoviesByType('longas');

  const featuredMovies = [...allMovies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 6);

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const categories = [
    { id: 'all', name: t('all') },
    { id: 'autorais', name: t('autorais') },
    { id: 'jogos', name: t('jogos') },
    { id: 'parcerias', name: t('parcerias') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg">
      <HeroCarousel movies={featuredMovies} />

      <div className="max-w-7xl mx-auto px-4 pb-12 -mt-4 relative z-10">
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 border ${
                activeTab === cat.id
                  ? 'bg-accent-amber text-cinema-bg border-accent-amber shadow-glow'
                  : 'bg-gray-200 dark:bg-cinema-surface text-gray-700 dark:text-gray-300 border-transparent dark:border-white/5 hover:bg-gray-300 dark:hover:bg-cinema-elevated'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {activeTab === 'all' && (
          <>
            {autoralMovies.length > 0 && (
              <MovieCarousel title={t('autorais')} movies={autoralMovies} onMovieClick={handleMovieClick} />
            )}
            {jogosMovies.length > 0 && (
              <MovieCarousel title={t('jogos')} movies={jogosMovies} onMovieClick={handleMovieClick} />
            )}
            {parceriasMovies.length > 0 && (
              <MovieCarousel title={t('parcerias')} movies={parceriasMovies} onMovieClick={handleMovieClick} />
            )}

            {seriesMovies.length > 0 && (
              <MovieCarousel title={t('series')} movies={seriesMovies} onMovieClick={handleMovieClick} />
            )}
            {curtasMovies.length > 0 && (
              <MovieCarousel title={t('curtas')} movies={curtasMovies} onMovieClick={handleMovieClick} />
            )}
            {longasMovies.length > 0 && (
              <MovieCarousel title={t('longas')} movies={longasMovies} onMovieClick={handleMovieClick} />
            )}

            <MovieCarousel
              title={t('mostRated')}
              movies={[...allMovies].sort((a,b) => b.vote_average - a.vote_average)}
              onMovieClick={handleMovieClick}
            />
          </>
        )}

        {activeTab === 'autorais' && (
          <>
            <MovieCarousel title={t('longas')} movies={autoralMovies.filter(m => m.type === 'longas')} onMovieClick={handleMovieClick} />
            <MovieCarousel title={t('curtas')} movies={autoralMovies.filter(m => m.type === 'curtas')} onMovieClick={handleMovieClick} />
            <MovieCarousel title={t('series')} movies={autoralMovies.filter(m => m.type === 'series')} onMovieClick={handleMovieClick} />
          </>
        )}

        {activeTab === 'jogos' && (
          <>
            <MovieCarousel title={t('jogos')} movies={jogosMovies} onMovieClick={handleMovieClick} />
          </>
        )}

        {activeTab === 'parcerias' && (
          <>
            <MovieCarousel title={t('parcerias')} movies={parceriasMovies} onMovieClick={handleMovieClick} />
          </>
        )}
      </div>
    </div>
  );
}
