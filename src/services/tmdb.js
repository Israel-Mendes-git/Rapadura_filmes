// src/services/tmdb.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;     // Vamos configurar depois
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    language: 'pt-BR',
    region: 'BR'
  }
});

// Se estiver usando o Read Access Token (recomendado)
tmdbApi.interceptors.request.use((config) => {
  if (API_KEY) {
    config.headers.Authorization = `Bearer ${API_KEY}`;
  }
  return config;
});

export const getPopularMovies = (page = 1) => 
  tmdbApi.get('/movie/popular', { params: { page } });

export const getNowPlaying = (page = 1) => 
  tmdbApi.get('/movie/now_playing', { params: { page } });

export const getUpcoming = (page = 1) => 
  tmdbApi.get('/movie/upcoming', { params: { page } });

export const getTopRated = (page = 1) => 
  tmdbApi.get('/movie/top_rated', { params: { page } });

export const searchMovies = (query, page = 1) => 
  tmdbApi.get('/search/movie', { 
    params: { query, page } 
  });

export const getMovieDetails = (movieId) => 
  tmdbApi.get(`/movie/${movieId}`, {
    params: { append_to_response: 'videos,credits,similar' }
  });
  // Gêneros de filmes
export const getGenres = () => 
  tmdbApi.get('/genre/movie/list');

// Filmes por gênero
export const getMoviesByGenre = (genreId, page = 1) => 
  tmdbApi.get('/discover/movie', {
    params: { with_genres: genreId, page }
  });

// Trailer do filme
export const getMovieVideos = (movieId) => 
  tmdbApi.get(`/movie/${movieId}/videos`);

// Provedores de streaming por país
export const getMovieProviders = (movieId) => 
  tmdbApi.get(`/movie/${movieId}/watch/providers`);

// Avaliações do filme
export const getMovieReviews = (movieId, page = 1) => 
  tmdbApi.get(`/movie/${movieId}/reviews`, { params: { page } });

// Filmes similares
export const getSimilarMovies = (movieId) => 
  tmdbApi.get(`/movie/${movieId}/similar`);

// Elenco completo
export const getMovieCredits = (movieId) => 
  tmdbApi.get(`/movie/${movieId}/credits`);

// Recomendações baseadas no filme
export const getRecommendations = (movieId) => 
  tmdbApi.get(`/movie/${movieId}/recommendations`);

export default tmdbApi;