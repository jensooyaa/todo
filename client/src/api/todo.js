import request from './request';

export const getTodos = (params) => request.get('/todos', { params });
export const getTodoById = (id) => request.get(`/todos/${id}`);
export const createTodo = (data) => request.post('/todos', data);
export const updateTodo = (id, data) => request.put(`/todos/${id}`, data);
export const toggleTodo = (id, data) => request.patch(`/todos/${id}/toggle`, data);
export const deleteTodo = (id) => request.delete(`/todos/${id}`);
export const getTodoStats = (userId) => request.get('/todos/stats', { params: { userId } });
