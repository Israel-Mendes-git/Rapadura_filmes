// src/pages/admin/AdminLayout.jsx
// Casca do painel de admin: cabeçalho + navegação por abas (Filmes / Games).
// As páginas filhas são renderizadas via <Outlet/> do react-router.
import { NavLink, Outlet } from 'react-router-dom';
import { FaFilm, FaGamepad } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function AdminLayout() {
  const { t } = useTranslation();
  const tabClass = ({ isActive }) =>
    `pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
      isActive
        ? 'border-b-2 border-purple-600 text-purple-600 dark:border-accent-amber dark:text-accent-amber'
        : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-accent-amber'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display tracking-tight mb-1 dark:text-white">{t('admin.panelTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('admin.panelSubtitle')}
          </p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-white/10">
          <NavLink to="/admin/movies" className={tabClass}>
            <FaFilm /> {t('admin.tabMovies')}
          </NavLink>
          <NavLink to="/admin/games" className={tabClass}>
            <FaGamepad /> {t('admin.tabGames')}
          </NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
