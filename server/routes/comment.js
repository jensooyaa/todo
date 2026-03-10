const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');

// GET    /api/todos/:todoId/comments    — 获取评论列表
router.get('/:todoId/comments', commentController.getByTodoId);

// POST   /api/todos/:todoId/comments    — 创建评论
router.post('/:todoId/comments', commentController.create);

// DELETE /api/comments/:id              — 删除评论
router.delete('/:id', commentController.delete);

module.exports = router;
