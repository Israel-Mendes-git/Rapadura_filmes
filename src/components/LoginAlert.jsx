import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LoginAlert({ message }) {
  const { t } = useTranslation();
  const text = message || t('loginAlert.defaultMessage');
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md p-8 bg-white dark:bg-cinema-surface rounded-card-lg shadow-lg dark:shadow-glow border border-transparent dark:border-white/10">
        <img
          src="/icon-192.png"
          alt="Filmerama"
          className="h-14 w-auto mx-auto mb-2 dark:invert"
        />
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
          {t('loginAlert.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {text}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-accent-purple dark:hover:bg-accent-purple/90 dark:text-cinema-bg dark:font-semibold dark:shadow-glow text-white rounded-lg transition-colors"
          >
            {t('loginAlert.loginBtn')}
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-gray-200 dark:bg-cinema-elevated hover:bg-gray-300 dark:hover:bg-cinema-elevated/70 dark:text-gray-200 rounded-lg transition-colors"
          >
            {t('loginAlert.registerBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
}