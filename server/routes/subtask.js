const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subtask');

// GET    /api/todos/:todoId/subtasks           — 获取子任务列表 + 完成统计
router.get('/todos/:todoId/subtasks', subtaskController.getByTodoId);

// POST   /api/todos/:todoId/subtasks           — 创建子任务
router.post('/todos/:todoId/subtasks', subtaskController.create);

// PATCH  /api/subtasks/:id/toggle              — 切换完成状态
router.patch('/subtasks/:id/toggle', subtaskController.toggleCompleted);

// DELETE /api/subtasks/:id                     — 删除子任务
router.delete('/subtasks/:id', subtaskController.delete);

module.exports = router;
