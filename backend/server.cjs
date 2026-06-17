const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Caminho do banco e diretórios de mídia (configuráveis por ambiente) ---
// PRODUÇÃO mantém o caminho hardcoded original como default, então o
// comportamento em prod NÃO muda. O ambiente DEV define DB_PATH/UPLOAD_DIR.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "filmerama.db");
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
const BUILDS_DIR = path.join(UPLOAD_DIR, 'builds');   // binários finais dos game builds
const TMP_DIR = path.join(UPLOAD_DIR, 'tmp');         // chunks parciais em andamento
for (const dir of [UPLOAD_DIR, BUILDS_DIR, TMP_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

// --- Headers de segurança (sem dependência externa) ---
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// --- CORS restrito ao domínio de produção ---
const ALLOWED_ORIGINS = [
  'https://filmerama.com',
  'https://www.filmerama.com',
];
// DEV: origens extras (vite) via env EXTRA_ORIGINS (CSV). Prod nao define -> sem efeito.
if (process.env.EXTRA_ORIGINS) {
  for (const o of process.env.EXTRA_ORIGINS.split(',')) {
    const t = o.trim();
    if (t) ALLOWED_ORIGINS.push(t);
  }
}
app.use(cors({
  origin(origin, cb) {
    // permite requests sem Origin (curl, health checks) e origens da allowlist
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Origin não permitida pelo CORS'));
  },
  credentials: true, // necessário para o cookie httpOnly de sessão
}));

app.use(express.json({ limit: '100kb' }));

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    movie_data TEXT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, movie_id)
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
  CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// --- Tabelas do painel de admin (filmes próprios + games + builds) ---
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    sinopse TEXT,
    capa TEXT,                       -- URL/caminho do poster
    backdrop TEXT,                   -- URL/caminho da arte de fundo (opcional)
    ano INTEGER,
    generos TEXT,                    -- JSON string: array de gêneros
    fonte TEXT NOT NULL DEFAULT 'proprio',   -- 'proprio' | 'tmdb'
    tmdb_id INTEGER,                 -- nullable (preenchido quando fonte='tmdb')
    trailer_url TEXT,
    vote_average REAL DEFAULT 0,
    categoria TEXT,                  -- 'autorais' | 'jogos' | 'parcerias' ...
    tipo TEXT,                       -- 'longas' | 'curtas' | 'series' ...
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    capa TEXT,
    generos TEXT,                    -- JSON string: array de gêneros
    status TEXT NOT NULL DEFAULT 'rascunho',  -- 'rascunho' | 'publicado' | 'arquivado'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS game_builds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    plataforma TEXT NOT NULL,        -- 'win' | 'mac' | 'linux' | 'android'
    versao TEXT NOT NULL,            -- semver
    arquivo TEXT,                    -- caminho do binário no servidor
    nome_arquivo TEXT,               -- nome original do arquivo
    tamanho INTEGER,                 -- bytes
    checksum TEXT,                   -- sha256 (calculado no servidor)
    changelog TEXT,
    obrigatorio INTEGER NOT NULL DEFAULT 0,   -- bool: update obrigatório?
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
  );
`);

// --- Migração leve: adiciona is_admin na tabela users se ainda não existir ---
// DECISÃO: optei por uma coluna booleana is_admin em users (em vez de uma
// tabela roles) por simplicidade — o requisito atual só distingue admin/usuário.
const userCols = db.prepare("PRAGMA table_info(users)").all();
if (!userCols.some(c => c.name === 'is_admin')) {
  db.exec("ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0");
  console.log('🔧 Coluna is_admin adicionada à tabela users');
}

console.log('✅ Banco de dados inicializado');

// --- Limpeza de sessões expiradas (na inicialização e a cada hora) ---
function cleanupSessions() {
  try {
    const info = db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
    if (info.changes > 0) console.log(`🧹 ${info.changes} sessão(ões) expirada(s) removida(s)`);
  } catch (err) {
    console.error('Erro ao limpar sessões:', err);
  }
}
cleanupSessions();
setInterval(cleanupSessions, 60 * 60 * 1000).unref();

// --- Rate limiter em memória (sem dependências externas) ---
function rateLimit({ windowMs, max }) {
  const hits = new Map(); // ip -> { count, resetAt }
  // limpeza periódica do mapa
  setInterval(() => {
    const now = Date.now();
    for (const [ip, rec] of hits) if (rec.resetAt <= now) hits.delete(ip);
  }, windowMs).unref();

  return (req, res, next) => {
    const ip = req.headers['x-real-ip'] || req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let rec = hits.get(ip);
    if (!rec || rec.resetAt <= now) {
      rec = { count: 0, resetAt: now + windowMs };
      hits.set(ip, rec);
    }
    rec.count++;
    if (rec.count > max) {
      const retry = Math.ceil((rec.resetAt - now) / 1000);
      res.set('Retry-After', String(retry));
      return res.status(429).json({ error: 'Muitas tentativas. Tente novamente mais tarde.' });
    }
    next();
  };
}

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }); // 10 tentativas / 15 min por IP

// --- Validação de entrada ---
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

// --- Sessão via cookie httpOnly (protege o token contra XSS) com
//     fallback para o header Authorization (compat com clientes antigos) ---
const COOKIE_NAME = 'token';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias (igual à expiração da sessão)
  path: '/',
};
function getToken(req) {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    for (const part of cookieHeader.split(';')) {
      const [k, ...v] = part.trim().split('=');
      if (k === COOKIE_NAME) return decodeURIComponent(v.join('='));
    }
  }
  return req.headers.authorization?.split(' ')[1];
}

function authenticateToken(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    const session = db.prepare("SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime('now')").get(token);
    if (!session) return res.status(401).json({ error: 'Token inválido ou expirado' });
    req.userId = session.user_id;
    next();
  } catch (error) {
    console.error('Erro no authenticateToken:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

// --- Middleware de admin: usar SEMPRE depois de authenticateToken ---
function requireAdmin(req, res, next) {
  try {
    const u = db.prepare('SELECT is_admin FROM users WHERE id = ?').get(req.userId);
    if (!u || !u.is_admin) {
      return res.status(403).json({ error: 'Acesso restrito a administradores' });
    }
    next();
  } catch (error) {
    console.error('Erro no requireAdmin:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

// --- Helpers de validação para o admin ---
const GAME_PLATFORMS = ['win', 'mac', 'linux', 'android'];
const SEMVER_RE = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)*$/;
function toGenresJson(generos) {
  if (Array.isArray(generos)) return JSON.stringify(generos);
  if (typeof generos === 'string' && generos.trim()) {
    return JSON.stringify(generos.split(',').map(s => s.trim()).filter(Boolean));
  }
  return JSON.stringify([]);
}
function parseGenres(row) {
  if (row && typeof row.generos === 'string') {
    try { row.generos = JSON.parse(row.generos); } catch { row.generos = []; }
  }
  return row;
}

app.post('/api/register', authLimiter, (req, res) => {
  const { name, email, password } = req.body || {};
  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
  }
  try {
    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name.trim(), email.trim().toLowerCase(), hash);
    res.status(201).json({ id: result.lastInsertRowid, name: name.trim(), email: email.trim().toLowerCase() });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.status(400).json({ error: 'E-mail já cadastrado' });
    } else {
      console.error('Erro no register:', err);
      res.status(500).json({ error: 'Erro ao cadastrar' });
    }
  }
});

app.post('/api/login', authLimiter, (req, res) => {
  const { email, password } = req.body || {};
  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    // mensagem genérica para não revelar se o e-mail existe
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, token, expires.toISOString());
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, is_admin: !!user.is_admin } });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/logout', authenticateToken, (req, res) => {
  const token = getToken(req);
  try {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.json({ message: 'Logout realizado' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/watchlist', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare('SELECT movie_data FROM watchlist WHERE user_id = ?').all(req.userId);
    res.json(rows.map(r => JSON.parse(r.movie_data)));
  } catch (error) {
    console.error('Erro na watchlist:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/watchlist', authenticateToken, (req, res) => {
  const { movie } = req.body || {};
  if (!movie || (movie.id === undefined || movie.id === null)) {
    return res.status(400).json({ error: 'Dados do filme inválidos' });
  }
  try {
    db.prepare('INSERT INTO watchlist (user_id, movie_id, movie_data) VALUES (?, ?, ?)').run(req.userId, movie.id, JSON.stringify(movie));
    res.json({ message: 'Adicionado à watchlist' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Filme já está na watchlist' });
    }
    console.error('Erro ao adicionar à watchlist:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/watchlist/:movieId', authenticateToken, (req, res) => {
  try {
    const info = db.prepare('DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?').run(req.userId, req.params.movieId);
    if (info.changes === 0) return res.status(404).json({ error: 'Filme não encontrado na watchlist' });
    res.json({ message: 'Removido da watchlist' });
  } catch (error) {
    console.error('Erro ao remover da watchlist:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// NOTA: o endpoint público GET /api/users foi REMOVIDO — ele vazava nome/e-mail
// de todos os usuários sem autenticação.

// =====================================================================
//  SESSÃO ATUAL — o frontend usa isso para descobrir se o usuário é admin
// =====================================================================
app.get('/api/me', authenticateToken, (req, res) => {
  try {
    const u = db.prepare('SELECT id, name, email, is_admin FROM users WHERE id = ?').get(req.userId);
    if (!u) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ id: u.id, name: u.name, email: u.email, is_admin: !!u.is_admin });
  } catch (error) {
    console.error('Erro no /api/me:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================================
//  CATÁLOGO PÚBLICO — filmes próprios (fonte='proprio') para a Home/Discover
//  Formato compatível com o objeto de filme do frontend (poster_path etc.)
// =====================================================================
function movieRowToCatalog(m) {
  let generos = [];
  try { generos = JSON.parse(m.generos || '[]'); } catch { generos = []; }
  return {
    id: m.id,
    title: m.titulo,
    overview: m.sinopse,
    poster_path: m.capa,
    backdrop_path: m.backdrop || m.capa,
    release_date: m.ano ? `${m.ano}-01-01` : '',
    vote_average: m.vote_average || 0,
    vote_count: 0,
    trailerUrl: m.trailer_url || '',
    genres: generos,
    category: m.categoria || 'autorais',
    type: m.tipo || 'longas',
    fonte: m.fonte,
    tmdb_id: m.tmdb_id,
    isCustom: true,
  };
}

app.get('/api/catalog/movies/:id', (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM movies WHERE id = ? AND fonte = 'proprio'").get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Filme nao encontrado' });
    res.json(movieRowToCatalog(row));
  } catch (error) {
    console.error('Erro no /api/catalog/movies/:id:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/catalog/movies', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM movies WHERE fonte = 'proprio' ORDER BY created_at DESC").all();
    res.json(rows.map(movieRowToCatalog));
  } catch (error) {
    console.error('Erro no /api/catalog/movies:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================================
//  ADMIN — FILMES (CRUD)
// =====================================================================
app.get('/api/admin/movies', authenticateToken, requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM movies ORDER BY created_at DESC').all();
    res.json(rows.map(parseGenres));
  } catch (error) {
    console.error('Erro ao listar filmes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/admin/movies/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM movies WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(parseGenres(row));
  } catch (error) {
    console.error('Erro ao buscar filme:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/admin/movies', authenticateToken, requireAdmin, (req, res) => {
  const b = req.body || {};
  if (!isNonEmptyString(b.titulo)) {
    return res.status(400).json({ error: 'O título é obrigatório' });
  }
  const fonte = b.fonte === 'tmdb' ? 'tmdb' : 'proprio';
  try {
    const result = db.prepare(`
      INSERT INTO movies (titulo, sinopse, capa, backdrop, ano, generos, fonte, tmdb_id, trailer_url, vote_average, categoria, tipo)
      VALUES (@titulo, @sinopse, @capa, @backdrop, @ano, @generos, @fonte, @tmdb_id, @trailer_url, @vote_average, @categoria, @tipo)
    `).run({
      titulo: b.titulo.trim(),
      sinopse: b.sinopse || '',
      capa: b.capa || '',
      backdrop: b.backdrop || '',
      ano: b.ano ? parseInt(b.ano, 10) : null,
      generos: toGenresJson(b.generos),
      fonte,
      tmdb_id: fonte === 'tmdb' && b.tmdb_id ? parseInt(b.tmdb_id, 10) : null,
      trailer_url: b.trailer_url || '',
      vote_average: b.vote_average != null ? Number(b.vote_average) : 0,
      categoria: b.categoria || 'autorais',
      tipo: b.tipo || 'longas',
    });
    const row = db.prepare('SELECT * FROM movies WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(parseGenres(row));
  } catch (error) {
    console.error('Erro ao criar filme:', error);
    res.status(500).json({ error: 'Erro ao criar filme' });
  }
});

app.put('/api/admin/movies/:id', authenticateToken, requireAdmin, (req, res) => {
  const b = req.body || {};
  const existing = db.prepare('SELECT * FROM movies WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Filme não encontrado' });
  if (b.titulo !== undefined && !isNonEmptyString(b.titulo)) {
    return res.status(400).json({ error: 'O título não pode ficar vazio' });
  }
  const fonte = b.fonte === 'tmdb' ? 'tmdb' : (b.fonte === 'proprio' ? 'proprio' : existing.fonte);
  try {
    db.prepare(`
      UPDATE movies SET
        titulo=@titulo, sinopse=@sinopse, capa=@capa, backdrop=@backdrop, ano=@ano,
        generos=@generos, fonte=@fonte, tmdb_id=@tmdb_id, trailer_url=@trailer_url,
        vote_average=@vote_average, categoria=@categoria, tipo=@tipo,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=@id
    `).run({
      id: req.params.id,
      titulo: b.titulo !== undefined ? b.titulo.trim() : existing.titulo,
      sinopse: b.sinopse !== undefined ? b.sinopse : existing.sinopse,
      capa: b.capa !== undefined ? b.capa : existing.capa,
      backdrop: b.backdrop !== undefined ? b.backdrop : existing.backdrop,
      ano: b.ano !== undefined ? (b.ano ? parseInt(b.ano, 10) : null) : existing.ano,
      generos: b.generos !== undefined ? toGenresJson(b.generos) : existing.generos,
      fonte,
      tmdb_id: b.tmdb_id !== undefined ? (b.tmdb_id ? parseInt(b.tmdb_id, 10) : null) : existing.tmdb_id,
      trailer_url: b.trailer_url !== undefined ? b.trailer_url : existing.trailer_url,
      vote_average: b.vote_average !== undefined ? Number(b.vote_average) : existing.vote_average,
      categoria: b.categoria !== undefined ? b.categoria : existing.categoria,
      tipo: b.tipo !== undefined ? b.tipo : existing.tipo,
    });
    const row = db.prepare('SELECT * FROM movies WHERE id = ?').get(req.params.id);
    res.json(parseGenres(row));
  } catch (error) {
    console.error('Erro ao atualizar filme:', error);
    res.status(500).json({ error: 'Erro ao atualizar filme' });
  }
});

app.delete('/api/admin/movies/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const info = db.prepare('DELETE FROM movies WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json({ message: 'Filme removido' });
  } catch (error) {
    console.error('Erro ao remover filme:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================================
//  ADMIN — GAMES (CRUD)
// =====================================================================
app.get('/api/admin/games', authenticateToken, requireAdmin, (req, res) => {
  try {
    const games = db.prepare('SELECT * FROM games ORDER BY created_at DESC').all().map(parseGenres);
    // anexa contagem de builds para a listagem
    for (const g of games) {
      g.builds_count = db.prepare('SELECT COUNT(*) AS n FROM game_builds WHERE game_id = ?').get(g.id).n;
    }
    res.json(games);
  } catch (error) {
    console.error('Erro ao listar games:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/admin/games/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game não encontrado' });
    parseGenres(game);
    game.builds = db.prepare('SELECT * FROM game_builds WHERE game_id = ? ORDER BY created_at DESC').all(req.params.id);
    res.json(game);
  } catch (error) {
    console.error('Erro ao buscar game:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/admin/games', authenticateToken, requireAdmin, (req, res) => {
  const b = req.body || {};
  if (!isNonEmptyString(b.titulo)) {
    return res.status(400).json({ error: 'O título é obrigatório' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO games (titulo, descricao, capa, generos, status)
      VALUES (@titulo, @descricao, @capa, @generos, @status)
    `).run({
      titulo: b.titulo.trim(),
      descricao: b.descricao || '',
      capa: b.capa || '',
      generos: toGenresJson(b.generos),
      status: b.status || 'rascunho',
    });
    const row = db.prepare('SELECT * FROM games WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(parseGenres(row));
  } catch (error) {
    console.error('Erro ao criar game:', error);
    res.status(500).json({ error: 'Erro ao criar game' });
  }
});

app.put('/api/admin/games/:id', authenticateToken, requireAdmin, (req, res) => {
  const b = req.body || {};
  const existing = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Game não encontrado' });
  if (b.titulo !== undefined && !isNonEmptyString(b.titulo)) {
    return res.status(400).json({ error: 'O título não pode ficar vazio' });
  }
  try {
    db.prepare(`
      UPDATE games SET
        titulo=@titulo, descricao=@descricao, capa=@capa, generos=@generos,
        status=@status, updated_at=CURRENT_TIMESTAMP
      WHERE id=@id
    `).run({
      id: req.params.id,
      titulo: b.titulo !== undefined ? b.titulo.trim() : existing.titulo,
      descricao: b.descricao !== undefined ? b.descricao : existing.descricao,
      capa: b.capa !== undefined ? b.capa : existing.capa,
      generos: b.generos !== undefined ? toGenresJson(b.generos) : existing.generos,
      status: b.status !== undefined ? b.status : existing.status,
    });
    const row = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
    res.json(parseGenres(row));
  } catch (error) {
    console.error('Erro ao atualizar game:', error);
    res.status(500).json({ error: 'Erro ao atualizar game' });
  }
});

app.delete('/api/admin/games/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    // remove os binários em disco antes de apagar os registros
    const builds = db.prepare('SELECT arquivo FROM game_builds WHERE game_id = ?').all(req.params.id);
    const info = db.prepare('DELETE FROM games WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Game não encontrado' });
    db.prepare('DELETE FROM game_builds WHERE game_id = ?').run(req.params.id); // garante (ON DELETE CASCADE exige FK pragma)
    for (const bld of builds) {
      if (bld.arquivo && fs.existsSync(bld.arquivo)) {
        try { fs.unlinkSync(bld.arquivo); } catch (e) { /* ignora */ }
      }
    }
    res.json({ message: 'Game removido' });
  } catch (error) {
    console.error('Erro ao remover game:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================================
//  ADMIN — GAME BUILDS (metadados CRUD)
//  O binário em si é enviado via upload CHUNKED (rota separada abaixo).
// =====================================================================
app.get('/api/admin/games/:id/builds', authenticateToken, requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM game_builds WHERE game_id = ? ORDER BY created_at DESC').all(req.params.id);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar builds:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/admin/games/:id/builds', authenticateToken, requireAdmin, (req, res) => {
  const b = req.body || {};
  const game = db.prepare('SELECT id FROM games WHERE id = ?').get(req.params.id);
  if (!game) return res.status(404).json({ error: 'Game não encontrado' });
  if (!GAME_PLATFORMS.includes(b.plataforma)) {
    return res.status(400).json({ error: `Plataforma inválida (use: ${GAME_PLATFORMS.join(', ')})` });
  }
  if (!isNonEmptyString(b.versao) || !SEMVER_RE.test(b.versao.trim())) {
    return res.status(400).json({ error: 'Versão deve ser um semver válido (ex.: 1.0.0)' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO game_builds (game_id, plataforma, versao, changelog, obrigatorio)
      VALUES (@game_id, @plataforma, @versao, @changelog, @obrigatorio)
    `).run({
      game_id: req.params.id,
      plataforma: b.plataforma,
      versao: b.versao.trim(),
      changelog: b.changelog || '',
      obrigatorio: b.obrigatorio ? 1 : 0,
    });
    const row = db.prepare('SELECT * FROM game_builds WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(row);
  } catch (error) {
    console.error('Erro ao criar build:', error);
    res.status(500).json({ error: 'Erro ao criar build' });
  }
});

app.put('/api/admin/builds/:buildId', authenticateToken, requireAdmin, (req, res) => {
  const b = req.body || {};
  const existing = db.prepare('SELECT * FROM game_builds WHERE id = ?').get(req.params.buildId);
  if (!existing) return res.status(404).json({ error: 'Build não encontrada' });
  if (b.plataforma !== undefined && !GAME_PLATFORMS.includes(b.plataforma)) {
    return res.status(400).json({ error: `Plataforma inválida (use: ${GAME_PLATFORMS.join(', ')})` });
  }
  if (b.versao !== undefined && (!isNonEmptyString(b.versao) || !SEMVER_RE.test(b.versao.trim()))) {
    return res.status(400).json({ error: 'Versão deve ser um semver válido (ex.: 1.0.0)' });
  }
  try {
    db.prepare(`
      UPDATE game_builds SET
        plataforma=@plataforma, versao=@versao, changelog=@changelog, obrigatorio=@obrigatorio
      WHERE id=@id
    `).run({
      id: req.params.buildId,
      plataforma: b.plataforma !== undefined ? b.plataforma : existing.plataforma,
      versao: b.versao !== undefined ? b.versao.trim() : existing.versao,
      changelog: b.changelog !== undefined ? b.changelog : existing.changelog,
      obrigatorio: b.obrigatorio !== undefined ? (b.obrigatorio ? 1 : 0) : existing.obrigatorio,
    });
    res.json(db.prepare('SELECT * FROM game_builds WHERE id = ?').get(req.params.buildId));
  } catch (error) {
    console.error('Erro ao atualizar build:', error);
    res.status(500).json({ error: 'Erro ao atualizar build' });
  }
});

app.delete('/api/admin/builds/:buildId', authenticateToken, requireAdmin, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM game_builds WHERE id = ?').get(req.params.buildId);
    if (!existing) return res.status(404).json({ error: 'Build não encontrada' });
    db.prepare('DELETE FROM game_builds WHERE id = ?').run(req.params.buildId);
    if (existing.arquivo && fs.existsSync(existing.arquivo)) {
      try { fs.unlinkSync(existing.arquivo); } catch (e) { /* ignora */ }
    }
    res.json({ message: 'Build removida' });
  } catch (error) {
    console.error('Erro ao remover build:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================================
//  ADMIN — UPLOAD CHUNKED do binário de uma build
//  O cliente envia o arquivo em pedaços (chunks), cada um numa requisição.
//  Nunca carregamos o binário inteiro em memória: cada chunk é gravado (append)
//  num arquivo temporário via stream. No último chunk, calculamos o sha256
//  (lendo o arquivo em stream) e movemos para o diretório final.
//
//  Cabeçalhos esperados em cada chunk:
//    X-Upload-Id      : id único da sessão de upload (gerado pelo cliente)
//    X-Chunk-Index    : índice do chunk (0-based)
//    X-Total-Chunks   : total de chunks
//    X-File-Name      : nome original do arquivo
//  Corpo: bytes brutos do chunk (Content-Type: application/octet-stream)
// =====================================================================
const rawChunk = express.raw({ type: 'application/octet-stream', limit: '50mb' }); // 50mb por chunk

function safeUploadId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{8,128}$/.test(id);
}

app.post('/api/admin/builds/:buildId/upload', authenticateToken, requireAdmin, rawChunk, (req, res) => {
  const build = db.prepare('SELECT * FROM game_builds WHERE id = ?').get(req.params.buildId);
  if (!build) return res.status(404).json({ error: 'Build não encontrada' });

  const uploadId = req.headers['x-upload-id'];
  const chunkIndex = parseInt(req.headers['x-chunk-index'], 10);
  const totalChunks = parseInt(req.headers['x-total-chunks'], 10);
  const fileName = (req.headers['x-file-name'] || 'build.bin').toString();

  if (!safeUploadId(uploadId)) return res.status(400).json({ error: 'X-Upload-Id inválido' });
  if (!Number.isInteger(chunkIndex) || chunkIndex < 0) return res.status(400).json({ error: 'X-Chunk-Index inválido' });
  if (!Number.isInteger(totalChunks) || totalChunks <= 0) return res.status(400).json({ error: 'X-Total-Chunks inválido' });
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) return res.status(400).json({ error: 'Chunk vazio' });

  const tmpPath = path.join(TMP_DIR, `${uploadId}.part`);
  try {
    // append do chunk no arquivo temporário (sem manter tudo em memória)
    fs.appendFileSync(tmpPath, req.body);

    // ainda não é o último chunk → confirma recebimento
    if (chunkIndex < totalChunks - 1) {
      return res.json({ ok: true, received: chunkIndex, next: chunkIndex + 1 });
    }

    // último chunk → finaliza: calcula sha256 em stream e move para o destino final
    const finalName = `build_${build.id}_${Date.now()}_${path.basename(fileName).replace(/[^A-Za-z0-9._-]/g, '_')}`;
    const finalPath = path.join(BUILDS_DIR, finalName);

    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(tmpPath);
    stream.on('data', (d) => hash.update(d));
    stream.on('error', (err) => {
      console.error('Erro ao ler tmp para hash:', err);
      res.status(500).json({ error: 'Erro ao finalizar upload' });
    });
    stream.on('end', () => {
      try {
        const checksum = hash.digest('hex');
        const size = fs.statSync(tmpPath).size;
        fs.renameSync(tmpPath, finalPath);
        // remove o binário antigo da build, se existir
        if (build.arquivo && fs.existsSync(build.arquivo)) {
          try { fs.unlinkSync(build.arquivo); } catch (e) { /* ignora */ }
        }
        db.prepare('UPDATE game_builds SET arquivo=?, nome_arquivo=?, tamanho=?, checksum=? WHERE id=?')
          .run(finalPath, path.basename(fileName), size, checksum, build.id);
        res.json({ ok: true, done: true, checksum, tamanho: size, nome_arquivo: path.basename(fileName) });
      } catch (err) {
        console.error('Erro ao finalizar upload:', err);
        res.status(500).json({ error: 'Erro ao finalizar upload' });
      }
    });
  } catch (error) {
    console.error('Erro no upload de chunk:', error);
    res.status(500).json({ error: 'Erro ao gravar chunk' });
  }
});

// =====================================================================
//  DOWNLOAD do binário da build com suporte a HTTP Range (stream)
//  Nunca carrega o arquivo inteiro em memória. Suporta retomada de download
//  e é o que o launcher Electron usará. Protegido por admin por enquanto.
// =====================================================================
app.get('/api/admin/builds/:buildId/download', authenticateToken, requireAdmin, (req, res) => {
  const build = db.prepare('SELECT * FROM game_builds WHERE id = ?').get(req.params.buildId);
  if (!build || !build.arquivo || !fs.existsSync(build.arquivo)) {
    return res.status(404).json({ error: 'Binário da build não encontrado' });
  }
  const stat = fs.statSync(build.arquivo);
  const total = stat.size;
  const downloadName = build.nome_arquivo || path.basename(build.arquivo);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  if (build.checksum) res.setHeader('X-Checksum-Sha256', build.checksum);

  const range = req.headers.range;
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = m && m[1] ? parseInt(m[1], 10) : 0;
    let end = m && m[2] ? parseInt(m[2], 10) : total - 1;
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= total) {
      res.setHeader('Content-Range', `bytes */${total}`);
      return res.status(416).end();
    }
    end = Math.min(end, total - 1);
    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
    res.setHeader('Content-Length', end - start + 1);
    fs.createReadStream(build.arquivo, { start, end }).pipe(res);
  } else {
    res.setHeader('Content-Length', total);
    fs.createReadStream(build.arquivo).pipe(res);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// =====================================================================
//  UPLOAD e serving de imagens de capa/backdrop (admin).
//  Salva em UPLOAD_DIR/images e serve em /api/media/<arquivo> (nginx ja
//  proxia /api -> backend, entao nao precisa mexer no nginx). Persistente
//  (fora do dist), nao some em rebuild do front.
// =====================================================================
const IMAGES_DIR = path.join(UPLOAD_DIR, 'images');
try { fs.mkdirSync(IMAGES_DIR, { recursive: true }); } catch (e) { /* ja existe */ }
app.use('/api/media', express.static(IMAGES_DIR, { maxAge: '7d', index: false, fallthrough: false }));
const IMG_EXT_BY_TYPE = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };
const rawImage = express.raw({ type: (req) => (req.headers['content-type'] || '').startsWith('image/'), limit: '10mb' });
app.post('/api/admin/uploads/image', authenticateToken, requireAdmin, rawImage, (req, res) => {
  const ct = (req.headers['content-type'] || '').split(';')[0].trim();
  const ext = IMG_EXT_BY_TYPE[ct];
  if (!ext) return res.status(400).json({ error: 'Tipo de imagem nao suportado (use png, jpg, webp ou gif)' });
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) return res.status(400).json({ error: 'Imagem vazia' });
  const name = 'img_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  try {
    fs.writeFileSync(path.join(IMAGES_DIR, name), req.body);
    res.json({ ok: true, url: '/api/media/' + name });
  } catch (e) {
    console.error('Erro ao salvar imagem:', e);
    res.status(500).json({ error: 'Falha ao salvar imagem' });
  }
});

// =====================================================================
//  UPLOAD por STREAMING (imagem OU video) com erros explicitos em JSON.
//  Nao segura o arquivo em memoria. Salva em IMAGES_DIR e serve em /api/media.
// =====================================================================
const MEDIA_EXT = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif',
  'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov', 'video/x-matroska': 'mkv', 'video/ogg': 'ogv',
};
const MAX_IMAGE_BYTES = 30 * 1024 * 1024;
const MAX_VIDEO_BYTES = 600 * 1024 * 1024;
const mbOf = (b) => Math.round((b / 1048576) * 10) / 10;
app.post('/api/admin/uploads/media', authenticateToken, requireAdmin, (req, res) => {
  const ct = (req.headers['content-type'] || '').split(';')[0].trim();
  const ext = MEDIA_EXT[ct];
  const isVideo = ct.indexOf('video/') === 0;
  if (!ext) {
    res.status(415).json({ error: 'Tipo nao suportado: ' + (ct || 'desconhecido') + '. Use PNG, JPG, WebP ou GIF (imagem), ou MP4, WebM ou MOV (video).' }); req.resume(); return;
  }
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  const declared = parseInt(req.headers['content-length'] || '0', 10);
  if (declared && declared > maxBytes) {
    res.status(413).json({ error: (isVideo ? 'Video' : 'Imagem') + ' muito grande: ' + mbOf(declared) + ' MB (maximo ' + mbOf(maxBytes) + ' MB).' }); req.resume(); return;
  }
  const name = (isVideo ? 'vid_' : 'img_') + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  const dest = path.join(IMAGES_DIR, name);
  const ws = fs.createWriteStream(dest);
  let received = 0;
  let done = false;
  const fail = (code, msg) => {
    if (done) return;
    done = true;
    try { ws.destroy(); } catch (e) {}
    fs.unlink(dest, () => {});
    if (!res.headersSent) res.status(code).json({ error: msg });
  };
  req.on('data', (chunk) => {
    received += chunk.length;
    if (received > maxBytes) {
      fail(413, (isVideo ? 'Video' : 'Imagem') + ' muito grande (maximo ' + mbOf(maxBytes) + ' MB).');
      try { req.destroy(); } catch (e) {}
    }
  });
  req.on('error', () => fail(400, 'Erro ao receber o arquivo (conexao interrompida).'));
  ws.on('error', () => fail(500, 'Falha ao salvar o arquivo no servidor.'));
  ws.on('finish', () => {
    if (done) return;
    done = true;
    res.json({ ok: true, url: '/api/media/' + name, tipo: isVideo ? 'video' : 'imagem' });
  });
  req.pipe(ws);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
