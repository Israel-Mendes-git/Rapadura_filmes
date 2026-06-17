import axios from 'axios';

// Detecta se está em produção ou desenvolvimento
const isProduction = import.meta.env.PROD;

// Em produção, usa o domínio; em desenvolvimento, usa localhost.
// O backend de dev pode rodar numa porta alternativa: defina VITE_API_URL
// no .env (ex.: http://localhost:3010/api). O comportamento de PRODUÇÃO
// não muda — continua usando '/api'.
const API_URL = isProduction
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api');
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  // Envia/recebe o cookie httpOnly de sessão (o token não fica mais no localStorage)
  withCredentials: true,
});

// Interceptor para tratamento de erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sessão inválida/expirada: limpa os dados de UI e manda pro login
      localStorage.removeItem('user');
      // Evita loop de redirecionamento se já estiver na tela de login
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
