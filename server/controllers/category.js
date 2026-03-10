const Category = require('../models/category');

const categoryController = {
  // 获取当前用户的所有分类
  getAll: async (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ message: 'userId 不能为空' });
      }
      const categories = await Category.findByUserId(userId);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 创建分类
  create: async (req, res) => {
    try {
      const { name, userId } = req.body;
      if (!name || !userId) {
        return res.status(400).json({ message: '分类名称和 userId 不能为空' });
      }
      const id = await Category.create(name, userId);
      res.status(201).json({ message: '创建成功', id });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 更新分类
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: '分类名称不能为空' });
      }

      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      await Category.update(id, name);
      res.json({ message: '更新成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 删除分类
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      await Category.delete(id);
      res.json({ message: '删除成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },
};

module.exports = categoryController;
