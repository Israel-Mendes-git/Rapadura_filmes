
import { useState } from 'react';

export default function TrailerModal({ trailerUrl, title, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  if (!trailerUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-purple-400 transition-colors text-2xl"
        >
          ✕ Fechar
        </button>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        <video
          className="w-full rounded-lg shadow-2xl"
          controls
          autoPlay
          onLoadedData={() => setIsLoading(false)}
        >
          <source src={trailerUrl} type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </video>
      </div>
    </div>
  );
}
