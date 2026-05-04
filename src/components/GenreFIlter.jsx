
import { useState } from 'react';

// Gêneros estáticos (sem precisar da API)
const staticGenres = [
  { id: 28, name: 'Ação' },
  { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animação' },
  { id: 35, name: 'Comédia' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasia' },
  { id: 27, name: 'Terror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ficção Científica' },
  { id: 9648, name: 'Mistério' },
  { id: 53, name: 'Suspense' }
];

export default function GenreFilter({ selectedGenre, onGenreChange }) {
  const [genres] = useState(staticGenres);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onGenreChange(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !selectedGenre 
              ? 'bg-purple-600 text-white' 
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
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
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}
