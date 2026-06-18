import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getGenres } from '../services/tmdb';

export default function GenreFilter({ selectedGenre, onGenreChange }) {
  const { t } = useTranslation();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await getGenres();
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Erro ao carregar gêneros:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-pulse text-gray-500 dark:text-zinc-400">{t('common.loadingGenres')}</div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onGenreChange(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !selectedGenre
              ? 'bg-purple-600 text-white dark:bg-accent-amber dark:text-cinema-bg dark:font-semibold dark:shadow-glow'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-cinema-surface dark:text-zinc-400 dark:hover:bg-cinema-elevated dark:hover:text-accent-amber'
          }`}
        >
          Todos
        </button>
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => onGenreChange(genre.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedGenre === genre.id
                ? 'bg-purple-600 text-white dark:bg-accent-amber dark:text-cinema-bg dark:font-semibold dark:shadow-glow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-cinema-surface dark:text-zinc-400 dark:hover:bg-cinema-elevated dark:hover:text-accent-amber'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}