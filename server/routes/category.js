const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

// GET    /api/categories?userId=1   — 获取分类列表
router.get('/', categoryController.getAll);

// POST   /api/categories            — 创建分类
router.post('/', categoryController.create);

// PUT    /api/categories/:id        — 更新分类
router.put('/:id', categoryController.update);

// DELETE /api/categories/:id        — 删除分类
router.delete('/:id', categoryController.delete);

module.exports = router;
