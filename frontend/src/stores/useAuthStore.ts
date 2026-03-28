import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {User, AuthState} from '@/types/auth';

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
          user: null,
          token: null,

          login: (userData, token) => set({user: userData, token: token}),
          logout: () => set({user: null, token: null}),
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
