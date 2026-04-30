import { useEffect, useState } from 'react';
import { getPopularMovies, getNowPlaying, getTopRated, getUpcoming } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import GenreFilter from '../components/GenreFilter';
import { getMoviesByGenre } from '../services/tmdb';

export default function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  const [genreLoading, setGenreLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [popularRes, nowPlayingRes, topRatedRes, upcomingRes] = await Promise.all([
          getPopularMovies(),
          getNowPlaying(),
          getTopRated(),
          getUpcoming()
        ]);

        setPopularMovies(popularRes.data.results);
        setNowPlaying(nowPlayingRes.data.results);
        setTopRated(topRatedRes.data.results);
        setUpcoming(upcomingRes.data.results);
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      const fetchGenreMovies = async () => {
        setGenreLoading(true);
        try {
          const response = await getMoviesByGenre(selectedGenre);
          setGenreMovies(response.data.results);
        } catch (error) {
          console.error('Erro ao carregar filmes do gênero:', error);
        } finally {
          setGenreLoading(false);
        }
      };
      fetchGenreMovies();
    }
  }, [selectedGenre]);
    
  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-2xl text-zinc-400">Carregando filmes...</p>
      </div>
    );
  }

  const MovieSection = ({ title, movies, loading }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-zinc-400">Carregando filmes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-purple-900/50 to-zinc-900 mb-12">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Rapadura Filmes
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              Descubra os melhores filmes, avaliações e informações detalhadas
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Filtro de Gênero */}
        <GenreFilter selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />

        {/* Conteúdo condicional baseado no filtro */}
        {selectedGenre ? (
          <MovieSection 
            title={`🎭 ${genreMovies.length > 0 ? 'Filmes Encontrados' : 'Nenhum filme encontrado'}`} 
            movies={genreMovies} 
            loading={genreLoading}
          />
        ) : (
          <>
            <MovieSection title="📽️ Em Cartaz" movies={nowPlaying} />
            <MovieSection title="🔥 Populares" movies={popularMovies} />
            <MovieSection title="⭐ Mais Bem Avaliados" movies={topRated} />
            <MovieSection title="🎬 Em Breve" movies={upcoming} />
          </>
        )}
      </div>
    </div>
  );
}