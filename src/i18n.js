import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {

      // Adicione ao arquivo i18n.js
      login: {
        title: 'Entrar',
        subtitle: 'Faça login para acessar sua conta',
        email: 'E-mail',
        password: 'Senha',
        button: 'Entrar',
        loading: 'Entrando...',
        noAccount: 'Não tem uma conta?',
        register: 'Cadastre-se'
      },
      register: {
        title: 'Cadastrar',
        subtitle: 'Crie sua conta para começar',
        name: 'Nome',
        email: 'E-mail',
        password: 'Senha',
        confirmPassword: 'Confirmar senha',
        button: 'Cadastrar',
        loading: 'Cadastrando...',
        hasAccount: 'Já tem uma conta?',
        login: 'Faça login',
        passwordMismatch: 'As senhas não conferem'
      },
      logout: 'Sair',
      login: 'Entrar',
      register: 'Cadastrar',
      
      // Navegação
      title: 'Rapadura Atômica',
      search: 'Buscar conteúdo...',
      watchlist: 'Minha Lista',
      discover: 'Explorar',
      studio: 'Estúdio',
      about: 'Sobre',
      back: 'Voltar',
      home: 'Início',
      
      // Ações
      watchTrailer: 'Assistir Trailer',
      addToList: 'Adicionar à lista',
      inList: 'Na minha lista',
      removeFromList: 'Remover da lista',
      synopsis: 'Sinopse',
      genres: 'Gêneros',
      
      // Categorias principais
      all: 'Todos',
      autorais: ' Autorais',
      jogos: ' Jogos',
      parcerias: ' Parcerias',
      
      // Tipos de conteúdo
      series: ' Séries',
      curtas: ' Curtas',
      longas: ' Longas',
      
      // Mensagens
      allContent: 'Todo o Conteúdo',
      moviesAvailable: 'conteúdos disponíveis',
      noMoviesFound: 'Nenhum conteúdo encontrado',
      loading: 'Carregando conteúdo...',
      error: 'Erro ao carregar conteúdo',
      contentFound: 'conteúdo encontrado',
      contentsFound: 'conteúdos encontrados',
      
      // Seções da Home
      featured: ' Em Destaque',
      mostRated: ' Mais Avaliados',
      featuredIn: 'Em Destaque -',
      
      // Página de descoberta
      discoverTitle: 'Descobrir Conteúdo',
      filters: 'Filtros',
      clearFilters: 'Limpar filtros',
      categoryFilter: 'Categorias',
      typeFilter: 'Tipos',
      
      // Footer
      footer: {
        about: 'Sobre o Estúdio',
        description: 'Rapadura Atômica é um estúdio de animação e jogos digitais focado em criar experiências únicas e originais.',
        features: 'Conteúdo',
        credits: 'Créditos',
        feature1: 'Animações Originais',
        feature2: 'Jogos Digitais',
        feature3: 'Séries e Curtas',
        feature4: 'Projetos em Parceria',
        tech: 'Tecnologias'
      },
      
      // Estúdio
      studioPage: {
        title: 'Rapadura Atômica',
        subtitle: 'Estúdio de Animação e Jogos Digitais',
        about: 'Sobre o Estúdio',
        clients: 'Clientes & Parceiros',
        contact: 'Contato',
        specialties: 'Especialidades',
        history: 'Histórico',
        structure: 'Estrutura',
        gallery: 'Galeria',
        animation: 'Animação',
        animationDesc: 'Especializados em animação 2D em cut out e animação full.',
        games: 'Jogos Digitais',
        gamesDesc: 'Desenvolvimento em Unity com foco na experiência do player.',
        voiceOver: 'Gravação de Vozes',
        voiceOverDesc: 'Produção e gravação de vozes para personagens.',
        agile: 'Gestão Ágil',
        agileDesc: 'Scrum orientado a resultado com histórico de produtividade.',
        sustainability: 'Sustentabilidade',
        sustainabilityDesc: '100% autosuficiente em energia com usina solar.',
        infrastructure: 'Infraestrutura',
        infrastructureDesc: 'Servidores Xeon e cabine de gravação própria.',
        outsourcing: 'Outsourcing de animação e games',
        outsourcingDesc: 'Atendemos demandas de estúdios parceiros e demais clientes com nosso time formado no Rapadura.',
        schoolProject: 'Projeto Estúdio-Escola',
        labteca: 'LABTECA',
        labtecaDesc: 'Em parceria com o LABTECA oferecemos formação de artistas ilustradores e animadores para a comunidade.',
        address: 'Avenida Chanceler Edson Queiroz 3406 - Altos',
        city: '62850-000 Cascavel/CE',
        cnpj: 'CNPJ: 24.800.280/0001-80',
        copyright: 'Rapadura Atômica Estúdio de Animação e Jogos Digitais Ltda.'
      },
      
      // Watchlist
      watchlistPage: {
        title: 'Minha Lista',
        empty: 'Sua lista está vazia',
        emptyMessage: 'Adicione seus conteúdos favoritos para assistir mais tarde',
        addMore: 'Adicionar mais conteúdos',
        items_one: 'item para assistir',
        items_other: 'itens para assistir'
      },
      
      // Search
      searchPage: {
        title: 'Resultados para',
        noResults: 'Nenhum conteúdo encontrado para',
        backToHome: 'Voltar para Home'
      },
      
      // Movie Details
      details: {
        votes: 'votos',
        minutes: 'min',
        back: 'Voltar',
        watchTrailer: 'Assistir Trailer',
        addToList: 'Adicionar à lista',
        inList: 'Na minha lista',
        moreInfo: 'Mais Informações'
      }
    }
  },
  en: {
    translation: {
      // Navigation
      title: 'Rapadura Atômica',
      search: 'Search content...',
      watchlist: 'My List',
      discover: 'Discover',
      studio: 'Studio',
      about: 'About',
      back: 'Back',
      home: 'Home',
      
      // Actions
      watchTrailer: 'Watch Trailer',
      addToList: 'Add to list',
      inList: 'In my list',
      removeFromList: 'Remove from list',
      synopsis: 'Synopsis',
      genres: 'Genres',
      
      // Main categories
      all: 'All',
      autorais: ' Originals',
      jogos: ' Games',
      parcerias: ' Partnerships',
      
      // Content types
      series: ' Series',
      curtas: ' Shorts',
      longas: ' Features',
      
      // Messages
      allContent: 'All Content',
      moviesAvailable: 'content available',
      noMoviesFound: 'No content found',
      loading: 'Loading content...',
      error: 'Error loading content',
      contentFound: 'content found',
      contentsFound: 'contents found',
      
      // Home sections
      featured: ' Featured',
      mostRated: ' Most Rated',
      featuredIn: 'Featured in -',
      
      // Discover page
      discoverTitle: 'Discover Content',
      filters: 'Filters',
      clearFilters: 'Clear filters',
      categoryFilter: 'Categories',
      typeFilter: 'Types',
      
      // Footer
      footer: {
        about: 'About the Studio',
        description: 'Rapadura Atômica is an animation and digital games studio focused on creating unique and original experiences.',
        features: 'Content',
        credits: 'Credits',
        feature1: 'Original Animations',
        feature2: 'Digital Games',
        feature3: 'Series & Shorts',
        feature4: 'Partnership Projects',
        tech: 'Technologies'
      },
      
      // Studio
      studioPage: {
        title: 'Rapadura Atômica',
        subtitle: 'Animation and Digital Games Studio',
        about: 'About the Studio',
        clients: 'Clients & Partners',
        contact: 'Contact',
        specialties: 'Specialties',
        history: 'History',
        structure: 'Structure',
        gallery: 'Gallery',
        animation: 'Animation',
        animationDesc: 'Specialized in 2D cut-out animation and full animation.',
        games: 'Digital Games',
        gamesDesc: 'Unity development focused on player experience.',
        voiceOver: 'Voice Recording',
        voiceOverDesc: 'Production and voice recording for characters.',
        agile: 'Agile Management',
        agileDesc: 'Result-oriented Scrum with productivity history.',
        sustainability: 'Sustainability',
        sustainabilityDesc: '100% self-sufficient in energy with solar power.',
        infrastructure: 'Infrastructure',
        infrastructureDesc: 'Xeon servers and own recording booth.',
        outsourcing: 'Animation and games outsourcing',
        outsourcingDesc: 'We serve partner studios and clients with our Rapadura-trained team.',
        schoolProject: 'Studio-School Project',
        labteca: 'LABTECA',
        labtecaDesc: 'In partnership with LABTECA, we offer training for illustrators and animators.',
        address: 'Avenida Chanceler Edson Queiroz 3406 - Altos',
        city: '62850-000 Cascavel/CE',
        cnpj: 'CNPJ: 24.800.280/0001-80',
        copyright: 'Rapadura Atômica Animation and Digital Games Studio Ltd.'
      },
      
      // Watchlist
      watchlistPage: {
        title: 'My List',
        empty: 'Your list is empty',
        emptyMessage: 'Add your favorite content to watch later',
        addMore: 'Add more content',
        items_one: 'item to watch',
        items_other: 'items to watch'
      },
      
      // Search
      searchPage: {
        title: 'Results for',
        noResults: 'No content found for',
        backToHome: 'Back to Home'
      },
      
      // Movie Details
      details: {
        votes: 'votes',
        minutes: 'min',
        back: 'Back',
        watchTrailer: 'Watch Trailer',
        addToList: 'Add to list',
        inList: 'In my list',
        moreInfo: 'More Information'
      }
    }
  },
  es: {
    translation: {
      // Navegación
      title: 'Rapadura Atômica',
      search: 'Buscar contenido...',
      watchlist: 'Mi Lista',
      discover: 'Descubrir',
      studio: 'Estudio',
      about: 'Acerca de',
      back: 'Volver',
      home: 'Inicio',
      
      // Acciones
      watchTrailer: 'Ver Trailer',
      addToList: 'Añadir a la lista',
      inList: 'En mi lista',
      removeFromList: 'Eliminar de la lista',
      synopsis: 'Sinopsis',
      genres: 'Géneros',
      
      // Categorías principales
      all: 'Todos',
      autorais: ' Originales',
      jogos: ' Juegos',
      parcerias: ' Alianzas',
      
      // Tipos de contenido
      series: ' Series',
      curtas: ' Cortos',
      longas: ' Largos',
      
      // Mensajes
      allContent: 'Todo el Contenido',
      moviesAvailable: 'contenidos disponibles',
      noMoviesFound: 'No se encontró contenido',
      loading: 'Cargando contenido...',
      error: 'Error al cargar contenido',
      contentFound: 'contenido encontrado',
      contentsFound: 'contenidos encontrados',
      
      // Secciones de inicio
      featured: ' Destacados',
      mostRated: ' Mejor Valorados',
      featuredIn: 'Destacado en -',
      
      // Página de descubrimiento
      discoverTitle: 'Descubrir Contenido',
      filters: 'Filtros',
      clearFilters: 'Limpiar filtros',
      categoryFilter: 'Categorías',
      typeFilter: 'Tipos',
      
      // Footer
      footer: {
        about: 'Sobre el Estudio',
        description: 'Rapadura Atômica es un estudio de animación y juegos digitales enfocado en crear experiencias únicas y originales.',
        features: 'Contenido',
        credits: 'Créditos',
        feature1: 'Animaciones Originales',
        feature2: 'Juegos Digitales',
        feature3: 'Series y Cortos',
        feature4: 'Proyectos en Alianza',
        tech: 'Tecnologías'
      },
      
      // Estudio
      studioPage: {
        title: 'Rapadura Atômica',
        subtitle: 'Estudio de Animación y Juegos Digitales',
        about: 'Sobre el Estudio',
        clients: 'Clientes & Socios',
        contact: 'Contacto',
        specialties: 'Especialidades',
        history: 'Historia',
        structure: 'Estructura',
        gallery: 'Galería',
        animation: 'Animación',
        animationDesc: 'Especializados en animación 2D cut-out y animación full.',
        games: 'Juegos Digitales',
        gamesDesc: 'Desarrollo en Unity enfocado en la experiencia del jugador.',
        voiceOver: 'Grabación de Voces',
        voiceOverDesc: 'Producción y grabación de voces para personajes.',
        agile: 'Gestión Ágil',
        agileDesc: 'Scrum orientado a resultados con historial de productividad.',
        sustainability: 'Sostenibilidad',
        sustainabilityDesc: '100% autosuficiente en energía con panel solar.',
        infrastructure: 'Infraestructura',
        infrastructureDesc: 'Servidores Xeon y cabina de grabación propia.',
        outsourcing: 'Externalización de animación y juegos',
        outsourcingDesc: 'Atendemos las demandas de estudios partners y clientes.',
        schoolProject: 'Proyecto Estudio-Escuela',
        labteca: 'LABTECA',
        labtecaDesc: 'En alianza con LABTECA ofrecemos formación para ilustradores y animadores.',
        address: 'Avenida Chanceler Edson Queiroz 3406 - Altos',
        city: '62850-000 Cascavel/CE',
        cnpj: 'CNPJ: 24.800.280/0001-80',
        copyright: 'Rapadura Atômica Estudio de Animación y Juegos Digitales Ltd.'
      },
      
      // Watchlist
      watchlistPage: {
        title: 'Mi Lista',
        empty: 'Tu lista está vacía',
        emptyMessage: 'Agrega tus contenidos favoritos para ver más tarde',
        addMore: 'Agregar más contenidos',
        items_one: 'contenido para ver',
        items_other: 'contenidos para ver'
      },
      
      // Search
      searchPage: {
        title: 'Resultados para',
        noResults: 'No se encontró contenido para',
        backToHome: 'Volver al Inicio'
      },
      
      // Movie Details
      details: {
        votes: 'votos',
        minutes: 'min',
        back: 'Volver',
        watchTrailer: 'Ver Trailer',
        addToList: 'Añadir a la lista',
        inList: 'En mi lista',
        moreInfo: 'Más Información'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;