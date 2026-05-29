// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  "pt": {
    "translation": {
      "forgotPassword": {
        "title": "Esqueceu a senha?",
        "subtitle": "Digite seu email para receber um link de recuperação",
        "email": "E-mail",
        "button": "Enviar link de recuperação",
        "sending": "Enviando...",
        "success": "Email de recuperação enviado! Verifique sua caixa de entrada.",
        "backToLogin": "Voltar para o login",
        "sendError": "Erro ao enviar email de recuperação"
      },
      "resetPassword": {
        "title": "Nova senha",
        "subtitle": "Digite sua nova senha abaixo",
        "password": "Nova senha",
        "confirmPassword": "Confirmar senha",
        "button": "Alterar senha",
        "resetting": "Alterando...",
        "success": "Senha alterada com sucesso! Redirecionando...",
        "invalidToken": "Link inválido ou expirado",
        "mismatch": "As senhas não conferem",
        "minLength": "A senha deve ter pelo menos 6 caracteres"
      },
      "errors": {
        "emailExists": "E-mail já cadastrado",
        "userNotFound": "Usuário não encontrado",
        "wrongPassword": "Senha incorreta",
        "loginError": "Erro ao fazer login",
        "registerError": "Erro ao cadastrar",
        "networkError": "Erro de conexão. Tente novamente."
      },
      "title": "Rapadura Atômica",
      "search": "Buscar conteúdo...",
      "watchlist": "Minha Lista",
      "discover": "Explorar",
      "studio": "Estúdio",
      "about": "Sobre",
      "back": "Voltar",
      "home": "Início",
      "login": {
        "title": "Entrar",
        "subtitle": "Faça login para acessar sua conta",
        "email": "E-mail",
        "password": "Senha",
        "button": "Entrar",
        "loading": "Entrando...",
        "noAccount": "Não tem uma conta?",
        "register": "Cadastre-se"
      },
      "register": {
        "title": "Cadastrar",
        "subtitle": "Crie sua conta para começar",
        "name": "Nome",
        "email": "E-mail",
        "password": "Senha",
        "confirmPassword": "Confirmar senha",
        "button": "Cadastrar",
        "loading": "Cadastrando...",
        "hasAccount": "Já tem uma conta?",
        "login": "Faça login",
        "passwordMismatch": "As senhas não conferem"
      },
      "logout": "Sair",
      "watchTrailer": "Assistir Trailer",
      "addToList": "Adicionar à lista",
      "inList": "Na minha lista",
      "removeFromList": "Remover da lista",
      "synopsis": "Sinopse",
      "genres": "Gêneros",
      "all": "Todos",
      "autorais": "Autorais",
      "jogos": "Jogos",
      "parcerias": "Parcerias",
      "series": "Séries",
      "curtas": "Curtas",
      "longas": "Longas",
      "allContent": "Todo o Conteúdo",
      "moviesAvailable": "conteúdos disponíveis",
      "noMoviesFound": "Nenhum conteúdo encontrado",
      "loading": "Carregando conteúdo...",
      "error": "Erro ao carregar conteúdo",
      "contentFound": "conteúdo encontrado",
      "contentsFound": "conteúdos encontrados",
      "featured": "Em Destaque",
      "mostRated": "Mais Avaliados",
      "discoverTitle": "Descobrir Conteúdo",
      "footer": {
        "about": "Sobre o Estúdio",
        "description": "Rapadura Atômica é um estúdio de animação e jogos digitais focado em criar experiências únicas e originais.",
        "features": "Conteúdo",
        "credits": "Créditos",
        "feature1": "Animações Originais",
        "feature2": "Jogos Digitais",
        "feature3": "Séries e Curtas",
        "feature4": "Projetos em Parceria",
        "tech": "Tecnologias"
      },
      "studioPage": {
        "title": "Rapadura Atômica",
        "subtitle": "Estúdio de Animação e Jogos Digitais",
        "about": "Sobre o Estúdio",
        "clients": "Clientes & Parceiros",
        "contact": "Contato",
        "specialties": "Especialidades",
        "history": "Histórico",
        "structure": "Estrutura",
        "gallery": "Galeria",
        "animation": "Animação",
        "animationDesc": "Especializados em animação 2D em cut out e animação full.",
        "games": "Jogos Digitais",
        "gamesDesc": "Desenvolvimento em Unity com foco na experiência do player.",
        "voiceOver": "Gravação de Vozes",
        "voiceOverDesc": "Produção e gravação de vozes para personagens.",
        "agile": "Gestão Ágil",
        "agileDesc": "Scrum orientado a resultado com histórico de produtividade.",
        "sustainability": "Sustentabilidade",
        "sustainabilityDesc": "100% autosuficiente em energia com usina solar.",
        "infrastructure": "Infraestrutura",
        "infrastructureDesc": "Servidores Xeon e cabine de gravação própria.",
        "outsourcing": "Outsourcing de animação e games",
        "outsourcingDesc": "Atendemos demandas de estúdios parceiros e demais clientes com nosso time formado no Rapadura.",
        "schoolProject": "Projeto Estúdio-Escola",
        "labteca": "LABTECA",
        "labtecaDesc": "Em parceria com o LABTECA oferecemos formação de artistas ilustradores e animadores para a comunidade.",
        "address": "Avenida Chanceler Edson Queiroz 3406 - Altos",
        "city": "62850-000 Cascavel/CE",
        "cnpj": "CNPJ: 24.800.280/0001-80",
        "copyright": "Rapadura Atômica Estúdio de Animação e Jogos Digitais Ltda.",
        "historyDesc1": "Desde 2016 atuamos em diversos projetos, seja publicidade, institucional, ou atendendo a produção de conteúdo original para streaming, cinema, TV e Internet.",
        "historyDesc2": "Estamos sediados em Cascavel, Ceará, 60km de Fortaleza, onde temos o ecosistema perfeito de criação e formação de novos animadores.",
        "record": "Cabine de Gravação",
        "team": "Equipe Rapadura",
        "studioStructure": "Estrutura do Estúdio",
        "location": "Endereço"
      },
      "watchlistPage": {
        "title": "Minha Lista",
        "empty": "Sua lista está vazia",
        "emptyMessage": "Adicione seus conteúdos favoritos para assistir mais tarde",
        "addMore": "Adicionar mais conteúdos",
        "items_one": "item para assistir",
        "items_other": "itens para assistir"
      },
      "searchPage": {
        "title": "Resultados para",
        "noResults": "Nenhum conteúdo encontrado para",
        "backToHome": "Voltar para Home"
      },
      "details": {
        "votes": "votos",
        "minutes": "min",
        "back": "Voltar",
        "watchTrailer": "Assistir Trailer",
        "addToList": "Adicionar à lista",
        "inList": "Na minha lista",
        "moreInfo": "Mais Informações",
        "notFound": "Filme não encontrado",
        "removeFromList": "Remover da lista"
      },
      "common": {
        "loading": "Carregando...",
        "loadingGenres": "Carregando gêneros...",
        "close": "Fechar",
        "videoError": "Seu navegador não suporta vídeos HTML5."
      },
      "watchlistMsg": {
        "loginRequired": "Faça login para adicionar à lista",
        "addError": "Erro ao adicionar à minha lista"
      },
      "loginAlert": {
        "title": "Acesso Restrito",
        "defaultMessage": "Faça login para acessar este recurso",
        "loginBtn": "Fazer Login",
        "registerBtn": "Criar Conta"
      },
      "notFound": {
        "title": "Página não encontrada",
        "subtitle": "A página que você procura não existe ou foi movida.",
        "backHome": "Voltar ao início"
      },
      "filter": {
        "categories": "Categorias",
        "types": "Tipos",
        "active": "Filtros ativos:"
      }
    }
  },
  "en": {
    "translation": {
      "title": "Rapadura Atômica",
      "search": "Search content...",
      "watchlist": "My List",
      "discover": "Discover",
      "studio": "Studio",
      "about": "About",
      "back": "Back",
      "home": "Home",
      "login": {
        "title": "Login",
        "subtitle": "Login to access your account",
        "email": "Email",
        "password": "Password",
        "button": "Login",
        "loading": "Logging in...",
        "noAccount": "Don't have an account?",
        "register": "Sign up"
      },
      "register": {
        "title": "Sign Up",
        "subtitle": "Create your account to get started",
        "name": "Name",
        "email": "Email",
        "password": "Password",
        "confirmPassword": "Confirm password",
        "button": "Sign Up",
        "loading": "Signing up...",
        "hasAccount": "Already have an account?",
        "login": "Login",
        "passwordMismatch": "Passwords do not match"
      },
      "logout": "Logout",
      "watchTrailer": "Watch Trailer",
      "addToList": "Add to list",
      "inList": "In my list",
      "removeFromList": "Remove from list",
      "synopsis": "Synopsis",
      "genres": "Genres",
      "all": "All",
      "autorais": "Originals",
      "jogos": "Games",
      "parcerias": "Partnerships",
      "series": "Series",
      "curtas": "Shorts",
      "longas": "Features",
      "allContent": "All Content",
      "moviesAvailable": "content available",
      "noMoviesFound": "No content found",
      "loading": "Loading content...",
      "error": "Error loading content",
      "contentFound": "content found",
      "contentsFound": "contents found",
      "featured": "Featured",
      "mostRated": "Most Rated",
      "discoverTitle": "Discover Content",
      "footer": {
        "about": "About the Studio",
        "description": "Rapadura Atômica is an animation and digital games studio focused on creating unique and original experiences.",
        "features": "Content",
        "credits": "Credits",
        "feature1": "Original Animations",
        "feature2": "Digital Games",
        "feature3": "Series & Shorts",
        "feature4": "Partnership Projects",
        "tech": "Technologies"
      },
      "studioPage": {
        "title": "Rapadura Atômica",
        "subtitle": "Animation and Digital Games Studio",
        "about": "About the Studio",
        "clients": "Clients & Partners",
        "contact": "Contact",
        "specialties": "Specialties",
        "history": "History",
        "structure": "Structure",
        "gallery": "Gallery",
        "animation": "Animation",
        "animationDesc": "Specialized in 2D cut-out animation and full animation.",
        "games": "Digital Games",
        "gamesDesc": "Unity development focused on player experience.",
        "voiceOver": "Voice Recording",
        "voiceOverDesc": "Production and voice recording for characters.",
        "agile": "Agile Management",
        "agileDesc": "Result-oriented Scrum with productivity history.",
        "sustainability": "Sustainability",
        "sustainabilityDesc": "100% self-sufficient in energy with solar power.",
        "infrastructure": "Infrastructure",
        "infrastructureDesc": "Xeon servers and own recording booth.",
        "outsourcing": "Animation and games outsourcing",
        "outsourcingDesc": "We serve partner studios and clients with our Rapadura-trained team.",
        "schoolProject": "Studio-School Project",
        "labteca": "LABTECA",
        "labtecaDesc": "In partnership with LABTECA, we offer training for illustrators and animators.",
        "address": "Avenida Chanceler Edson Queiroz 3406 - Altos",
        "city": "62850-000 Cascavel/CE",
        "cnpj": "CNPJ: 24.800.280/0001-80",
        "copyright": "Rapadura Atômica Animation and Digital Games Studio Ltd.",
        "historyDesc1": "Since 2016 we have worked on several projects, whether advertising, institutional, or producing original content for streaming, cinema, TV and the Internet.",
        "historyDesc2": "We are based in Cascavel, Ceará, 60km from Fortaleza, where we have the perfect ecosystem for creating and training new animators.",
        "record": "Recording Booth",
        "team": "Rapadura Team",
        "studioStructure": "Studio Structure",
        "location": "Address"
      },
      "watchlistPage": {
        "title": "My List",
        "empty": "Your list is empty",
        "emptyMessage": "Add your favorite content to watch later",
        "addMore": "Add more content",
        "items_one": "item to watch",
        "items_other": "items to watch"
      },
      "searchPage": {
        "title": "Results for",
        "noResults": "No content found for",
        "backToHome": "Back to Home"
      },
      "details": {
        "votes": "votes",
        "minutes": "min",
        "back": "Back",
        "watchTrailer": "Watch Trailer",
        "addToList": "Add to list",
        "inList": "In my list",
        "moreInfo": "More Information",
        "notFound": "Movie not found",
        "removeFromList": "Remove from list"
      },
      "forgotPassword": {
        "title": "Forgot password?",
        "subtitle": "Enter your email to receive a recovery link",
        "email": "Email",
        "button": "Send recovery link",
        "sending": "Sending...",
        "success": "Recovery email sent! Check your inbox.",
        "backToLogin": "Back to login",
        "sendError": "Error sending recovery email"
      },
      "resetPassword": {
        "title": "New password",
        "subtitle": "Enter your new password below",
        "password": "New password",
        "confirmPassword": "Confirm password",
        "button": "Change password",
        "resetting": "Changing...",
        "success": "Password changed successfully! Redirecting...",
        "invalidToken": "Invalid or expired link",
        "mismatch": "Passwords do not match",
        "minLength": "Password must be at least 6 characters"
      },
      "errors": {
        "emailExists": "Email already registered",
        "userNotFound": "User not found",
        "wrongPassword": "Incorrect password",
        "loginError": "Login error",
        "registerError": "Registration error",
        "networkError": "Connection error. Please try again."
      },
      "common": {
        "loading": "Loading...",
        "loadingGenres": "Loading genres...",
        "close": "Close",
        "videoError": "Your browser does not support HTML5 video."
      },
      "watchlistMsg": {
        "loginRequired": "Log in to add to your list",
        "addError": "Error adding to your list"
      },
      "loginAlert": {
        "title": "Restricted Access",
        "defaultMessage": "Log in to access this feature",
        "loginBtn": "Log In",
        "registerBtn": "Create Account"
      },
      "notFound": {
        "title": "Page not found",
        "subtitle": "The page you are looking for does not exist or has been moved.",
        "backHome": "Back to home"
      },
      "filter": {
        "categories": "Categories",
        "types": "Types",
        "active": "Active filters:"
      }
    }
  },
  "es": {
    "translation": {
      "title": "Rapadura Atómica",
      "search": "Buscar contenido...",
      "watchlist": "Mi Lista",
      "discover": "Descubrir",
      "studio": "Estudio",
      "about": "Acerca de",
      "back": "Volver",
      "home": "Inicio",
      "login": {
        "title": "Iniciar Sesión",
        "subtitle": "Inicia sesión para acceder a tu cuenta",
        "email": "Correo electrónico",
        "password": "Contraseña",
        "button": "Iniciar Sesión",
        "loading": "Ingresando...",
        "noAccount": "¿No tienes una cuenta?",
        "register": "Regístrate"
      },
      "register": {
        "title": "Registrarse",
        "subtitle": "Crea tu cuenta para comenzar",
        "name": "Nombre",
        "email": "Correo electrónico",
        "password": "Contraseña",
        "confirmPassword": "Confirmar contraseña",
        "button": "Registrarse",
        "loading": "Registrando...",
        "hasAccount": "¿Ya tienes una cuenta?",
        "login": "Iniciar Sesión",
        "passwordMismatch": "Las contraseñas no coinciden"
      },
      "logout": "Salir",
      "watchTrailer": "Ver Trailer",
      "addToList": "Añadir a la lista",
      "inList": "En mi lista",
      "removeFromList": "Eliminar de la lista",
      "synopsis": "Sinopsis",
      "genres": "Géneros",
      "all": "Todos",
      "autorais": "Originales",
      "jogos": "Juegos",
      "parcerias": "Alianzas",
      "series": "Series",
      "curtas": "Cortos",
      "longas": "Largos",
      "allContent": "Todo el Contenido",
      "moviesAvailable": "contenidos disponibles",
      "noMoviesFound": "No se encontró contenido",
      "loading": "Cargando contenido...",
      "error": "Error al cargar contenido",
      "contentFound": "contenido encontrado",
      "contentsFound": "contenidos encontrados",
      "featured": "Destacados",
      "mostRated": "Mejor Valorados",
      "discoverTitle": "Descubrir Contenido",
      "footer": {
        "about": "Sobre el Estudio",
        "description": "Rapadura Atómica es un estudio de animación y juegos digitales enfocado en crear experiencias únicas y originales.",
        "features": "Contenido",
        "credits": "Créditos",
        "feature1": "Animaciones Originales",
        "feature2": "Juegos Digitales",
        "feature3": "Series y Cortos",
        "feature4": "Proyectos en Alianza",
        "tech": "Tecnologías"
      },
      "studioPage": {
        "title": "Rapadura Atómica",
        "subtitle": "Estudio de Animación y Juegos Digitales",
        "about": "Sobre el Estudio",
        "clients": "Clientes & Socios",
        "contact": "Contacto",
        "specialties": "Especialidades",
        "history": "Historia",
        "structure": "Estructura",
        "gallery": "Galería",
        "animation": "Animación",
        "animationDesc": "Especializados en animación 2D cut-out y animación full.",
        "games": "Juegos Digitales",
        "gamesDesc": "Desarrollo en Unity enfocado en la experiencia del jugador.",
        "voiceOver": "Grabación de Voces",
        "voiceOverDesc": "Producción y grabación de voces para personajes.",
        "agile": "Gestión Ágil",
        "agileDesc": "Scrum orientado a resultados con historial de productividad.",
        "sustainability": "Sostenibilidad",
        "sustainabilityDesc": "100% autosuficiente en energía con panel solar.",
        "infrastructure": "Infraestructura",
        "infrastructureDesc": "Servidores Xeon y cabina de grabación propia.",
        "outsourcing": "Externalización de animación y juegos",
        "outsourcingDesc": "Atendemos las demandas de estudios partners y clientes.",
        "schoolProject": "Proyecto Estudio-Escuela",
        "labteca": "LABTECA",
        "labtecaDesc": "En alianza con LABTECA ofrecemos formación para ilustradores y animadores.",
        "address": "Avenida Chanceler Edson Queiroz 3406 - Altos",
        "city": "62850-000 Cascavel/CE",
        "cnpj": "CNPJ: 24.800.280/0001-80",
        "copyright": "Rapadura Atómica Estudio de Animación y Juegos Digitales Ltd.",
        "historyDesc1": "Desde 2016 hemos trabajado en diversos proyectos, ya sea publicidad, institucional, o produciendo contenido original para streaming, cine, TV e Internet.",
        "historyDesc2": "Estamos ubicados en Cascavel, Ceará, a 60km de Fortaleza, donde tenemos el ecosistema perfecto para la creación y formación de nuevos animadores.",
        "record": "Cabina de Grabación",
        "team": "Equipo Rapadura",
        "studioStructure": "Estructura del Estudio",
        "location": "Dirección"
      },
      "watchlistPage": {
        "title": "Mi Lista",
        "empty": "Tu lista está vacía",
        "emptyMessage": "Agrega tus contenidos favoritos para ver más tarde",
        "addMore": "Agregar más contenidos",
        "items_one": "contenido para ver",
        "items_other": "contenidos para ver"
      },
      "searchPage": {
        "title": "Resultados para",
        "noResults": "No se encontró contenido para",
        "backToHome": "Volver al Inicio"
      },
      "details": {
        "votes": "votos",
        "minutes": "min",
        "back": "Volver",
        "watchTrailer": "Ver Trailer",
        "addToList": "Añadir a la lista",
        "inList": "En mi lista",
        "moreInfo": "Más Información",
        "notFound": "Película no encontrada",
        "removeFromList": "Quitar de la lista"
      },
      "forgotPassword": {
        "title": "¿Olvidaste tu contraseña?",
        "subtitle": "Ingresa tu email para recibir un enlace de recuperación",
        "email": "Correo electrónico",
        "button": "Enviar enlace de recuperación",
        "sending": "Enviando...",
        "success": "¡Email de recuperación enviado! Revisa tu bandeja de entrada.",
        "backToLogin": "Volver al inicio de sesión",
        "sendError": "Error al enviar el email de recuperación"
      },
      "resetPassword": {
        "title": "Nueva contraseña",
        "subtitle": "Ingresa tu nueva contraseña a continuación",
        "password": "Nueva contraseña",
        "confirmPassword": "Confirmar contraseña",
        "button": "Cambiar contraseña",
        "resetting": "Cambiando...",
        "success": "¡Contraseña cambiada con éxito! Redirigiendo...",
        "invalidToken": "Enlace inválido o expirado",
        "mismatch": "Las contraseñas no coinciden",
        "minLength": "La contraseña debe tener al menos 6 caracteres"
      },
      "errors": {
        "emailExists": "Correo electrónico ya registrado",
        "userNotFound": "Usuario no encontrado",
        "wrongPassword": "Contraseña incorrecta",
        "loginError": "Error al iniciar sesión",
        "registerError": "Error al registrarse",
        "networkError": "Error de conexión. Intenta nuevamente."
      },
      "common": {
        "loading": "Cargando...",
        "loadingGenres": "Cargando géneros...",
        "close": "Cerrar",
        "videoError": "Tu navegador no admite videos HTML5."
      },
      "watchlistMsg": {
        "loginRequired": "Inicia sesión para añadir a tu lista",
        "addError": "Error al añadir a tu lista"
      },
      "loginAlert": {
        "title": "Acceso Restringido",
        "defaultMessage": "Inicia sesión para acceder a este recurso",
        "loginBtn": "Iniciar Sesión",
        "registerBtn": "Crear Cuenta"
      },
      "notFound": {
        "title": "Página no encontrada",
        "subtitle": "La página que buscas no existe o ha sido movida.",
        "backHome": "Volver al inicio"
      },
      "filter": {
        "categories": "Categorías",
        "types": "Tipos",
        "active": "Filtros activos:"
      }
    }
  }
};

const SUPPORTED = ['pt', 'en', 'es'];

// Detecta o idioma: 1) preferência salva  2) idioma do navegador  3) pt
function detectLanguage() {
  try {
    const saved = localStorage.getItem('lang');
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch (e) { /* localStorage indisponível */ }
  const browser = ((typeof navigator !== 'undefined' && navigator.language) || 'pt').slice(0, 2).toLowerCase();
  return SUPPORTED.includes(browser) ? browser : 'pt';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: 'pt',
    supportedLngs: SUPPORTED,
    interpolation: {
      escapeValue: false
    }
  });

// Mantém o atributo lang do <html> em sincronia com o idioma (a11y/SEO)
function syncHtmlLang(lng) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
}
syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
