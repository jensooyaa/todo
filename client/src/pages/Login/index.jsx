import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../api/user';
import './index.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await login({ username, password });
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/');
      } else {
        await register({ username, password });
        setMessage('注册成功，请登录');
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-icon">T</div>
          <h1>Todo Pro</h1>
          <p>简洁高效的任务管理工具</p>
        </div>
        <div className="login-features">
          <div className="feature-item">
            <span className="feature-dot"></span>
            <span>任务分类与标签管理</span>
          </div>
          <div className="feature-item">
            <span className="feature-dot"></span>
            <span>子任务拆分与进度追踪</span>
          </div>
          <div className="feature-item">
            <span className="feature-dot"></span>
            <span>优先级与截止日期提醒</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>{isLogin ? '欢迎回来' : '创建账号'}</h2>
          <p className="login-subtitle">{isLogin ? '登录你的账号继续使用' : '注册一个新账号开始使用'}</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>用户名</label>
              <input
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>密码</label>
              <input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '处理中...' : isLogin ? '登 录' : '注 册'}
            </button>
          </form>

          {message && (
            <p className={`message ${message.includes('成功') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}

          <div className="divider"><span>OR</span></div>

          <p className="switch-text">
            {isLogin ? '还没有账号？' : '已有账号？'}
            <span onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
              {isLogin ? '立即注册' : '去登录'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
