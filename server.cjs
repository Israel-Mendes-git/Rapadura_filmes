const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = 'database.json';

app.use(cors());
app.use(express.json());

// Servir arquivos est?ticos da build do React
app.use(express.static(path.join(__dirname, 'dist')));

// Ler banco de dados
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { users: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler banco:', error);
    return { users: [] };
  }
}

// Salvar banco de dados
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Inicializar banco
if (!fs.existsSync(DB_FILE)) {
  writeDB({ 
    users: [
      {
        id: 1,
        name: 'Admin',
        email: 'admin@teste.com',
        password: '123456',
        watchlist: []
      }
    ] 
  });
  console.log('? Banco de dados criado com usu?rio padr?o!');
}

// Rotas da API
app.get('/api/users', (req, res) => {
  const db = readDB();
  const { email } = req.query;
  
  if (email) {
    const user = db.users.find(u => u.email === email);
    res.json(user ? [user] : []);
  } else {
    res.json(db.users.map(u => ({ id: u.id, name: u.name, email: u.email, watchlist: u.watchlist })));
  }
});

app.get('/api/users/:id', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'Usu?rio n?o encontrado' });
  }
  
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const db = readDB();
  const { name, email, password, watchlist } = req.body;
  
  if (db.users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'E-mail j? cadastrado' });
  }
  
  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    password,
    watchlist: watchlist || []
  };
  
  db.users.push(newUser);
  writeDB(db);
  
  res.status(201).json({ id: newUser.id, name, email, watchlist: newUser.watchlist });
});

app.patch('/api/users/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { watchlist, name, email, password } = req.body;
  
  const userIndex = db.users.findIndex(u => u.id === parseInt(id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usu?rio n?o encontrado' });
  }
  
  if (watchlist !== undefined) db.users[userIndex].watchlist = watchlist;
  if (name !== undefined) db.users[userIndex].name = name;
  if (email !== undefined) db.users[userIndex].email = email;
  if (password !== undefined) db.users[userIndex].password = password;
  
  writeDB(db);
  res.json({ message: 'Atualizado com sucesso', user: db.users[userIndex] });
});

// Para qualquer outra rota, serve o index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
  console.log(` API dispon?vel em http://localhost:${PORT}/api/users`);
  console.log(` Frontend dispon?vel em http://localhost:${PORT}`);
});
