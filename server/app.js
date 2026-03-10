const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');

const app = express();

// 中间件
app.use(cors());          // 允许前端跨域请求
app.use(express.json());  // 让服务器能解析 JSON 格式的请求体

// 路由
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// 健康检查接口 - 用来测试服务器是否正常运行
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
});
