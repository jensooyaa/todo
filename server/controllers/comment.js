const Comment = require('../models/comment');
const Todo = require('../models/todo');

const commentController = {
  // 获取某个任务的评论
  getByTodoId: async (req, res) => {
    try {
      const { todoId } = req.params;

      const todo = await Todo.findById(todoId);
      if (!todo) {
        return res.status(404).json({ message: '任务不存在' });
      }

      const comments = await Comment.findByTodoId(todoId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 创建评论
  create: async (req, res) => {
    try {
      const { todoId } = req.params;
      const { content, userId } = req.body;

      if (!content || !userId) {
        return res.status(400).json({ message: '评论内容和 userId 不能为空' });
      }

      const todo = await Todo.findById(todoId);
      if (!todo) {
        return res.status(404).json({ message: '任务不存在' });
      }

      const id = await Comment.create(content, todoId, userId);
      res.status(201).json({ message: '评论成功', id });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 删除评论
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Comment.delete(id);
      res.json({ message: '删除成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },
};

module.exports = commentController;
