import api from "@/api/axiosInstance";

// 회원가입
export const signup = (data) => {
  return api.post("/auth/signup", data);
};

// 로그인
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// 로그아웃
export const logoutUser = () => {
  return api.post("/auth/logout");
};
