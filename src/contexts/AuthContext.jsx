// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao carregar a página, tenta recuperar os dados do localStorage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Erro ao restaurar usuário:', e);
        localStorage.removeItem('token');
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

      if (response.data.token) {
        const { token, user: userData } = response.data;

        // Salva token e dados do usuário no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      }
      return { success: false, error: 'Erro ao fazer login' };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      if (error.response?.status === 401) {
        return { success: false, error: error.response?.data?.error || 'Usuário ou senha inválidos' };
      }
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Limpa os dados do usuário
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