const pool = require('../config/db');

const User = {
  // 根据用户名查找用户
  findByUsername: async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log('rows[0]:', rows[0]);
    return rows[0]; // 返回第一条，没找到就是 undefined
  },

  // 创建用户
  create: async (username, password) => {
    const [result] = await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    return result.insertId; // 返回新用户的 id
  },
};

module.exports = User;
