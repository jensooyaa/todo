const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// POST /api/users/register — 注册
router.post('/register', userController.register);

// POST /api/users/login — 登录
router.post('/login', userController.login);

module.exports = router;
