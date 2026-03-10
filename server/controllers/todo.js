const Todo = require('../models/todo');

const todoController = {
  // 获取任务列表
  getAll: async (req, res) => {
    try {
      const { userId, categoryId, completed, keyword, page, pageSize } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'userId 不能为空' });
      }
      const result = await Todo.findByUserId(userId, {
        categoryId,
        completed: completed !== undefined ? Number(completed) : undefined,
        keyword,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 获取单个任务详情
  getById: async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: '任务不存在' });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 创建任务
  create: async (req, res) => {
    try {
      const { title, priority, deadline, userId, categoryId } = req.body;
      if (!title || !userId) {
        return res.status(400).json({ message: '任务标题和 userId 不能为空' });
      }
      const id = await Todo.create({ title, priority, deadline, userId, categoryId });
      res.status(201).json({ message: '创建成功', id });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 更新任务
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, priority, deadline, categoryId } = req.body;

      const todo = await Todo.findById(id);
      if (!todo) {
        return res.status(404).json({ message: '任务不存在' });
      }

      await Todo.update(id, { title, priority, deadline, categoryId });
      res.json({ message: '更新成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 切换完成状态
  toggleCompleted: async (req, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;

      const todo = await Todo.findById(id);
      if (!todo) {
        return res.status(404).json({ message: '任务不存在' });
      }

      await Todo.toggleCompleted(id, completed);
      res.json({ message: completed ? '已完成' : '未完成' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 删除任务
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const todo = await Todo.findById(id);
      if (!todo) {
        return res.status(404).json({ message: '任务不存在' });
      }

      await Todo.delete(id);
      res.json({ message: '删除成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 分类统计
  countByCategory: async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'userId 不能为空' });
      }
      const result = await Todo.countByCategory(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },
};

module.exports = todoController;
