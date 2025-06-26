const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    // Находим пользователя по email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Проверяем пароль (временная реализация без хеширования)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    // Создаем JWT токен
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Ошибка генерации токена:', err);
          return res.status(500).json({ message: 'Ошибка генерации токена' });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Ошибка при входе:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};