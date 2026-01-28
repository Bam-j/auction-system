import {api} from '../../../api/axios';

//회원가입
export const signup = async (userData) => {
  const response = await api.post('/users/signup', userData);
  return response.data;
};

//로그인
export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

//로그아웃
export const logoutUser = async () => {
  //TODO: 백엔드 Spring Security 설정에 맞춰 POST 요청 수정/적용하기
  const response = await api.post('/users/logout');
  return response.data;
};