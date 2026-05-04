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
  all: [
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
    },
    {
      id: 1003,
      title: "Olimpíadas de Tóquio na Globo 2020",
      overview: "Abertura das Olimpíadas 2020 em parceria com Combo Estúdio. Um evento histórico repleto de emoção e celebração.",
      poster_path: "/images/fulls/Olimpiadas.png",
      backdrop_path: "/images/fulls/thumbs/og2021.jpg",
      vote_average: 9.0,
      vote_count: 200,
      release_date: "2021-07-23",
      runtime: 180,
      tagline: "Um momento histórico inesquecível",
      trailerUrl: "/images/fulls/videos/Olimpiadas.mp4",
      category: "parcerias",
      type: "curtas",
      isCustom: true
    },
    {
      id: 1004,
      title: "Mi Amigo El Sol",
      overview: "Uma história inspiradora sobre amizade e descobertas.",
      poster_path: "/images/fulls/AmigoSol.jpg",
      backdrop_path: "/images/fulls/AmigoSol.jpg",
      vote_average: 7.5,
      vote_count: 50,
      release_date: "2024-03-10",
      runtime: 90,
      tagline: "Uma amizade que ilumina",
      trailerUrl: "/images/fulls/videos/MI_AmigoSol(cut).mp4",
      category: "parcerias",
      type: "curtas",
      isCustom: true
    },
    {
      id: 1005,
      title: "Lya Hacking Destiny",
      overview: "Uma jornada emocionante sobre tecnologia e destino.",
      poster_path: "/images/fulls/thumbs/Lya_Thumb.png",
      backdrop_path: "/images/fulls/thumbs/Lya_Thumb.png",
      vote_average: 8.0,
      vote_count: 75,
      release_date: "2024-03-10",
      runtime: 110,
      tagline: "Reescreva seu destino",
      trailerUrl: "/images/fulls/videos/Lia Hacking Destiny (cut).mp4",
      category: "jogos",
      type: "curtas",
      isCustom: true
    },
    {
      id: 1006,
      title: "Dragão e o Poço Encantado",
      overview: "Uma aventura mágica em um mundo de fantasia.",
      poster_path: "/images/fulls/thumbs/DragaoThumb.png",
      backdrop_path: "/images/fulls/thumbs/DragaoThumb.png",
      vote_average: 8.2,
      vote_count: 88,
      release_date: "2024-03-10",
      runtime: 105,
      tagline: "Descubra a magia",
      trailerUrl: "/images/fulls/videos/DRAGAOEOPOCO.mp4",
      category: "parcerias",
      type: "series",
      isCustom: true
    },
    {
      id: 1007,
      title: "Nagylla Coruja",
      overview: "Uma história encantadora sobre sabedoria e amizade.",
      poster_path: "/images/fulls/thumbs/Nagylla.png",
      backdrop_path: "/images/fulls/thumbs/Nagylla.png",
      vote_average: 7.8,
      vote_count: 62,
      release_date: "2024-03-10",
      runtime: 85,
      tagline: "A sabedoria está em voar",
      trailerUrl: "/images/fulls/videos/Nagylla(Cropped).mp4",
      category: "autorais",
      type: "curtas",
      isCustom: true
    },
    {
      id: 1008,
      title: "O Micromundo de Wesley",
      overview: "Seres microscópicos fazem parte de uma sociedade no Micromundo de Weslley.",
      poster_path: "/images/fulls/thumbs/Wesley.png",
      backdrop_path: "/images/fulls/thumbs/ommw.png",
      vote_average: 7.9,
      vote_count: 70,
      release_date: "2024-03-10",
      runtime: 95,
      tagline: "Pequeno mundo, grandes aventuras",
      trailerUrl: "/images/fulls/videos/MicroMundoWesley.mp4",
      category: "autorais",
      type: "series",
      isCustom: true
    },
    {
      id: 1009,
      title: "Homies",
      overview: "",
      poster_path: "/images/fulls/thumbs/Homies.png",
      backdrop_path: "/images/fulls/thumbs/Homies.png",
      vote_average: 7.9,
      vote_count: 70,
      release_date: "2024-03-10",
      runtime: 95,
      tagline: "",
      trailerUrl: "/images/fulls/videos/Homies(Cropped).mp4",
      category: "parcerias",
      type: "curtas",
      isCustom: true
    },
    {
      id: 1010,
      title: "Just King",
      overview: "",
      poster_path: "/images/fulls/thumbs/JK_Thumb.png",
      backdrop_path: "/images/fulls/thumbs/JK_Thumb.png",
      vote_average: 7.9,
      vote_count: 70,
      release_date: "2024-03-10",
      runtime: 95,
      tagline: "",
      trailerUrl: "/images/fulls/videos/Just King (cut).mp4",
      category: "jogos",
      type: "curtas",
      isCustom: true
    },
    {
      id: 1011,
      title: "Unidrama",
      overview: "A saída da adolescência e o novo mundo dos adultos nos esperam com muitos dramas.",
      poster_path: "/images/fulls/thumbs/unidrama.jpg",
      backdrop_path: "/images/fulls/thumbs/unidrama.jpg",
      vote_average: 7.9,
      vote_count: 70,
      release_date: "2024-03-10",
      runtime: 95,
      tagline: "",
      trailerUrl: "/images/fulls/videos/Unidrama(Cropped).mp4",
      category: "autorais",
      type: "series",
      isCustom: true
    },
  ]
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