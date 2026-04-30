import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }

    const fetchSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchMovies(query, page);
        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500));
      } catch (err) {
        console.error('Erro na busca:', err);
        setError('Erro ao buscar filmes. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query, page, navigate]);

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Buscando "{query}"...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header da busca */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Resultados para: "{query}"
          </h1>
          <p className="text-zinc-400">
            {movies.length} {movies.length === 1 ? 'filme encontrado' : 'filmes encontrados'}
          </p>
        </div>

        {/* Grid de filmes */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-xl">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : movies.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-2xl text-zinc-500">Nenhum filme encontrado 😕</p>
            <p className="text-zinc-400 mt-2">Tente usar outras palavras-chave</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12 pb-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-zinc-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                >
                  ← Anterior
                </button>
                
                <span className="px-4 py-2 bg-purple-600 rounded-lg">
                  {page} / {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-zinc-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}