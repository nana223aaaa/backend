const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    // Находим пользователя по ID
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Убираем пароль из ответа
    const { password, ...userData } = user;
    res.json(userData);
  } catch (err) {
    console.error('Ошибка при получении профиля:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};