import { useState, useEffect } from 'react';
import { getSubtasks, createSubtask, toggleSubtask, deleteSubtask } from '../api/subtask';
import { getComments, createComment, deleteComment } from '../api/comment';
import './TodoItem.css';

const priorityMap = { high: '高', medium: '中', low: '低' };
const priorityClass = { high: 'priority-high', medium: 'priority-medium', low: 'priority-low' };

export default function TodoItem({ todo, user, categories, onToggle, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: todo.title,
    priority: todo.priority,
    deadline: todo.deadline ? todo.deadline.slice(0, 10) : '',
    categoryId: todo.category_id || '',
  });
  const [subtasks, setSubtasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed_count: 0 });
  const [comments, setComments] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');

  const isOverdue = todo.deadline && !todo.completed && new Date(todo.deadline) < new Date();

  useEffect(() => {
    if (expanded) {
      fetchSubtasks();
      fetchComments();
    }
  }, [expanded, todo.id]);

  const fetchSubtasks = async () => {
    try {
      const res = await getSubtasks(todo.id);
      setSubtasks(res.data.subtasks);
      setStats(res.data.stats);
    } catch (error) {
      console.error('获取子任务失败', error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComments(todo.id);
      setComments(res.data);
    } catch (error) {
      console.error('获取评论失败', error);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    await createSubtask(todo.id, { title: newSubtask });
    setNewSubtask('');
    fetchSubtasks();
  };

  const handleToggleSubtask = async (id, completed) => {
    await toggleSubtask(id, { completed: completed ? 0 : 1 });
    fetchSubtasks();
  };

  const handleDeleteSubtask = async (id) => {
    await deleteSubtask(id);
    fetchSubtasks();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await createComment(todo.id, { content: newComment, userId: user.userId });
    setNewComment('');
    fetchComments();
  };

  const handleDeleteComment = async (id) => {
    await deleteComment(id);
    fetchComments();
  };

  const handleEditSubmit = () => {
    if (!editForm.title.trim()) return;
    onEdit(todo.id, editForm);
    setEditing(false);
  };

  const handleEditCancel = () => {
    setEditForm({
      title: todo.title,
      priority: todo.priority,
      deadline: todo.deadline ? todo.deadline.slice(0, 10) : '',
      categoryId: todo.category_id || '',
    });
    setEditing(false);
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed_count / stats.total) * 100) : 0;

  return (
    <div className={`todo-card ${expanded ? 'expanded' : ''} ${todo.completed ? 'completed' : ''}`}>
      {/* 任务主行 */}
      <div className="todo-item" onClick={() => setExpanded(!expanded)}>
        <div className="todo-checkbox-wrap" onClick={(e) => { e.stopPropagation(); onToggle(todo.id, todo.completed); }}>
          <div className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}>
            {todo.completed && <span>✓</span>}
          </div>
        </div>

        <div className="todo-body">
          <span className="todo-title">{todo.title}</span>
          <div className="todo-meta">
            {todo.category_name && <span className="meta-tag category">{todo.category_name}</span>}
            <span className={`meta-tag ${priorityClass[todo.priority]}`}>
              {priorityMap[todo.priority]}
            </span>
            {todo.deadline && (
              <span className={`meta-tag deadline ${isOverdue ? 'overdue' : ''}`}>
                {todo.deadline.slice(0, 10)}
              </span>
            )}
            {stats.total > 0 && (
              <span className="meta-tag subtask-count">{stats.completed_count}/{stats.total} 子任务</span>
            )}
          </div>
        </div>

        <div className="todo-actions">
          <span className={`expand-arrow ${expanded ? 'open' : ''}`}>▾</span>
          <button className="todo-edit" onClick={(e) => { e.stopPropagation(); setEditing(!editing); setExpanded(true); }}>
            ✏️
          </button>
          <button className="todo-delete" onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}>
            🗑
          </button>
        </div>
      </div>

      {/* 编辑表单 */}
      {editing && (
        <div className="todo-edit-form">
          <div className="edit-row">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="任务标题"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="edit-row edit-options">
            <div className="edit-group">
              <label>优先级</label>
              <select
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
            <div className="edit-group">
              <label>截止日期</label>
              <input
                type="date"
                value={editForm.deadline}
                onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="edit-group">
              <label>分类</label>
              <select
                value={editForm.categoryId}
                onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">无分类</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="edit-actions">
              <button className="edit-save" onClick={handleEditSubmit}>保存</button>
              <button className="edit-cancel" onClick={handleEditCancel}>取消</button>
            </div>
          </div>
        </div>
      )}

      {/* 展开内容 */}
      {expanded && (
        <div className="todo-expand">
          {/* 子任务 */}
          <div className="expand-section">
            <div className="expand-title">
              <span>📋 子任务</span>
              {stats.total > 0 && <span className="expand-count">{completionRate}%</span>}
            </div>
            {stats.total > 0 && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
              </div>
            )}
            <div className="subtask-list">
              {subtasks.map((s) => (
                <div key={s.id} className="subtask-item">
                  <div
                    className={`sub-checkbox ${s.completed ? 'checked' : ''}`}
                    onClick={() => handleToggleSubtask(s.id, s.completed)}
                  >
                    {s.completed && '✓'}
                  </div>
                  <span className={s.completed ? 'done' : ''}>{s.title}</span>
                  <button className="sub-delete" onClick={() => handleDeleteSubtask(s.id)}>×</button>
                </div>
              ))}
            </div>
            <div className="inline-add">
              <input
                type="text"
                placeholder="添加子任务..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                onClick={(e) => e.stopPropagation()}
              />
              <button onClick={handleAddSubtask}>+</button>
            </div>
          </div>

          {/* 评论 */}
          <div className="expand-section">
            <div className="expand-title">
              <span>💬 评论</span>
              {comments.length > 0 && <span className="expand-count">{comments.length}</span>}
            </div>
            <div className="comment-list">
              {comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-top">
                    <div className="comment-avatar">{c.username[0].toUpperCase()}</div>
                    <div className="comment-info">
                      <span className="comment-user">{c.username}</span>
                      <span className="comment-time">{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <button className="comment-del" onClick={() => handleDeleteComment(c.id)}>×</button>
                  </div>
                  <p className="comment-content">{c.content}</p>
                </div>
              ))}
            </div>
            <div className="inline-add">
              <input
                type="text"
                placeholder="写下你的想法..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                onClick={(e) => e.stopPropagation()}
              />
              <button onClick={handleAddComment}>发送</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
