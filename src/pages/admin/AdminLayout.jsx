// src/pages/admin/AdminLayout.jsx
// Casca do painel de admin: cabeçalho + navegação por abas (Filmes / Games).
// As páginas filhas são renderizadas via <Outlet/> do react-router.
import { NavLink, Outlet } from 'react-router-dom';
import { FaFilm, FaGamepad } from 'react-icons/fa';

export default function AdminLayout() {
  const tabClass = ({ isActive }) =>
    `pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
      isActive
        ? 'border-b-2 border-purple-600 text-purple-600'
        : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Painel de Administração</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os filmes próprios e os games do estúdio.
          </p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800">
          <NavLink to="/admin/movies" className={tabClass}>
            <FaFilm /> Filmes
          </NavLink>
          <NavLink to="/admin/games" className={tabClass}>
            <FaGamepad /> Games
          </NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
