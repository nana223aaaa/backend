const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Укажите путь к файлу базы данных
const dbPath = path.resolve(__dirname, 'database.db');

// Создаем и экспортируем подключение к базе данных
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к SQLite:', err.message);
  } else {
    console.log('Успешное подключение к SQLite базе данных');
    initializeDatabase();
  }
});

// Функция для инициализации базы данных (создание таблиц)
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      employeeId TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      division TEXT NOT NULL,
      position TEXT NOT NULL,
      role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Ошибка при создании таблицы users:', err.message);
    } else {
      console.log('Таблица users готова');
    }
  });
}

module.exports = db;