const jwt = require('jsonwebtoken');
const config = require('../config/config'); // или путь к вашему config

module.exports = function(req, res, next) {
    // Получаем токен из заголовка
    const token = req.header('x-auth-token');

    // Проверяем наличие токена
    if (!token) {
        return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }

    try {
        // Верифицируем токен
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Токен недействителен' });
    }
};