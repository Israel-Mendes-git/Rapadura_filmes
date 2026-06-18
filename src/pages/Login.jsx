import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-cinema-surface rounded-card-lg shadow-lg dark:shadow-glow border border-transparent dark:border-white/5 p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo_filmerama_Final.png"
              alt="Rapadura Filmes"
              className="h-16 w-auto object-contain"
            />
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
            {t('login.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('login.subtitle')}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-accent-red/10 border border-red-400 dark:border-accent-red/40 text-red-700 dark:text-accent-red px-4 py-3 rounded-card mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('login.email')}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-cinema-elevated border border-gray-300 dark:border-white/10 rounded-card focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-accent-amber dark:focus:border-accent-amber transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder={t('login.email')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('login.password')}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-cinema-elevated border border-gray-300 dark:border-white/10 rounded-card focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-accent-amber dark:focus:border-accent-amber transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder={t('login.password')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 dark:bg-accent-amber dark:hover:bg-amber-500 dark:text-cinema-bg dark:shadow-glow text-white rounded-card font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? t('login.loading') : t('login.button')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 dark:text-accent-amber dark:hover:text-amber-400 font-semibold">
              {t('login.register')}
            </Link>
          </p>
          {/* Link de recuperação de senha removido: o backend ainda não
              implementa /api/forgot-password (requer configuração de e-mail/SMTP). */}
        </div>
      </div>
    </div>
  );
}
