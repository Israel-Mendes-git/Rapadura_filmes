// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import { useAuth } from './contexts/AuthContext';
import { lazyWithRetry } from './lib/lazyWithRetry';

// Layouts (não-lazy: são a casca de cada "mundo").
import SiteLayout from './pages/SiteLayout';
import GamesLayout from './pages/GamesLayout';

// Code-splitting: cada página vira um chunk carregado sob demanda.
// lazyWithRetry recarrega a página uma única vez se o chunk sumir após deploy.
const Home = lazyWithRetry(() => import('./pages/Home'));
const MovieDetails = lazyWithRetry(() => import('./pages/MovieDetails'));
const Search = lazyWithRetry(() => import('./pages/Search'));
const Watchlist = lazyWithRetry(() => import('./pages/Watchlist'));
const Discover = lazyWithRetry(() => import('./pages/Discover'));
const Games = lazyWithRetry(() => import('./pages/Games'));
const GamesCatalog = lazyWithRetry(() => import('./pages/GamesCatalog'));
const GamesLibrary = lazyWithRetry(() => import('./pages/GamesLibrary'));
const GameDetails = lazyWithRetry(() => import('./pages/GameDetails'));
const Download = lazyWithRetry(() => import('./pages/Download'));
const Studio = lazyWithRetry(() => import('./pages/Studio'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Register = lazyWithRetry(() => import('./pages/Register'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));
// Painel de administração (filmes próprios + games)
const AdminLayout = lazyWithRetry(() => import('./pages/admin/AdminLayout'));
const AdminMovies = lazyWithRetry(() => import('./pages/admin/AdminMovies'));
const AdminGames = lazyWithRetry(() => import('./pages/admin/AdminGames'));

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
    <Routes>
      {/* ===== Central de jogos — casca PRÓPRIA (sem a navbar do site) ===== */}
      <Route element={<GamesLayout />}>
        <Route path="/games" element={<Games />} />
        <Route path="/games/catalogo" element={<GamesCatalog />} />
        <Route path="/games/biblioteca" element={<GamesLibrary />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/download" element={<Download />} />
      </Route>

      {/* ===== Site (filmes) — navbar + rodapé globais ===== */}
      <Route element={<SiteLayout />}>
        {/* Públicas (login e registro) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Navegação pública */}
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/search" element={<Search />} />

        {/* Protegida (lista pessoal exige login) */}
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />

        {/* Painel de admin (exige login + is_admin) */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="movies" replace />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="games" element={<AdminGames />} />
        </Route>

        {/* 404 amigável */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
