const Subtask = require('../models/subtask');
const Todo = require('../models/todo');

const subtaskController = {
  // 获取某个任务的子任务列表
  getByTodoId: async (req, res) => {
    try {
      const { todoId } = req.params;

      const todo = await Todo.findById(todoId);
      if (!todo) {
        return res.status(404).json({ message: '任务不存在' });
      }

      const subtasks = await Subtask.findByTodoId(todoId);
      const stats = await Subtask.countByTodoId(todoId);
      res.json({ subtasks, stats });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 创建子任务
  create: async (req, res) => {
    try {
      const { todoId } = req.params;
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ message: '子任务标题不能为空' });
      }

      const todo = await Todo.findById(todoId);
      if (!todo) {
        return res.status(404).json({ message: '任务不存在' });
      }

      const id = await Subtask.create(title, todoId);
      res.status(201).json({ message: '创建成功', id });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 切换完成状态
  toggleCompleted: async (req, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      await Subtask.toggleCompleted(id, completed);
      res.json({ message: completed ? '已完成' : '未完成' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 删除子任务
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Subtask.delete(id);
      res.json({ message: '删除成功' });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },
};

module.exports = subtaskController;
