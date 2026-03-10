import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, createTodo, toggleTodo, deleteTodo } from '../../api/todo';
import { getCategories, createCategory, deleteCategory } from '../../api/category';
import TodoItem from '../../components/TodoItem';
import './index.css';

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [todos, setTodos] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    categoryId: '',
    completed: '',
    keyword: '',
    page: 1,
    pageSize: 10,
  });

  const [newTodo, setNewTodo] = useState({ title: '', priority: 'medium', deadline: '', categoryId: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) fetchTodos();
  }, [filters]);

  const fetchTodos = async () => {
    try {
      const res = await getTodos({ userId: user.userId, ...filters });
      setTodos(res.data.list);
      setTotal(res.data.total);
    } catch (error) {
      console.error('获取任务失败', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories(user.userId);
      setCategories(res.data);
    } catch (error) {
      console.error('获取分类失败', error);
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    try {
      await createTodo({ ...newTodo, userId: user.userId });
      setNewTodo({ title: '', priority: 'medium', deadline: '', categoryId: '' });
      setShowAddForm(false);
      fetchTodos();
    } catch (error) {
      console.error('创建失败', error);
    }
  };

  const handleToggle = async (id, completed) => {
    await toggleTodo(id, { completed: completed ? 0 : 1 });
    fetchTodos();
  };

  const handleDelete = async (id) => {
    if (!confirm('确定删除这个任务？')) return;
    await deleteTodo(id);
    fetchTodos();
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    await createCategory({ name: newCategoryName, userId: user.userId });
    setNewCategoryName('');
    fetchCategories();
  };

  const handleDeleteCategory = async (id, e) => {
    e.stopPropagation();
    if (!confirm('删除分类后，该分类下的任务将变为未分类')) return;
    await deleteCategory(id);
    if (filters.categoryId === String(id)) {
      setFilters({ ...filters, categoryId: '', page: 1 });
    }
    fetchCategories();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const totalPages = Math.ceil(total / filters.pageSize);
  const activeCategory = categories.find((c) => String(c.id) === filters.categoryId);
  const statusMap = { '': '全部任务', '0': '进行中', '1': '已完成' };
  const getTitle = () => {
    const status = statusMap[filters.completed];
    return activeCategory ? `${activeCategory.name} · ${status}` : status;
  };

  if (!user) return null;

  return (
    <div className="home-page">
      {/* 侧边栏 */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">T</div>
            {!sidebarCollapsed && <span>Todo Pro</span>}
          </div>
          <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? '>' : '<'}
          </button>
        </div>

        {!sidebarCollapsed && (
          <>
            <div className="user-section">
              <div className="avatar">{user.username[0].toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className="logout" onClick={handleLogout}>退出登录</span>
              </div>
            </div>

            <nav className="nav-section">
              <div className="nav-title">状态</div>
              <div
                className={`nav-item ${filters.completed === '' ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, completed: '', page: 1 })}
              >
                <span className="nav-icon">📋</span>
                <span>全部任务</span>
                <span className="nav-count">{total}</span>
              </div>
              <div
                className={`nav-item ${filters.completed === '0' ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, completed: '0', page: 1 })}
              >
                <span className="nav-icon">⏳</span>
                <span>进行中</span>
              </div>
              <div
                className={`nav-item ${filters.completed === '1' ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, completed: '1', page: 1 })}
              >
                <span className="nav-icon">✅</span>
                <span>已完成</span>
              </div>
            </nav>

            <nav className="nav-section">
              <div className="nav-title">分类</div>
              <div
                className={`nav-item ${filters.categoryId === '' ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, categoryId: '', page: 1 })}
              >
                <span className="nav-icon">📁</span>
                <span>全部分类</span>
              </div>
              {categories.map((c) => (
                <div
                  key={c.id}
                  className={`nav-item ${filters.categoryId === String(c.id) ? 'active' : ''}`}
                  onClick={() => setFilters({ ...filters, categoryId: String(c.id), page: 1 })}
                >
                  <span className="nav-icon">📂</span>
                  <span>{c.name}</span>
                  <span className="nav-delete" onClick={(e) => handleDeleteCategory(c.id, e)}>×</span>
                </div>
              ))}
              <div className="nav-add">
                <input
                  type="text"
                  placeholder="新建分类..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                />
                <button onClick={handleCreateCategory}>+</button>
              </div>
            </nav>

          </>
        )}
      </aside>

      {/* 主内容 */}
      <main className="main-content">
        <div className="main-toolbar">
          <div className="toolbar-left">
            <h2>{getTitle()}</h2>
            <span className="task-count">{total} 个任务</span>
          </div>
          <div className="toolbar-right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="搜索任务..."
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value, page: 1 })}
              />
            </div>
            <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? '取消' : '+ 新建'}
            </button>
          </div>
        </div>

        {/* 新建任务 */}
        {showAddForm && (
          <form className="add-form" onSubmit={handleCreateTodo}>
            <div className="form-row">
              <input
                type="text"
                placeholder="输入任务标题..."
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                autoFocus
              />
            </div>
            <div className="form-row form-options">
              <div className="option-group">
                <label>优先级</label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
              <div className="option-group">
                <label>截止日期</label>
                <input
                  type="date"
                  value={newTodo.deadline}
                  onChange={(e) => setNewTodo({ ...newTodo, deadline: e.target.value })}
                />
              </div>
              <div className="option-group">
                <label>分类</label>
                <select
                  value={newTodo.categoryId}
                  onChange={(e) => setNewTodo({ ...newTodo, categoryId: e.target.value })}
                >
                  <option value="">无分类</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="create-btn">创建任务</button>
            </div>
          </form>
        )}

        {/* 任务列表 */}
        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>暂无任务</p>
              <span>点击右上角「+ 新建」创建你的第一个任务</span>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                user={user}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={filters.page <= 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            >
              ← 上一页
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <span
                  key={i}
                  className={`page-num ${filters.page === i + 1 ? 'active' : ''}`}
                  onClick={() => setFilters({ ...filters, page: i + 1 })}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <button
              disabled={filters.page >= totalPages}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            >
              下一页 →
            </button>
          </div>
        )}
      </main>

    </div>
  );
}
