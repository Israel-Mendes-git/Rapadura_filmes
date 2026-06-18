import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function MovieCarousel({ movies, title, onMovieClick }) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="font-display text-2xl lg:text-3xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
        <span className="inline-block w-1 h-6 lg:h-7 align-middle mr-3 rounded-full bg-accent-purple" />
        {title}
      </h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 }
        }}
        className="pb-12"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div onClick={() => onMovieClick(movie.id)} className="cursor-pointer">
              <MovieCard movie={movie} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
