const pool = require('../config/db');

const Todo = {
  // 查询任务列表（关联分类名称，支持筛选、搜索、分页）
  findByUserId: async (userId, { categoryId, completed, keyword, page = 1, pageSize = 10 }) => {
    let sql = `
      SELECT t.*, c.name AS category_name
      FROM todos t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    // 按分类筛选
    if (categoryId) {
      sql += ' AND t.category_id = ?';
      params.push(categoryId);
    }

    // 按完成状态筛选
    if (completed !== undefined) {
      sql += ' AND t.completed = ?';
      params.push(completed);
    }

    // 按标题模糊搜索
    if (keyword) {
      sql += ' AND t.title LIKE ?';
      params.push(`%${keyword}%`);
    }

    // 排序：高优先级在前，然后按创建时间倒序
    sql += ` ORDER BY FIELD(t.priority, 'high', 'medium', 'low'), t.created_at DESC`;

    // 分页
    const offset = (page - 1) * pageSize;
    sql += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [rows] = await pool.query(sql, params);

    // 查总数（用于前端计算总页数）
    let countSql = 'SELECT COUNT(*) AS total FROM todos t WHERE t.user_id = ?';
    const countParams = [userId];
    if (categoryId) {
      countSql += ' AND t.category_id = ?';
      countParams.push(categoryId);
    }
    if (completed !== undefined) {
      countSql += ' AND t.completed = ?';
      countParams.push(completed);
    }
    if (keyword) {
      countSql += ' AND t.title LIKE ?';
      countParams.push(`%${keyword}%`);
    }
    const [countRows] = await pool.query(countSql, countParams);

    return { list: rows, total: countRows[0].total };
  },

  // 根据 id 查询单个任务
  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT t.*, c.name AS category_name
       FROM todos t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0];
  },

  // 创建任务
  create: async ({ title, priority, deadline, userId, categoryId }) => {
    const [result] = await pool.query(
      'INSERT INTO todos (title, priority, deadline, user_id, category_id) VALUES (?, ?, ?, ?, ?)',
      [title, priority || 'medium', deadline || null, userId, categoryId || null]
    );
    return result.insertId;
  },

  // 更新任务
  update: async (id, { title, priority, deadline, categoryId }) => {
    await pool.query(
      'UPDATE todos SET title = ?, priority = ?, deadline = ?, category_id = ? WHERE id = ?',
      [title, priority, deadline || null, categoryId || null, id]
    );
  },

  // 切换完成状态
  toggleCompleted: async (id, completed) => {
    await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id]);
  },

  // 删除任务
  delete: async (id) => {
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
  },

  // 统计每个分类下的任务数量
  countByCategory: async (userId) => {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, COUNT(t.id) AS task_count
       FROM categories c
       LEFT JOIN todos t ON c.id = t.category_id
       WHERE c.user_id = ?
       GROUP BY c.id, c.name`,
      [userId]
    );
    return rows;
  },
};

module.exports = Todo;
