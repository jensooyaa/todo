const pool = require('../config/db');

const Tag = {
  // 查询某个用户的所有标签
  findByUserId: async (userId) => {
    const [rows] = await pool.query('SELECT * FROM tags WHERE user_id = ?', [userId]);
    return rows;
  },

  // 创建标签
  create: async (name, userId) => {
    const [result] = await pool.query(
      'INSERT INTO tags (name, user_id) VALUES (?, ?)',
      [name, userId]
    );
    return result.insertId;
  },

  // 删除标签
  delete: async (id) => {
    await pool.query('DELETE FROM tags WHERE id = ?', [id]);
  },

  // 给任务添加标签（多对多）
  addToTodo: async (todoId, tagId) => {
    await pool.query(
      'INSERT IGNORE INTO todo_tags (todo_id, tag_id) VALUES (?, ?)',
      [todoId, tagId]
    );
  },

  // 移除任务的某个标签
  removeFromTodo: async (todoId, tagId) => {
    await pool.query(
      'DELETE FROM todo_tags WHERE todo_id = ? AND tag_id = ?',
      [todoId, tagId]
    );
  },

  // 查询某个任务的所有标签
  findByTodoId: async (todoId) => {
    const [rows] = await pool.query(
      `SELECT t.* FROM tags t
       INNER JOIN todo_tags tt ON t.id = tt.tag_id
       WHERE tt.todo_id = ?`,
      [todoId]
    );
    return rows;
  },

  // 根据标签查询任务（通过标签筛选任务列表）
  findTodosByTagId: async (tagId, userId) => {
    const [rows] = await pool.query(
      `SELECT t.*, c.name AS category_name
       FROM todos t
       INNER JOIN todo_tags tt ON t.id = tt.todo_id
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE tt.tag_id = ? AND t.user_id = ?
       ORDER BY t.created_at DESC`,
      [tagId, userId]
    );
    return rows;
  },
};

module.exports = Tag;
