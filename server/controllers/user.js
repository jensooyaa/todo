const User = require('../models/user');

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

      // 创建用户
      const userId = await User.create(username, password);
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
        return res.status(400).json({ message: '用户名或密码错误' });
      }

      // 验证密码
      if (password !== user.password) {
        return res.status(400).json({ message: '用户名或密码错误' });
      }

      res.json({ message: '登录成功', userId: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: '服务器错误' });
    }
  },
};

module.exports = userController;
