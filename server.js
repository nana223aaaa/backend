require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// Создаем папку для загрузок, если её нет
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Разрешаем запросы от фронтенда
app.use(cors());
app.use(express.json());

// Разрешаем доступ к статическим файлам
app.use('/uploads', express.static(uploadsDir));

// Подключаем базу данных SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Успешное подключение к базе данных');
  }
});

// Создаем таблицу для документов
db.run(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Ошибка создания таблицы документов:', err);
  }
});

// Добавляем тестовые документы
db.get("SELECT COUNT(*) as count FROM documents", (err, row) => {
  if (err) return console.error(err);
  
  if (row.count === 0) {
    const stmt = db.prepare("INSERT INTO documents (title, file_path) VALUES (?, ?)");
    stmt.run('Устав профсоюза', 'ustav.pdf');
    stmt.run('Коллективный договор', 'dogovor.pdf');
    stmt.run('Правила внутреннего трудового распорядка', 'pravila.pdf');
    stmt.finalize();
    console.log('Добавлены тестовые документы');
    
    // Создаем пустые тестовые файлы
    ['ustav.pdf', 'dogovor.pdf', 'pravila.pdf'].forEach(file => {
      fs.writeFileSync(path.join(uploadsDir, file), '');
    });
  }
});

// Простой маршрут для проверки
app.get('/', (req, res) => {
  res.send('Сервер бэкенда работает!');
});

// API для получения документов
app.get('/api/documents', (req, res) => {
  db.all('SELECT * FROM documents', [], (err, rows) => {
    if (err) {
      console.error('Ошибка получения документов:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json(rows);
  });
});

// Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`API документов: http://localhost:${PORT}/api/documents`);
  console.log(`Папка загрузок: ${uploadsDir}`);
});