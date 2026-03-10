import request from './request';

export const register = (data) => request.post('/users/register', data);
export const login = (data) => request.post('/users/login', data);
