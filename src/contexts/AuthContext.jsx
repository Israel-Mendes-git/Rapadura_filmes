// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A sessão é mantida por cookie httpOnly; aqui só restauramos os dados
    // de exibição do usuário (não-sensíveis). Se o cookie estiver expirado,
    // a primeira chamada à API retorna 401 e o interceptor faz logout.
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/register', { name, email, password });
      
      if (response.data.id) {
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Erro ao cadastrar' };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      if (error.response?.status === 400) {
        return { success: false, error: error.response?.data?.error || 'E-mail já cadastrado' };
      }
      return { success: false, error: 'Erro ao cadastrar' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });

      const userData = response.data.user;
      if (userData && userData.id) {
        // O token vem em cookie httpOnly; no localStorage só ficam dados de UI
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Erro ao fazer login' };
    } catch (error) {
      if (error.response?.status === 401) {
        return { success: false, error: error.response?.data?.error || 'Usuário ou senha inválidos' };
      }
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = async () => {
    try {
      // Encerra a sessão no servidor (apaga a sessão e limpa o cookie)
      await api.post('/logout');
    } catch (e) {
      // segue o logout local mesmo se a chamada falhar
    }
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}