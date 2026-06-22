// Casca do SITE (filmes): navbar global + rodapé + voltar-ao-topo. As páginas
// filhas (lazy) entram pelo <Outlet/>, com Suspense/ErrorBoundary próprios para
// que a navbar permaneça visível durante o carregamento de cada chunk.
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import ErrorBoundary from '../components/ErrorBoundary';

function Spinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
    </div>
  );
}

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
