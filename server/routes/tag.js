const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag');

// GET    /api/tags?userId=1                    — 获取标签列表
router.get('/', tagController.getAll);

// POST   /api/tags                             — 创建标签
router.post('/', tagController.create);

// DELETE /api/tags/:id                         — 删除标签
router.delete('/:id', tagController.delete);

// POST   /api/tags/bindTodo                    — 给任务添加标签
router.post('/bindTodo', tagController.addToTodo);

// DELETE /api/tags/:tagId/todos/:todoId        — 移除任务的标签
router.delete('/:tagId/todos/:todoId', tagController.removeFromTodo);

// GET    /api/tags/todos/:todoId               — 查询某个任务的标签
router.get('/todos/:todoId', tagController.getByTodoId);

// GET    /api/tags/:tagId/todos?userId=1       — 根据标签筛选任务
router.get('/:tagId/todos', tagController.getTodosByTagId);

module.exports = router;
