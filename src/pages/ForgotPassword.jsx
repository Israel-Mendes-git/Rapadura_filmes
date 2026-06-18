import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/forgot-password', { email });
      setMessage(response.data.message);
    } catch {
      setError(t('forgotPassword.sendError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-cinema-surface rounded-card-lg shadow-lg dark:shadow-glow border border-transparent dark:border-white/5 p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo_filmerama_Final.png" alt="Filmerama" className="h-16 w-auto" />
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">{t('forgotPassword.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('forgotPassword.subtitle')}
          </p>
        </div>

        {message && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-500/40 text-green-700 dark:text-green-400 px-4 py-3 rounded-card mb-4">
            {t('forgotPassword.success')}
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-accent-red/10 border border-red-400 dark:border-accent-red/40 text-red-700 dark:text-accent-red px-4 py-3 rounded-card mb-4">
            {t('forgotPassword.error')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-cinema-elevated border border-gray-300 dark:border-white/10 rounded-card focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-accent-purple dark:focus:border-accent-purple transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder={t('forgotPassword.email')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 dark:bg-accent-purple dark:hover:bg-amber-500 dark:text-cinema-bg dark:shadow-glow text-white rounded-card font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? t('forgotPassword.sending') : t('forgotPassword.button')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 dark:text-accent-purple dark:hover:text-amber-400">
            <ArrowLeft className="h-4 w-4" />
            {t('forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
