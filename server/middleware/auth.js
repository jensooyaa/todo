const jwt = require('jsonwebtoken');

// 认证中间件，验证 JWT token
const auth = (req, res, next) => {
  const token = req.cookies.JWT;
  if (!token) {
    return res.status(401).json({ message: '未登录，请先登录' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('验证通过的 JWT token 内容:', decoded);
    req.user = decoded; // { userId, username }
    next();
  } catch (error) {
    return res.status(401).json({ message: '登录已过期，请重新登录' });
  }
};

module.exports = auth;
