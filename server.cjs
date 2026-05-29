const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Banco de dados com better-sqlite3
const db = new Database('./filmerama.db');

// Criar tabelas
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

console.log('✅ Banco de dados inicializado');

// Configuração do email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'israelmendesmzs@gmail.com',
    pass: 'egmg xsgm aglm blpq'
  }
});

// Rotas
app.get('/api/users', (req, res) => {
  const { email } = req.query;
  
  if (email) {
    const user = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(email);
    res.json(user ? [user] : []);
  } else {
    const users = db.prepare('SELECT id, name, email FROM users').all();
    res.json(users);
  }
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, password);
    res.json({ id: result.lastInsertRowid, name, email });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.status(400).json({ error: 'E-mail já cadastrado' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Usuário não encontrado' });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  
  db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, token, expires.toISOString());
  
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }
  res.json({ message: 'Logout realizado' });
});

app.get('/api/watchlist', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  
  const session = db.prepare('SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime("now")').get(token);
  if (!session) return res.status(401).json({ error: 'Token inválido' });
  
  const rows = db.prepare('SELECT movie_data FROM watchlist WHERE user_id = ?').all(session.user_id);
  res.json(rows.map(r => JSON.parse(r.movie_data)));
});

app.post('/api/watchlist', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { movie } = req.body;
  
  const session = db.prepare('SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime("now")').get(token);
  if (!session) return res.status(401).json({ error: 'Token inválido' });
  
  try {
    db.prepare('INSERT INTO watchlist (user_id, movie_id, movie_data) VALUES (?, ?, ?)').run(session.user_id, movie.id, JSON.stringify(movie));
    res.json({ message: 'Adicionado à watchlist' });
  } catch (err) {
    res.status(400).json({ error: 'Já na watchlist' });
  }
});

app.delete('/api/watchlist/:movieId', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  const session = db.prepare('SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime("now")').get(token);
  if (!session) return res.status(401).json({ error: 'Token inválido' });
  
  db.prepare('DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?').run(session.user_id, req.params.movieId);
  res.json({ message: 'Removido da watchlist' });
});

// Recuperação de senha
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.json({ message: 'Se o email existir, você receberá um link de recuperação.' });
  }
  
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);
  
  db.prepare('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)').run(email, token, expires.toISOString());
  
  const resetLink = `http://filmerama.com.br/reset-password?token=${token}`;
  
  const mailOptions = {
    from: '"Filmerama" <israelmendesmzs@gmail.com>',
    to: email,
    subject: 'Recuperação de Senha - Filmerama',
    html: `<a href="${resetLink}">Clique aqui para redefinir sua senha</a>`
  };
  
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Erro ao enviar email:', error);
      return res.status(500).json({ error: 'Erro ao enviar email' });
    }
    res.json({ message: 'Email de recuperação enviado!' });
  });
});

app.get('/api/verify-reset-token', (req, res) => {
  const { token } = req.query;
  
  const reset = db.prepare('SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > datetime("now")').get(token);
  if (!reset) {
    return res.status(400).json({ error: 'Token inválido ou expirado' });
  }
  res.json({ valid: true, email: reset.email });
});

app.post('/api/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  
  const reset = db.prepare('SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > datetime("now")').get(token);
  if (!reset) {
    return res.status(400).json({ error: 'Token inválido ou expirado' });
  }
  
  db.prepare('UPDATE users SET password = ? WHERE email = ?').run(newPassword, reset.email);
  db.prepare('UPDATE password_resets SET used = 1 WHERE token = ?').run(token);
  
  res.json({ message: 'Senha redefinida com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});