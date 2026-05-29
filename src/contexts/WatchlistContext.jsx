// src/contexts/WatchlistContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (user && user.id) {
      loadWatchlist();
    } else {
      setWatchlist([]);
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      // Usar a rota /api/watchlist
      const response = await api.get('/watchlist');
      setWatchlist(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movie) => {
    if (!user || !user.id) {
      alert('Faça login para adicionar à lista');
      return false;
    }
    
    try {
      // Usar a rota /api/watchlist
      const response = await api.post('/watchlist', { movie });
      setWatchlist([...watchlist, movie]);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      alert('Erro ao adicionar à watchlist');
      return false;
    }
  };

  const removeFromWatchlist = async (movieId) => {
    if (!user || !user.id) return false;
    
    try {
      // Usar a rota /api/watchlist/:movieId
      await api.delete(`/watchlist/${movieId}`);
      setWatchlist(watchlist.filter(m => m.id !== movieId));
      return true;
    } catch (error) {
      console.error('Erro ao remover:', error);
      return false;
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(m => m.id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      loading
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return context;
}