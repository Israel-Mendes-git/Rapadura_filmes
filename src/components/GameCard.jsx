// Capsule de jogo (estilo Steam/Epic): arte landscape 16:9 + nome/plataformas
// embaixo. Identidade da central de jogos: preto + verde (gamer) com toque roxo.
// Navega para /game/:id.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Play } from 'lucide-react';
import { PlatformBadge } from './PlatformBadge';

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Para capsule landscape, prefere backdrop/capa larga; cai no poster se não houver.
  const p = game.backdrop_path || game.capa_wide || game.poster_path || game.capa;
  const imageUrl = !p ? null : (p.startsWith('http') || p.startsWith('/') ? p : '/' + p);
  const showFallback = !imageUrl || imgError;
  const platforms = Array.isArray(game.platforms) ? game.platforms : [];

  return (
    <motion.div
      onClick={() => navigate('/game/' + game.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/game/' + game.id); }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="group relative cursor-pointer overflow-hidden rounded-card bg-cinema-surface
                 ring-1 ring-white/5 shadow-poster transition-shadow
                 hover:ring-accent-green/60 hover:shadow-glow-green-strong"
    >
      {/* Arte landscape 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden">
        {showFallback ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2
                          bg-gradient-to-br from-accent-deep/40 via-cinema-elevated to-black p-3 text-center">
            <Gamepad2 className="h-9 w-9 text-accent-green/80" aria-hidden />
            <span className="line-clamp-2 text-xs font-semibold text-white/90">{game.title}</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={game.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Escurece a base p/ legibilidade + realce no hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Botão "ver jogo" que aparece no hover (vibe de loja) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-green px-4 py-2 text-sm font-bold
                           text-cinema-bg shadow-glow-green">
            <Play className="h-4 w-4 fill-current" /> Ver jogo
          </span>
        </div>

        {/* Badges de plataforma */}
        {platforms.length > 0 && (
          <div className="pointer-events-none absolute right-2 top-2 flex max-w-[80%] flex-wrap justify-end gap-1">
            {platforms.slice(0, 3).map((pl, i) => <PlatformBadge key={i} name={pl} />)}
          </div>
        )}
      </div>

      {/* Rodapé do card: nome + gêneros */}
      <div className="p-3">
        <h3 className="line-clamp-1 font-display text-sm font-semibold tracking-tight text-white
                       transition-colors group-hover:text-accent-green-bright">
          {game.title}
        </h3>
        {Array.isArray(game.genres) && game.genres.length > 0 && (
          <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-zinc-400">
            {game.genres.slice(0, 3).join(' · ')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
