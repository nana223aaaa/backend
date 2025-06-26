const sqlite3 = require('sqlite3').verbose();

// Подключение к базе данных
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Успешное подключение к базе данных');
    }
});

module.exports = db;