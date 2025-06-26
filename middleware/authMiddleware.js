const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  // Получаем токен из заголовков
  const token = req.header('x-auth-token');

  // Проверяем наличие токена
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }

  try {
    // Верифицируем токен
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Недействительный токен:', err);
    res.status(401).json({ message: 'Недействительный токен' });
  }
};