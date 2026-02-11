import {api} from '../../../api/axios';

//회원가입
export const signup = async (userData) => {
  const response = await api.post('/api/v1/auth/signup', userData);
  return response.data;
};

//로그인
export const login = async (credentials) => {
  const response = await api.post('/api/v1/auth/login', credentials);
  return response.data;
};

//로그아웃
export const logoutUser = async () => {
  const response = await api.post('/api/v1/auth/logout');
  return response.data;
};