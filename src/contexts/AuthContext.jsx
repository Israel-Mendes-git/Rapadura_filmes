// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Restaurar usuário do token
      try {
        const userData = JSON.parse(atob(token));
        setUser(userData);
      } catch (e) {
        console.error('Erro ao restaurar usuário:', e);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      // Verificar se usuário já existe
      const checkResponse = await api.get(`/users?email=${email}`);
      
      if (checkResponse.data.length > 0) {
        return { success: false, error: 'E-mail já cadastrado' };
      }
      
      // Criar novo usuário
      const response = await api.post('/users', {
        name,
        email,
        password,
        watchlist: []
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, error: 'Erro ao cadastrar' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.get(`/users?email=${email}`);
      const users = response.data;
      
      if (users.length === 0) {
        return { success: false, error: 'Usuário não encontrado' };
      }
      
      const user = users[0];
      
      if (user.password !== password) {
        return { success: false, error: 'Senha incorreta' };
      }
      
      // Criar token simples
      const token = btoa(JSON.stringify({ id: user.id, email: user.email, name: user.name }));
      localStorage.setItem('token', token);
      setUser({ id: user.id, email: user.email, name: user.name });
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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