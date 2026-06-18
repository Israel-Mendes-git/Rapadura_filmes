import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function HeroCarousel({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ⚠️ Todos os hooks ANTES de qualquer early return (React #310).
  const moviesCount = movies?.length ?? 0;

  useEffect(() => {
    if (!isPlaying || moviesCount === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % moviesCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, moviesCount]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex] || movies[0];

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
    <div className="relative h-[78vh] lg:h-[88vh] w-full overflow-hidden bg-cinema-bg">
      {/* Backdrop full-bleed com troca animada (fade/zoom) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentMovie.id ?? currentIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: currentMovie.backdrop_path
              ? `url(${currentMovie.backdrop_path})`
              : 'linear-gradient(135deg, #1c1c1c 0%, #0a0a0a 100%)',
          }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9, ease: 'easeInOut' }, scale: { duration: 6, ease: 'linear' } }}
        />
      </AnimatePresence>

      {/* Scrim gradiente: sobe de #0a0a0a na base e escurece a esquerda p/ legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg/90 via-cinema-bg/40 to-transparent pointer-events-none" />

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-end pb-24 lg:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id ?? currentIndex}
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Badge da categoria - traduzido */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 backdrop-blur-sm border border-white/15 text-white/90">
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

            <h1 className="font-display text-5xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white mb-4 drop-shadow-2xl leading-[0.95]">
              {currentMovie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-accent-purple text-accent-purple" />
                <span className="font-semibold text-white">{currentMovie.vote_average?.toFixed(1)}</span>
              </span>
              {currentMovie.release_date && (
                <span>{currentMovie.release_date.split('-')[0]}</span>
              )}
              {currentMovie.runtime > 0 && (
                <span>{currentMovie.runtime} {t('details.minutes')}</span>
              )}
              <span>
                {currentMovie.type === 'longas' && '🍿 ' + t('longas')}
                {currentMovie.type === 'curtas' && '🎬 ' + t('curtas')}
                {currentMovie.type === 'series' && '📺 ' + t('series')}
              </span>
            </div>

            <p className="text-base lg:text-lg text-white/80 mb-7 line-clamp-3 max-w-xl">
              {currentMovie.overview}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(`/movie/${currentMovie.id}`)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent-purple hover:bg-amber-400 text-cinema-bg rounded-lg font-bold transition-all transform hover:scale-105 shadow-glow"
              >
                <Play className="w-5 h-5 fill-current" />
                {t('details.watchTrailer')}
              </button>
              <button
                onClick={() => navigate(`/movie/${currentMovie.id}`)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg font-semibold transition-all border border-white/25"
              >
                <Info className="w-5 h-5" />
                {t('details.moreInfo') || 'Mais Informações'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots com acento âmbar */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
            className={`transition-all rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-accent-purple'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <button
        onClick={goToPrevious}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full transition-all z-10 border border-white/10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        aria-label="Próximo"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full transition-all z-10 border border-white/10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Progress bar com acento âmbar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-accent-purple transition-all duration-[5000ms] linear"
          style={{ width: isPlaying ? '100%' : '0%' }}
          key={currentIndex}
        />
      </div>
    </div>
  );
}
