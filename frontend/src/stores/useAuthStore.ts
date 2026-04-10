import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {AuthState} from '@/types/auth';

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
          user: null,
          token: null,
          refreshToken: null,

          login: (userData, token, refreshToken) =>
              set({user: userData, token: token, refreshToken: refreshToken}),
          logout: () => set({user: null, token: null, refreshToken: null}),
          setUser: (userData) => set({user: userData}),
          setToken: (token) => set({token: token}),
          setRefreshToken: (refreshToken) => set({refreshToken: refreshToken}),
          updateNickname: (newNickname) =>
              set((state) => ({
                user: state.user ? {...state.user, nickname: newNickname} : null,
              })),
          updateEmailVerification: (email) =>
              set((state) => ({
                user: state.user ? {...state.user, email: email, isVerified: true} : null,
              })),
        }),
        {
          name: 'auth-storage',
        }
    )
);

export default useAuthStore;
