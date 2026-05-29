import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-purple-600 mb-2">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('notFound.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('notFound.subtitle')}
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}
