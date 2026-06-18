// Card de jogo (casa o estilo do MovieCard). Navega para /game/:id.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { PlatformBadge } from './PlatformBadge';

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const p = game.poster_path || game.capa;
  const imageUrl = !p
    ? null
    : (p.startsWith('http') || p.startsWith('/') ? p : '/' + p);
  const showFallback = !imageUrl || imgError;

  const platforms = Array.isArray(game.platforms) ? game.platforms : [];

  return (
    <motion.div
      onClick={() => navigate('/game/' + game.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/game/' + game.id); }}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="group relative cursor-pointer overflow-hidden rounded-card bg-zinc-100 shadow-md
                 ring-1 ring-black/5 hover:shadow-2xl hover:ring-purple-500/40
                 dark:bg-cinema-surface dark:shadow-poster dark:ring-white/5
                 dark:hover:shadow-poster-hover dark:hover:ring-accent-purple/50"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {showFallback ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2
                          bg-gradient-to-br from-purple-700 via-purple-900 to-zinc-900 p-3 text-center">
            <Gamepad2 className="h-10 w-10 text-white/80" aria-hidden />
            <span className="line-clamp-3 text-xs font-semibold text-white/90">{game.title}</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={game.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        {/* Gradiente para legibilidade do titulo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t
                        from-black/90 via-black/20 to-transparent" />

        {/* Badges de plataforma */}
        {platforms.length > 0 && (
          <div className="pointer-events-none absolute right-2 top-2 flex max-w-[80%] flex-wrap justify-end gap-1">
            {platforms.slice(0, 3).map((pl, i) => (
              <PlatformBadge key={i} name={pl} />
            ))}
          </div>
        )}

        {/* Titulo sobre a imagem */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
          <h3 className="line-clamp-2 font-display text-sm font-semibold tracking-tight text-white drop-shadow-md">
            {game.title}
          </h3>
          {Array.isArray(game.genres) && game.genres.length > 0 && (
            <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-purple-200/90
                          dark:text-accent-purple/90">
              {game.genres.slice(0, 3).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
