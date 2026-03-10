const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo');

// GET    /api/todos?userId=1&page=1&pageSize=10  — 任务列表（支持筛选、搜索、分页）
router.get('/', todoController.getAll);

// GET    /api/todos/stats?userId=1               — 分类统计
router.get('/stats', todoController.countByCategory);

// GET    /api/todos/:id                          — 任务详情
router.get('/:id', todoController.getById);

// POST   /api/todos                              — 创建任务
router.post('/', todoController.create);

// PUT    /api/todos/:id                          — 更新任务
router.put('/:id', todoController.update);

// PATCH  /api/todos/:id/toggle                   — 切换完成状态
router.patch('/:id/toggle', todoController.toggleCompleted);

// DELETE /api/todos/:id                          — 删除任务
router.delete('/:id', todoController.delete);

module.exports = router;
