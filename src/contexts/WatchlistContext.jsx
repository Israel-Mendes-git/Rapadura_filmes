import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isAuthenticated) {
      loadWatchlist();
    } else {
      setWatchlist([]);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const loadWatchlist = async () => {
    try {
      const response = await api.get(`/users/${user.id}`);
      setWatchlist(response.data.watchlist || []);
    } catch (error) {
      console.error('Erro ao carregar watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movie) => {
    if (!isAuthenticated) {
      alert('Faça login para adicionar à lista');
      return false;
    }
    
    try {
      const newWatchlist = [...watchlist, movie];
      await api.patch(`/users/${user.id}`, { watchlist: newWatchlist });
      setWatchlist(newWatchlist);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      return false;
    }
  };

  const removeFromWatchlist = async (movieId) => {
    if (!isAuthenticated) return false;
    
    try {
      const newWatchlist = watchlist.filter(m => m.id !== movieId);
      await api.patch(`/users/${user.id}`, { watchlist: newWatchlist });
      setWatchlist(newWatchlist);
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