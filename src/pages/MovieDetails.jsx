import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getMovieDetails, 
  getMovieVideos, 
  getMovieProviders, 
  getMovieReviews,
  getSimilarMovies,
  getMovieCredits 
} from '../services/tmdb';
import { useWatchlist } from '../contexts/WatchlistContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [providers, setProviders] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [error, setError] = useState(null);

  const inWatchlist = isInWatchlist(parseInt(id));

  useEffect(() => {
    const fetchAllMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [
          movieRes, 
          videosRes, 
          providersRes, 
          reviewsRes, 
          similarRes,
          creditsRes
        ] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id),
          getMovieProviders(id),
          getMovieReviews(id, 1),
          getSimilarMovies(id),
          getMovieCredits(id)
        ]);

        setMovie(movieRes.data);
        
        // Filtrar apenas trailers e teasers
        const movieVideos = videosRes.data.results.filter(
          video => video.type === 'Trailer' || video.type === 'Teaser'
        );
        setVideos(movieVideos);
        if (movieVideos.length > 0) {
          setSelectedTrailer(movieVideos[0]);
        }
        
        // Provedores do Brasil
        const brProviders = providersRes.data.results?.BR;
        setProviders(brProviders);
        
        setReviews(reviewsRes.data.results.slice(0, 5));
        setSimilarMovies(similarRes.data.results.slice(0, 10));
        
        // Elenco principal (primeiros 10)
        const mainCast = creditsRes.data.cast.slice(0, 10);
        setCast(mainCast);
        
      } catch (err) {
        console.error("Erro ao carregar filme:", err);
        setError("Não foi possível carregar as informações do filme.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovieData();
  }, [id]);

  const handleWatchlistClick = () => {
    if (inWatchlist) {
      removeFromWatchlist(parseInt(id));
    } else {
      addToWatchlist(movie);
    }
  };

  const getYouTubeUrl = (key) => `https://www.youtube.com/watch?v=${key}`;
  const getYouTubeEmbedUrl = (key) => `https://www.youtube.com/embed/${key}?autoplay=1`;

  if (loading) return <LoadingSpinner />;
  if (error || !movie) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 text-xl">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Backdrop com gradiente */}
      {backdropUrl && (
        <div 
          className="h-[600px] w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 -mt-80 relative z-10 pb-20">
        {/* Botão voltar */}
        <button 
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          ← Voltar para Home
        </button>

        {/* Conteúdo principal */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Poster */}
          <div className="flex-shrink-0 lg:w-80">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-xl shadow-2xl w-full"
            />
            
            {/* Botão Watchlist */}
            <button
              onClick={handleWatchlistClick}
              className={`w-full mt-4 px-6 py-3 rounded-lg font-semibold transition-colors ${
                inWatchlist 
                  ? 'bg-zinc-700 hover:bg-zinc-600'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {inWatchlist ? '✓ Na minha lista' : '+ Adicionar à minha lista'}
            </button>
          </div>

          {/* Informações */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-xl text-purple-400 italic mb-6">{movie.tagline}</p>
            )}

            {/* Métricas */}
            <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="text-2xl font-semibold">{movie.vote_average?.toFixed(1)}</span>
                <span className="text-zinc-500">({movie.vote_count?.toLocaleString()} votos)</span>
              </div>
              <span className="text-zinc-500">•</span>
              <span>{movie.release_date?.split('-')[0]}</span>
              <span className="text-zinc-500">•</span>
              <span>{movie.runtime} min</span>
            </div>

            {/* Ações Rápidas - Assistir */}
            {providers && providers.link && (
              <a 
                href={providers.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors mb-8"
              >
                🎬 Assistir Agora
              </a>
            )}

            {/* Tabs */}
            <div className="border-b border-zinc-800 mb-6">
              <div className="flex gap-6">
                {['overview', 'trailers', 'cast', 'reviews', 'providers'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 capitalize transition-colors ${
                      activeTab === tab 
                        ? 'text-purple-500 border-b-2 border-purple-500' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab === 'overview' && 'Sinopse'}
                    {tab === 'trailers' && 'Trailers'}
                    {tab === 'cast' && 'Elenco'}
                    {tab === 'reviews' && 'Avaliações'}
                    {tab === 'providers' && 'Onde Assistir'}
                  </button>
                ))}
              </div>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="min-h-[400px]">
              {activeTab === 'overview' && (
                <div>
                  <p className="text-lg leading-relaxed text-zinc-300">
                    {movie.overview}
                  </p>
                  
                  {/* Gêneros */}
                  <div className="flex flex-wrap gap-3 mt-8">
                    {movie.genres?.map((genre) => (
                      <span 
                        key={genre.id}
                        className="px-4 py-1.5 bg-zinc-800 rounded-full text-sm hover:bg-zinc-700 transition-colors cursor-pointer"
                        onClick={() => navigate(`/?genre=${genre.id}`)}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'trailers' && (
                <div className="space-y-6">
                  {videos.length === 0 ? (
                    <p className="text-zinc-400 text-center py-12">
                      Nenhum trailer disponível no momento.
                    </p>
                  ) : (
                    <>
                      {/* Trailer principal */}
                      {selectedTrailer && (
                        <div className="aspect-video rounded-xl overflow-hidden">
                          <iframe
                            src={getYouTubeEmbedUrl(selectedTrailer.key)}
                            title={selectedTrailer.name}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      )}
                      
                      {/* Lista de trailers */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {videos.map(video => (
                          <button
                            key={video.id}
                            onClick={() => setSelectedTrailer(video)}
                            className={`p-3 rounded-lg text-left transition-colors ${
                              selectedTrailer?.id === video.id
                                ? 'bg-purple-600'
                                : 'bg-zinc-800 hover:bg-zinc-700'
                            }`}
                          >
                            <div className="font-medium">{video.name}</div>
                            <div className="text-sm text-zinc-400">{video.type}</div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'cast' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {cast.map(actor => (
                    <div key={actor.cast_id} className="bg-zinc-900 rounded-lg overflow-hidden">
                      <img 
                        src={actor.profile_path 
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : 'https://via.placeholder.com/185x278?text=Sem+Imagem'
                        }
                        alt={actor.name}
                        className="w-full aspect-[2/3] object-cover"
                      />
                      <div className="p-3">
                        <div className="font-semibold text-sm">{actor.name}</div>
                        <div className="text-xs text-zinc-400">{actor.character}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-zinc-400 text-center py-12">
                      Nenhuma avaliação disponível no momento.
                    </p>
                  ) : (
                    reviews.map(review => (
                      <div key={review.id} className="bg-zinc-900 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={review.author_details.avatar_path 
                              ? `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
                              : 'https://via.placeholder.com/45?text=User'
                            }
                            alt={review.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold">{review.author}</div>
                            <div className="text-sm text-zinc-400">
                              {new Date(review.created_at).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          {review.author_details.rating && (
                            <div className="ml-auto flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span>{review.author_details.rating}/10</span>
                            </div>
                          )}
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                          {review.content.length > 500 
                            ? `${review.content.substring(0, 500)}...` 
                            : review.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'providers' && (
                <div className="space-y-6">
                  {!providers ? (
                    <p className="text-zinc-400 text-center py-12">
                      Informações de streaming não disponíveis para o Brasil no momento.
                    </p>
                  ) : (
                    <div className="grid gap-6">
                      {/* Streaming */}
                      {providers.flatrate && (
                        <div className="bg-zinc-900 rounded-lg p-6">
                          <h3 className="text-xl font-semibold mb-4">📺 Streaming</h3>
                          <div className="flex flex-wrap gap-4">
                            {providers.flatrate.map(provider => (
                              <div key={provider.provider_id} className="text-center">
                                <img 
                                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                                  alt={provider.provider_name}
                                  className="w-16 h-16 rounded-lg mb-2"
                                />
                                <div className="text-sm">{provider.provider_name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aluguel */}
                      {providers.rent && (
                        <div className="bg-zinc-900 rounded-lg p-6">
                          <h3 className="text-xl font-semibold mb-4">💰 Aluguel</h3>
                          <div className="flex flex-wrap gap-4">
                            {providers.rent.map(provider => (
                              <div key={provider.provider_id} className="text-center">
                                <img 
                                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                                  alt={provider.provider_name}
                                  className="w-16 h-16 rounded-lg mb-2"
                                />
                                <div className="text-sm">{provider.provider_name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Compra */}
                      {providers.buy && (
                        <div className="bg-zinc-900 rounded-lg p-6">
                          <h3 className="text-xl font-semibold mb-4">🛒 Comprar</h3>
                          <div className="flex flex-wrap gap-4">
                            {providers.buy.map(provider => (
                              <div key={provider.provider_id} className="text-center">
                                <img 
                                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                                  alt={provider.provider_name}
                                  className="w-16 h-16 rounded-lg mb-2"
                                />
                                <div className="text-sm">{provider.provider_name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {providers.link && (
                        <div className="text-center">
                          <a 
                            href={providers.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                          >
                            Ver todas as opções →
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filmes similares */}
        {similarMovies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">🎬 Filmes Similares</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarMovies.map(movie => (
                <div 
                  key={movie.id} 
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="cursor-pointer group"
                >
                  <img 
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                      : 'https://via.placeholder.com/300x450?text=Sem+Imagem'
                    }
                    alt={movie.title}
                    className="rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {movie.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}