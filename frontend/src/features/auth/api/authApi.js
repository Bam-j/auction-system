import api from "@/api/axiosInstance";

// 회원가입
export const signup = (data) => {
  return api.post("/auth/sign-up", data);
};

// 로그인
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// 로그아웃
export const logoutUser = () => {
  return api.post("/auth/logout");
};

//아이디 중복 확인 추가
export const checkUsername = (username) => {
  return api.get(`/auth/check/username`, {
    params: {username}
  });
};

//닉네임 중복 확인 추가
export const checkNickname = (nickname) => {
  return api.get(`/auth/check/nickname`, {
    params: {nickname}
  });
};