const User = require('../models/User');

exports.getProfile = (req, res) => {
    // req.user.id установлен в authMiddleware
    User.findById(req.user.id, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Убираем пароль из ответа
        const { password, ...userData } = user;
        res.json(userData);
    });
};