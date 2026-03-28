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
  updateNickname: (newNickname: string) => void;
  updateEmailVerification: (email: string) => void;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}
