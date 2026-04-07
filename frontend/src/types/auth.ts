export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string | null;
  isVerified: boolean;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setUser: (userData: User) => void;
  setToken: (token: string) => void;
  updateNickname: (newNickname: string) => void;
  updateEmailVerification: (email: string) => void;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  nickname: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}
