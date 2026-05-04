// Configuração personalizada de filmes
export const movieCategories = [
  {
    id: 'now_playing',
    title: '📽️ Em Cartaz nos Cinemas',
    endpoint: 'now_playing',
    icon: '🎬',
    enabled: true
  },
  {
    id: 'popular',
    title: '🔥 Mais Populares da Semana',
    endpoint: 'popular',
    icon: '🔥',
    enabled: true
  },
  {
    id: 'top_rated',
    title: '⭐ Melhores Avaliados de Todos os Tempos',
    endpoint: 'top_rated',
    icon: '⭐',
    enabled: true
  },
  {
    id: 'upcoming',
    title: '🎬 Próximos Lançamentos',
    endpoint: 'upcoming',
    icon: '📅',
    enabled: true
  }
];

// Você pode adicionar categorias personalizadas
export const customCategories = [
  {
    id: 'action_comedy',
    title: 'Ação e Comédia',
    endpoint: 'discover',
    params: {
      with_genres: '28,35', // Ação e Comédia
      sort_by: 'popularity.desc'
    },
    enabled: false // Ative quando quiser
  },
  {
    id: 'family_friendly',
    title: ' Filmes para Família',
    endpoint: 'discover',
    params: {
      with_genres: '10751', // Família
      'vote_average.gte': 7,
      sort_by: 'vote_average.desc'
    },
    enabled: false
  }
];

// Configuração de ordenação
export const sortOptions = [
  { value: 'popularity.desc', label: 'Mais Popular' },
  { value: 'vote_average.desc', label: 'Melhor Avaliado' },
  { value: 'release_date.desc', label: 'Mais Recente' },
  { value: 'original_title.asc', label: 'Ordem Alfabética' }
];

// Filtros personalizados
export const filters = {
  year: {
    min: 1900,
    max: new Date().getFullYear()
  },
  rating: {
    min: 0,
    max: 10
  }
};
