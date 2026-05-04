import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroCarousel({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, movies.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  return (
    <div className="relative h-[70vh] lg:h-[80vh] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: currentMovie.backdrop_path 
            ? `url(${currentMovie.backdrop_path})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl animate-fade-in">
          {/* Badge da categoria - traduzido */}
          <div className="mb-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold
              ${currentMovie.category === 'autorais' ? 'bg-purple-600 text-white' :
                currentMovie.category === 'jogos' ? 'bg-green-600 text-white' :
                currentMovie.category === 'parcerias' ? 'bg-blue-600 text-white' :
                'bg-gray-600 text-white'}`}>
              <span>
                {currentMovie.category === 'autorais' && '🎨'}
                {currentMovie.category === 'jogos' && '🎮'}
                {currentMovie.category === 'parcerias' && '🤝'}
              </span>
              {currentMovie.category === 'autorais' && t('autorais')}
              {currentMovie.category === 'jogos' && t('jogos')}
              {currentMovie.category === 'parcerias' && t('parcerias')}
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            {currentMovie.title}
          </h1>

          <p className="text-base lg:text-lg text-gray-200 mb-6 line-clamp-3 max-w-xl">
            {currentMovie.overview}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xl">★</span>
              <span className="text-white font-semibold">{currentMovie.vote_average?.toFixed(1)}</span>
            </div>
            {currentMovie.release_date && (
              <span className="text-gray-300">
                {currentMovie.release_date.split('-')[0]}
              </span>
            )}
            {currentMovie.runtime > 0 && (
              <span className="text-gray-300">{currentMovie.runtime} {t('details.minutes')}</span>
            )}
            <span className="text-gray-300">
              {currentMovie.type === 'longas' && '🍿 ' + t('longas')}
              {currentMovie.type === 'curtas' && '🎬 ' + t('curtas')}
              {currentMovie.type === 'series' && '📺 ' + t('series')}
            </span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              ▶ {t('details.watchTrailer')}
            </button>
            <button 
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg font-semibold transition-all border border-white/30"
            >
              {t('details.moreInfo') || 'Mais Informações'}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-purple-600'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-purple-600 transition-all duration-[5000ms] linear"
          style={{ width: isPlaying ? '100%' : '0%' }}
          key={currentIndex}
        />
      </div>
    </div>
  );
}