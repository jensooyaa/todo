const Tag = require('../models/tag');

const tagController = {
  // 获取用户的所有标签
  getAll: async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'userId 不能为空' });
      }
      const tags = await Tag.findByUserId(userId);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 创建标签
  create: async (req, res) => {
    try {
      const { name, userId } = req.body;
      if (!name || !userId) {
        return res.status(400).json({ message: '标签名称和 userId 不能为空' });
      }
      const id = await Tag.create(name, userId);
      res.status(201).json({ message: '创建成功', id });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 删除标签
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Tag.delete(id);
      res.json({ message: '删除成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 给任务添加标签
  addToTodo: async (req, res) => {
    try {
      const { todoId, tagId } = req.body;
      if (!todoId || !tagId) {
        return res.status(400).json({ message: 'todoId 和 tagId 不能为空' });
      }
      await Tag.addToTodo(todoId, tagId);
      res.json({ message: '添加成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 移除任务的标签
  removeFromTodo: async (req, res) => {
    try {
      const { todoId, tagId } = req.params;
      await Tag.removeFromTodo(todoId, tagId);
      res.json({ message: '移除成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 查询某个任务的标签
  getByTodoId: async (req, res) => {
    try {
      const { todoId } = req.params;
      const tags = await Tag.findByTodoId(todoId);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 根据标签筛选任务
  getTodosByTagId: async (req, res) => {
    try {
      const { tagId } = req.params;
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'userId 不能为空' });
      }
      const todos = await Tag.findTodosByTagId(tagId, userId);
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },
};

module.exports = tagController;
