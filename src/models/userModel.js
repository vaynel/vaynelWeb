const pool = require('../utils/database');
const bcrypt = require('bcryptjs');

class UserModel {
    static async findUserById(userId) {
        const [user] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        return user.length ? user[0] : null;
    }

    static async addUser(userData) {
        const { user_id, name, password, email, department, position } = userData;
        const id = require('crypto').randomBytes(5).toString('hex');

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 8);

        const sql = `INSERT INTO users (id, user_id, name, password, email, department, position) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const result = await pool.query(sql, [id, user_id, name, hashedPassword, email, department, position]);
        return result;
    }
}

module.exports = UserModel;
