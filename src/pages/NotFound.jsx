import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center p-4 overflow-hidden dark:bg-cinema-bg">
      {/* Glow âmbar atrás do 404 (apenas no dark) */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-accent-amber/10 blur-3xl"></div>
      </div>

      <div className="relative text-center max-w-md">
        <img
          src="/icon-192.png"
          alt="Filmerama"
          className="h-14 w-auto mx-auto mb-4 dark:invert"
        />
        <div className="font-display text-8xl font-extrabold tracking-tighter text-purple-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-accent-amber dark:to-accent-red mb-2">
          404
        </div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          {t('notFound.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('notFound.subtitle')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-accent-amber dark:hover:bg-amber-500 dark:text-cinema-bg dark:shadow-glow text-white rounded-card font-semibold transition-colors"
        >
          <Home className="h-4 w-4" />
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}
