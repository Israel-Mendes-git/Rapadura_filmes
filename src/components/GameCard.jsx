// Card de jogo (clona o estilo do MovieCard). Navega para /game/:id.
import { useNavigate } from 'react-router-dom';

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const p = game.poster_path || game.capa;
  const imageUrl = !p
    ? 'https://via.placeholder.com/300x450/2d2d2d/ffffff?text=' + encodeURIComponent(game.title || 'Game')
    : (p.startsWith('http') || p.startsWith('/') ? p : '/' + p);

  return (
    <div
      onClick={() => navigate('/game/' + game.id)}
      className="cursor-pointer group relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 shadow hover:shadow-xl transition-shadow"
    >
      <img src={imageUrl} alt={game.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" loading="lazy" />
      <div className="p-2">
        <h3 className="text-sm font-semibold truncate text-gray-900 dark:text-white">{game.title}</h3>
        {Array.isArray(game.platforms) && game.platforms.length > 0 ? (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{game.platforms.join(' \u00b7 ')}</p>
        ) : null}
      </div>
    </div>
  );
}
