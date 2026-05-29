// src/App.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';

// Code-splitting: cada página vira um chunk carregado sob demanda
const Home = lazy(() => import('./pages/Home'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const Search = lazy(() => import('./pages/Search'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const Discover = lazy(() => import('./pages/Discover'));
const Studio = lazy(() => import('./pages/Studio'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Spinner() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}

// Componente para rotas protegidas (exigem login)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Componente para rotas públicas (não pode acessar se já logado)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* Rotas públicas (login e registro) */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Rotas públicas de navegação (não exigem login) */}
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/search" element={<Search />} />

              {/* Rota protegida (lista pessoal exige login) */}
              <Route path="/watchlist" element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } />

              {/* Página 404 amigável para qualquer rota desconhecida */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
