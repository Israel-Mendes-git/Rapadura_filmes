// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaList, FaCompass, FaSun, FaMoon, FaLanguage, FaBuilding, FaGamepad, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaUserShield } from 'react-icons/fa';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && user) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    } else if (!user) {
      navigate('/login');
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    try { localStorage.setItem('lang', lng); } catch (e) { /* localStorage indisponível */ }
    setShowLangMenu(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-50/90 dark:bg-cinema-bg/80 backdrop-blur-md text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo - sempre visível */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo_icon_filmerama_white.png" 
              alt="Rapadura Filmes" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex gap-4 items-center">
            {/* Links visíveis apenas para usuários logados */}
            {user && (
              <>
                <Link
                  to="/discover"
                  className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-accent-purple transition-colors flex items-center gap-2"
                >
                  <FaCompass /> {t('discover')}
                </Link>
                <Link
                  to="/watchlist"
                  className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-accent-purple transition-colors flex items-center gap-2"
                >
                  <FaList /> {t('watchlist')}
                </Link>
              </>
            )}
            
            {/* Link Jogos - sempre visivel */}
            <Link
              to="/games"
              className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-accent-purple transition-colors flex items-center gap-2"
            >
              <FaGamepad /> {t('jogos')}
            </Link>

            {/* Link Estúdio - sempre visível */}
            <Link
              to="/studio"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-accent-purple transition-colors flex items-center gap-2"
            >
              <FaBuilding /> {t('studio')}
            </Link>
            
            {/* Busca - escondida se não logado */}
            {user && (
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 px-4 py-2 pl-10 bg-gray-100 dark:bg-cinema-surface border border-gray-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-accent-purple dark:focus:border-accent-purple focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-colors"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
              </form>
            )}

            {/* Menu de idioma - sempre visível */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-cinema-surface hover:bg-gray-200 dark:hover:bg-cinema-elevated dark:hover:text-accent-purple transition-colors text-gray-700 dark:text-gray-200"
              >
                <FaLanguage />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-cinema-elevated rounded-lg shadow-lg dark:shadow-glow border border-gray-200 dark:border-white/10 overflow-hidden z-50">
                  <button onClick={() => changeLanguage('pt')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-cinema-surface dark:hover:text-accent-purple transition-colors">Português</button>
                  <button onClick={() => changeLanguage('en')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-cinema-surface dark:hover:text-accent-purple transition-colors">English</button>
                  <button onClick={() => changeLanguage('es')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-cinema-surface dark:hover:text-accent-purple transition-colors">Español</button>
                  <button onClick={() => changeLanguage('zh')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-cinema-surface dark:hover:text-accent-purple transition-colors">中文 (简体)</button>
                </div>
              )}
            </div>

            {/* Botão de tema - sempre visível */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-cinema-surface hover:bg-gray-200 dark:hover:bg-cinema-elevated transition-colors text-gray-700 dark:text-gray-200"
            >
              {isDark ? <FaSun className="text-accent-purple" /> : <FaMoon />}
            </button>

            {/* Área do usuário */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Link do painel de admin: só aparece para administradores */}
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded-lg bg-purple-100 dark:bg-accent-purple/15 text-purple-700 dark:text-accent-purple hover:bg-purple-200 dark:hover:bg-accent-purple/25 transition-colors flex items-center gap-2 text-sm"
                    title="Painel de Administração"
                  >
                    <FaUserShield /> Admin
                  </Link>
                )}
                <span className="text-gray-700 dark:text-gray-200 flex items-center gap-2 text-sm">
                  <FaUser /> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-cinema-surface hover:bg-gray-200 dark:hover:bg-cinema-elevated dark:hover:text-accent-red transition-colors"
                  title="Sair"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 dark:bg-accent-purple dark:hover:bg-accent-purple/90 dark:text-cinema-bg dark:font-semibold dark:shadow-glow text-white transition-colors flex items-center gap-2 text-sm"
                >
                  <FaSignInAlt /> Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-cinema-surface hover:bg-gray-300 dark:hover:bg-cinema-elevated transition-colors text-gray-700 dark:text-gray-200 flex items-center gap-2 text-sm"
                >
                  <FaUserPlus /> Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}