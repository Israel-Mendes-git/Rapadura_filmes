// src/components/AdminRoute.jsx
// Rota protegida que exige usuário autenticado E administrador.
// A fonte da verdade do papel é o backend (/api/me); o is_admin do
// localStorage é só uma dica para evitar flicker. Sem login -> /login.
// Logado mas sem admin -> mostra "acesso negado" (não vaza a rota).
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function Spinner() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let alive = true;
    if (loading) return;
    if (!user) { setChecking(false); return; }
    // confirma o papel no servidor (cobre tokens antigos sem is_admin no cache)
    api.get('/me')
      .then((r) => { if (alive) setIsAdmin(!!r.data?.is_admin); })
      .catch(() => { if (alive) setIsAdmin(false); })
      .finally(() => { if (alive) setChecking(false); });
    return () => { alive = false; };
  }, [user, loading]);

  if (loading || checking) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Acesso restrito</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Esta área é exclusiva para administradores.
          </p>
        </div>
      </div>
    );
  }
  return children;
}
