import request from './request';

export const getSubtasks = (todoId) => request.get(`/todos/${todoId}/subtasks`);
export const createSubtask = (todoId, data) => request.post(`/todos/${todoId}/subtasks`, data);
export const toggleSubtask = (id, data) => request.patch(`/subtasks/${id}/toggle`, data);
export const deleteSubtask = (id) => request.delete(`/subtasks/${id}`);
