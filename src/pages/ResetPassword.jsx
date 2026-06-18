import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // ✅ APENAS UMA VEZ

  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      setError(t('resetPassword.invalidToken'));
      return;
    }

    api.get(`/verify-reset-token?token=${token}`)
      .then(() => setValidToken(true))
      .catch(() => setError(t('resetPassword.invalidToken')));
  }, [token, t]); // ✅ ADICIONAR 't' NAS DEPENDÊNCIAS

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(t('resetPassword.mismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('resetPassword.minLength'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/reset-password', { token, newPassword: password });
      setMessage(t('resetPassword.success'));
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      setError(t('resetPassword.error') || t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  if (!validToken && !error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-accent-amber"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-cinema-surface rounded-card-lg shadow-lg dark:shadow-glow border border-transparent dark:border-white/5 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">{t('resetPassword.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('resetPassword.subtitle')}
          </p>
        </div>

        {message && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-500/40 text-green-700 dark:text-green-400 px-4 py-3 rounded-card mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-accent-red/10 border border-red-400 dark:border-accent-red/40 text-red-700 dark:text-accent-red px-4 py-3 rounded-card mb-4">
            {error}
          </div>
        )}

        {validToken && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('resetPassword.password')}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-cinema-elevated border border-gray-300 dark:border-white/10 rounded-card focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-accent-amber dark:focus:border-accent-amber transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('resetPassword.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-cinema-elevated border border-gray-300 dark:border-white/10 rounded-card focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-accent-amber dark:focus:border-accent-amber transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 dark:bg-accent-amber dark:hover:bg-amber-500 dark:text-cinema-bg dark:shadow-glow text-white rounded-card font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? t('resetPassword.resetting') : t('resetPassword.button')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
