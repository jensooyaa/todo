const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const todoRoutes = require('./routes/todo');
const subtaskRoutes = require('./routes/subtask');
const commentRoutes = require('./routes/comment');
const auth = require('./middleware/auth');

const app = express();

// 中间件
app.use(cors({
  origin: 'http://localhost:5173', // 前端地址
  credentials: true,               // 允许携带 cookie
}));
app.use(express.json());
app.use(cookieParser());

// 路由
app.use('/api/users', userRoutes);                // 登录注册不需要验证
app.use('/api/categories', auth, categoryRoutes); // 需要登录
app.use('/api/todos', auth, todoRoutes);          // 需要登录
app.use('/api', auth, subtaskRoutes);             // 需要登录
app.use('/api/comments', auth, commentRoutes);    // 需要登录

// 健康检查接口 - 用来测试服务器是否正常运行
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
});
