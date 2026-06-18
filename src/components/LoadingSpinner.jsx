import { useTranslation } from 'react-i18next';

export default function LoadingSpinner() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 dark:border-accent-purple"></div>
        <div className="animate-pulse absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 bg-purple-500/20 dark:bg-accent-purple/20 rounded-full"></div>
        </div>
      </div>
      <p className="mt-4 text-gray-500 dark:text-zinc-400 animate-pulse">{t('common.loading')}</p>
    </div>
  );
}