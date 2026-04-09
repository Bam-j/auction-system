import axios, {InternalAxiosRequestConfig} from 'axios';

import useAuthStore from '@/stores/useAuthStore';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 401 Unauthorized 에러이고, 재시도하지 않은 요청이며, 토큰이 있는 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = useAuthStore.getState().refreshToken;

        if (refreshToken) {
          try {
            // 토큰 갱신 요청
            const res = await axios.post('http://localhost:8080/api/v1/auth/refresh', {
              refreshToken,
            });
            const {accessToken, refreshToken: newRefreshToken} = res.data;

            // 새로운 토큰 저장
            useAuthStore.getState().setToken(accessToken);
            useAuthStore.getState().setRefreshToken(newRefreshToken);

            // 헤더 업데이트 및 재요청
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            // 갱신 실패 시 로그아웃 및 로그인 페이지 이동 (선택적)
            useAuthStore.getState().logout();
            return Promise.reject(refreshError);
          }
        }
      }

      return Promise.reject(error);
    }
);

export default api;
