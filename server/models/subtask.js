const pool = require('../config/db');

const Subtask = {
  // 查询某个任务的所有子任务
  findByTodoId: async (todoId) => {
    const [rows] = await pool.query(
      'SELECT * FROM subtasks WHERE todo_id = ? ORDER BY created_at ASC',
      [todoId]
    );
    return rows;
  },

  // 创建子任务
  create: async (title, todoId) => {
    const [result] = await pool.query(
      'INSERT INTO subtasks (title, todo_id) VALUES (?, ?)',
      [title, todoId]
    );
    return result.insertId;
  },

  // 切换完成状态
  toggleCompleted: async (id, completed) => {
    await pool.query('UPDATE subtasks SET completed = ? WHERE id = ?', [completed, id]);
  },

  // 删除子任务
  delete: async (id) => {
    await pool.query('DELETE FROM subtasks WHERE id = ?', [id]);
  },

  // 统计某个任务的子任务完成情况
  countByTodoId: async (todoId) => {
    const [rows] = await pool.query(
      `SELECT
        COUNT(*) AS total,
        SUM(completed) AS completed_count
       FROM subtasks WHERE todo_id = ?`,
      [todoId]
    );
    return rows[0];
  },
};

module.exports = Subtask;
