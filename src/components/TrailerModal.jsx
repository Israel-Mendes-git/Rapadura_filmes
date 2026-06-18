
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TrailerModal({ trailerUrl, title, onClose }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  if (!trailerUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cinema-bg/95 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-accent-amber transition-colors text-2xl"
        >
          ✕ {t('common.close')}
        </button>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-amber"></div>
          </div>
        )}
        
        <video
          className="w-full rounded-card shadow-2xl dark:shadow-glow"
          controls
          autoPlay
          onLoadedData={() => setIsLoading(false)}
        >
          <source src={trailerUrl} type="video/mp4" />
          {t('common.videoError')}
        </video>
      </div>
    </div>
  );
}
