import {api} from '../../../api/axios';

// 회원가입
export const signup = async (userData) => {
  const response = await api.post('/users/signup', userData);
  return response.data;
};

//로그인
export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};