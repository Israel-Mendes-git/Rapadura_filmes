import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaList, FaCompass, FaSun, FaMoon, FaLanguage, FaBuilding } from 'react-icons/fa';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo_verde_transparente.png" 
              alt="Rapadura Filmes" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex gap-4 items-center">
            <Link 
              to="/studio" 
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <FaBuilding /> {t('studio')}
            </Link>
            <Link 
              to="/discover" 
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <FaCompass /> {t('discover')}
            </Link>
            <Link 
              to="/watchlist" 
              className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2"
            >
              <FaList /> {t('watchlist')}
            </Link>
            
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              </div>
            </form>

            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
              >
                <FaLanguage />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <button onClick={() => changeLanguage('pt')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">🇧🇷 Português</button>
                  <button onClick={() => changeLanguage('en')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">🇺🇸 English</button>
                  <button onClick={() => changeLanguage('es')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">🇪🇸 Español</button>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}