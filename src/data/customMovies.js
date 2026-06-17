// Configuração personalizada de filmes
export const movieCategories = [
  {
    id: 'now_playing',
    title: ' Em Cartaz nos Cinemas',
    endpoint: 'now_playing',
    icon: '',
    enabled: true
  },
  {
    id: 'popular',
    title: ' Mais Populares da Semana',
    endpoint: 'popular',
    icon: '',
    enabled: true
  },
  {
    id: 'top_rated',
    title: ' Melhores Avaliados de Todos os Tempos',
    endpoint: 'top_rated',
    icon: '',
    enabled: true
  },
  {
    id: 'upcoming',
    title: ' Próximos Lançamentos',
    endpoint: 'upcoming',
    icon: '',
    enabled: true
  }
];

// Categorias personalizadas do estúdio
export const customCategories = [
  {
    id: 'jogos',
    title: ' Jogos',
    description: 'Games desenvolvidos pelo estúdio',
    icon: '',
    enabled: true
  },
  {
    id: 'parcerias',
    title: ' Parcerias',
    description: 'Projetos em colaboração com outros estúdios',
    icon: '',
    enabled: true
  },
  {
    id: 'autorais',
    title: 'Autorais',
    description: 'Criações originais do estúdio',
    icon: '',
    enabled: true
  },
  {
    id: 'series',
    title: ' Séries',
    description: 'Séries animadas produzidas pelo estúdio',
    icon: '',
    enabled: true
  },
  {
    id: 'curtas',
    title: ' Curtas',
    description: 'Curtas-metragens originais',
    icon: '',
    enabled: true
  },
  {
    id: 'longas',
    title: ' Longas',
    description: 'Longas-metragens produzidos',
    icon: '',
    enabled: true
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

// Seus filmes personalizados com categorias
export const customMovies = {
  // Filmes em destaque (Hero)
  featured: [
    {
      id: 1001,
      title: "Sofia e o Mundo das Coisas Perdidas",
      overview: "Uma aventura mágica onde Sofia descobre um mundo cheio de coisas perdidas e precisa encontrar o caminho de volta para casa.",
      poster_path: "/images/fulls/thumbs/Sofia.png",
      backdrop_path: "/images/fulls/SofiaPrint.png",
      vote_average: 8.5,
      vote_count: 150,
      release_date: "2024-01-15",
      runtime: 120,
      tagline: "Uma aventura épica!",
      trailerUrl: "/images/fulls/videos/Sofia(Teaser).mp4",
      category: "autorais",
      type: "series",
      isCustom: true
    },
    {
      id: 1002,
      title: "Brawl Stars",
      overview: "Ação e diversão no mundo dos Brawlers! Uma aventura cheia de batalhas emocionantes.",
      poster_path: "/images/fulls/Braw.png",
      backdrop_path: "/images/fulls/Braw.png",
      vote_average: 8.0,
      vote_count: 100,
      release_date: "2024-02-20",
      runtime: 95,
      tagline: "Prepare-se para a batalha!",
      trailerUrl: "/images/fulls/videos/BrawlStars(Cropped).mp4",
      category: "jogos",
      type: "curtas",
      isCustom: true
    }
  ],

  // Lista geral de filmes
  all: []
};

// Função para filtrar filmes por categoria
export const getMoviesByCategory = (category) => {
  if (!category || category === 'all') return customMovies.all;
  return customMovies.all.filter(movie => movie.category === category);
};

// Função para filtrar filmes por tipo (série, curta, longa)
export const getMoviesByType = (type) => {
  if (!type || type === 'all') return customMovies.all;
  return customMovies.all.filter(movie => movie.type === type);
};

// Função para obter estatísticas das categorias
export const getCategoryStats = () => {
  const stats = {};
  customMovies.all.forEach(movie => {
    stats[movie.category] = (stats[movie.category] || 0) + 1;
    stats[movie.type] = (stats[movie.type] || 0) + 1;
  });
  return stats;
};

// Função para adicionar filmes personalizados à lista da API
export const mergeWithApiMovies = (apiMovies, customMoviesList) => {
  const existingIds = new Set(apiMovies.map(m => m.id));
  const newCustomMovies = customMoviesList.filter(m => !existingIds.has(m.id));
  return [...newCustomMovies, ...apiMovies];
};

// Função para substituir completamente
export const replaceWithCustomMovies = (customMoviesList) => {
  return customMoviesList;
};