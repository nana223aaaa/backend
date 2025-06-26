// models/User.js
const db = require('../config/db');

class User {
    static findByEmail(email, callback) {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                return callback(err);
            }
            callback(null, row);
        });
    }

    static findById(id, callback) {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            if (err) {
                return callback(err);
            }
            callback(null, row);
        });
    }
}

module.exports = User;