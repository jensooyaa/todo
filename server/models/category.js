const pool = require('../config/db');

const Category = {
  // 查询某个用户的所有分类
  findByUserId: async (userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  // 根据 id 查询单个分类
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },

  // 创建分类
  create: async (name, userId) => {
    const [result] = await pool.query(
      'INSERT INTO categories (name, user_id) VALUES (?, ?)',
      [name, userId]
    );
    return result.insertId;
  },

  // 更新分类名称
  update: async (id, name) => {
    await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
  },

  // 删除分类
  delete: async (id) => {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  },
};

module.exports = Category;
