import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
          user: null,
          accessToken: null,

          //로그인 시 유저 정보, 토큰 저장
          login: (user, token) => set({user, accessToken: token}),

          //로그아웃 시 초기화
          logout: () => set({user: null, accessToken: null}),
        }),
        { //로컬 스토리지에 저장하기
          name: 'auth-storage',
          storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;
