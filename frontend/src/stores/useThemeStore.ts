import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
          isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
          toggleDarkMode: () => {
            const newMode = !get().isDarkMode;
            set({isDarkMode: newMode});
            if (newMode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          },
          setDarkMode: (isDark: boolean) => {
            set({isDarkMode: isDark});
            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          },
        }),
        {
          name: 'theme-storage',
        }
    )
);
