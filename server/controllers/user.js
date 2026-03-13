const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;

const userController = {
  // 注册
  register: async (req, res) => {
    try {
      const { username, password } = req.body;

      // 校验参数
      if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码不能为空' });
      }

      // 检查用户名是否已存在
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: '用户名已存在' });
      }

      // 对密码进行加密
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // 创建用户
      const userId = await User.create(username, hashedPassword);
      res.status(201).json({ message: '注册成功', userId });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },

  // 登录
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // 校验参数
      if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码不能为空' });
      }

      // 查找用户
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(400).json({ message: '用户名和密码不能为空' });
      }

      // 验证密码（bcrypt 比对）
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: '用户名或密码错误' });
      }

      // 生成 JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      // 将 token 写入 httpOnly cookie
      res.cookie('JWT', token, {
        httpOnly: true,  // JS 无法读取，防 XSS
        maxAge: Number(process.env.COOKIE_MAX_AGE) || 86400000,
        sameSite: 'lax',
      });

      res.json({ message: '登录成功', userId: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },
};

module.exports = userController;
