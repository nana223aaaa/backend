const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Включаем CORS для всех запросов
app.use(cors());

// Парсинг JSON в запросах
app.use(express.json());

// Роут для проверки работы сервера
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Бэкенд Роснефть | Документы профсоюза</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 30px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          max-width: 600px;
        }
        .logo {
          max-width: 200px;
          margin: 0 auto 20px;
        }
        h1 {
          color: #010101;
          margin-bottom: 20px;
        }
        .status {
          color: #4caf50;
          font-weight: bold;
          font-size: 1.2em;
          margin: 20px 0;
        }
        .links {
          margin-top: 25px;
          text-align: left;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
        }
        .btn {
          display: inline-block;
          background-color: #fbba06;
          color: #010101;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          margin: 10px;
          transition: all 0.3s;
        }
        .btn:hover {
          background-color: #e6a800;
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://www.rosneft.ru/static/rosneft_logo_ru.svg" alt="Роснефть" class="logo">
        <h1>Документы профсоюза</h1>
        <div class="status">Бэкенд успешно работает! 🚀</div>
        <p>Сервер готов обрабатывать запросы</p>
        
        <div class="links">
          <h3>Доступные эндпоинты:</h3>
          <ul>
            <li><a href="/documents">GET /documents</a> - список документов</li>
            <li><a href="/uploads/ustav.pdf">GET /uploads/ustav.pdf</a> - Устав профсоюза</li>
            <li><a href="/uploads/dogovor.pdf">GET /uploads/dogovor.pdf</a> - Договор о приёме</li>
            <li><a href="/uploads/pravila.pdf">GET /uploads/pravila.pdf</a> - Правила внутреннего распорядка</li>
          </ul>
        </div>
        
        <a href="http://localhost:5173" class="btn">Перейти к фронтенду</a>
      </div>
    </body>
    </html>
  `);
});

// Роут для получения документов
app.get('/documents', (req, res) => {
  console.log('Запрос на получение документов');
  
  const testDocuments = [
    {
      id: 1,
      title: "Устав профсоюза",
      file_path: "ustav.pdf"
    },
    {
      id: 2,
      title: "Договор о приёме",
      file_path: "dogovor.pdf"
    },
    {
      id: 3,
      title: "Правила внутреннего распорядка",
      file_path: "pravila.pdf"
    }
  ];
  
  res.json(testDocuments);
});

// Обслуживаем статические файлы из папки 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware для принудительного скачивания PDF
app.get('/uploads/:file', (req, res, next) => {
  const file = req.params.file;
  if (file.endsWith('.pdf')) {
    res.setHeader('Content-Disposition', 'attachment; filename=' + file);
  }
  next();
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log('Проверка работы:');
  console.log('  GET /');
  console.log('Документы доступны по:');
  console.log('  GET /documents');
  console.log('Статические файлы:');
  console.log('  GET /uploads/:filename');
});