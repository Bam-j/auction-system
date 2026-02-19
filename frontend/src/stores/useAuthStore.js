import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
          user: null,
          accessToken: null,

          login: (user, token) => set({user, accessToken: token}),
          logout: () => set({user: null, accessToken: null}),
          updateNickname: (newNickname) => set((state) => ({
            user: state.user ? {...state.user, nickname: newNickname} : null
          })),
        }),
        {
          name: 'auth-storage',
          storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;
