import {AxiosResponse} from 'axios';

import api from '@/api/axiosInstance';
import {LoginResponse, User} from '@/types/auth';

// 현재 사용자 정보 조회
export const getMe = (): Promise<AxiosResponse<User>> => {
  return api.get('/users/me');
};

// 회원가입
export const signup = (data: any): Promise<AxiosResponse<void>> => {
  return api.post('/auth/sign-up', data);
};

// 로그인
export const loginUser = (data: any): Promise<AxiosResponse<LoginResponse>> => {
  return api.post('/auth/login', data);
};

// 로그아웃
export const logoutUser = (): Promise<AxiosResponse<void>> => {
  return api.post('/auth/logout');
};

// 아이디 중복 확인
export const checkUsername = (username: string): Promise<AxiosResponse<void>> => {
  return api.get(`/auth/check/username`, {
    params: {username}
  });
};

// 닉네임 중복 확인
export const checkNickname = (nickname: string): Promise<AxiosResponse<void>> => {
  return api.get(`/auth/check/nickname`, {
    params: {nickname}
  });
};
