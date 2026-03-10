import request from './request';

export const getComments = (todoId) => request.get(`/comments/${todoId}/comments`);
export const createComment = (todoId, data) => request.post(`/comments/${todoId}/comments`, data);
export const deleteComment = (id) => request.delete(`/comments/${id}`);
