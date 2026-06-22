// Casca da CENTRAL DE JOGOS: navbar própria + conteúdo (Outlet) + rodapé enxuto.
// Força o tema escuro na subárvore (wrapper `.dark`, pois darkMode:'class') para
// dar identidade visual própria, independente do tema escolhido no site.
import { Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GamesNavbar from '../components/GamesNavbar';
import ErrorBoundary from '../components/ErrorBoundary';
import { isLauncher } from '../services/launcher';

function GamesSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent-purple"></div>
    </div>
  );
}

export default function GamesLayout() {
  const { t } = useTranslation();
  const inLauncher = isLauncher();
  return (
    <div className="dark">
      <div className="flex min-h-screen flex-col bg-cinema-bg text-zinc-100">
        <GamesNavbar />
        <main className="flex-grow">
          <ErrorBoundary>
            <Suspense fallback={<GamesSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
        <footer className="border-t border-white/10 bg-cinema-bg">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-500 sm:flex-row">
            <span>© Rapadura Filmes — Filmerama Games</span>
            <div className="flex items-center gap-4">
              <Link to="/download" className="hover:text-accent-purple">{t('games.downloadLauncher', 'Baixar Launcher')}</Link>
              {!inLauncher && <Link to="/" className="hover:text-white">Filmerama</Link>}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
