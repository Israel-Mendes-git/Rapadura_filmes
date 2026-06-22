// Navbar DEDICADA da central de jogos. Identidade própria (estilo loja), sempre
// no tema escuro independente do tema do site, com CTA de download em destaque e
// um caminho de volta para o site de filmes.
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gamepad2, Download, LibraryBig, ArrowLeft, Languages } from 'lucide-react';
import { isLauncher } from '../services/launcher';

export default function GamesNavbar() {
  const { t, i18n } = useTranslation();
  const [showLang, setShowLang] = useState(false);
  // No launcher (Filmerama Games) a navegação é travada só nos jogos: não faz
  // sentido oferecer o caminho de volta ao site de filmes.
  const inLauncher = isLauncher();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    try { localStorage.setItem('lang', lng); } catch { /* indisponível */ }
    setShowLang(false);
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-medium transition-colors ${
      isActive ? 'text-accent-purple' : 'text-zinc-300 hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-cinema-bg/85 text-zinc-100 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        {/* Marca própria */}
        <Link to="/games" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-purple/15 ring-1 ring-accent-purple/30">
            <Gamepad2 className="h-5 w-5 text-accent-purple" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            FILMERAMA <span className="text-accent-purple">GAMES</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-5">
          <NavLink to="/games" end className={linkClass}>
            <Gamepad2 className="h-4 w-4" /> {t('games.navHome', 'Início')}
          </NavLink>
          <NavLink to="/games/catalogo" className={linkClass}>
            <LibraryBig className="h-4 w-4" /> {t('games.navCatalog', 'Catálogo')}
          </NavLink>

          {/* CTA de download em destaque */}
          <Link
            to="/download"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-semibold
                       text-cinema-bg shadow-glow transition-colors hover:bg-amber-400"
          >
            <Download className="h-4 w-4" /> {t('games.downloadLauncher', 'Baixar Launcher')}
          </Link>

          {/* Idioma */}
          <div className="relative">
            <button
              onClick={() => setShowLang(!showLang)}
              className="rounded-lg bg-cinema-surface p-2 text-zinc-300 transition-colors hover:bg-cinema-elevated hover:text-accent-purple"
              aria-label="Idioma"
            >
              <Languages className="h-4 w-4" />
            </button>
            {showLang && (
              <div className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-lg border border-white/10 bg-cinema-elevated shadow-glow">
                <button onClick={() => changeLanguage('pt')} className="block w-full px-4 py-2 text-left text-sm hover:bg-cinema-surface hover:text-accent-purple">Português</button>
                <button onClick={() => changeLanguage('en')} className="block w-full px-4 py-2 text-left text-sm hover:bg-cinema-surface hover:text-accent-purple">English</button>
                <button onClick={() => changeLanguage('es')} className="block w-full px-4 py-2 text-left text-sm hover:bg-cinema-surface hover:text-accent-purple">Español</button>
                <button onClick={() => changeLanguage('zh')} className="block w-full px-4 py-2 text-left text-sm hover:bg-cinema-surface hover:text-accent-purple">中文 (简体)</button>
              </div>
            )}
          </div>

          {/* Voltar ao site de filmes — escondido dentro do launcher (games-only) */}
          {!inLauncher && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {t('games.backToSite', 'Filmerama')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
