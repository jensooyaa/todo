const pool = require('../config/db');

const Comment = {
  // 查询某个任务的评论（关联用户名）
  findByTodoId: async (todoId) => {
    const [rows] = await pool.query(
      `SELECT c.*, u.username
       FROM comments c
       INNER JOIN users u ON c.user_id = u.id
       WHERE c.todo_id = ?
       ORDER BY c.created_at DESC`,
      [todoId]
    );
    return rows;
  },

  // 创建评论
  create: async (content, todoId, userId) => {
    const [result] = await pool.query(
      'INSERT INTO comments (content, todo_id, user_id) VALUES (?, ?, ?)',
      [content, todoId, userId]
    );
    return result.insertId;
  },

  // 删除评论
  delete: async (id) => {
    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
  },
};

module.exports = Comment;
