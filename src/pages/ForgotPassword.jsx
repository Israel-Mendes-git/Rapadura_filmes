import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

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
    } catch (err) {
      setError('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo_verde_transparente.png" alt="Filmerama" className="h-16 w-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('forgotPassword.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('forgotPassword.subtitle')}
          </p>
        </div>

        {message && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-4">
            {t('forgotPassword.success')}
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
            {t('forgotPassword.error')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder={t('forgotPassword.email')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? t('forgotPassword.sending') : t('forgotPassword.button')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-purple-600 hover:text-purple-700">
            {t('forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}