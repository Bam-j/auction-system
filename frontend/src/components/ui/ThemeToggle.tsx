import {FC, useEffect} from 'react';

import {SunIcon, MoonIcon} from '@heroicons/react/24/outline';
import {IconButton} from '@material-tailwind/react';

import {useThemeStore} from '@/stores/useThemeStore';

const ThemeToggle: FC = () => {
  const {isDarkMode, toggleDarkMode} = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
      <IconButton
          variant='text'
          color='blue-gray'
          onClick={toggleDarkMode}
          className='rounded-full'
      >
        {isDarkMode ? (
            <SunIcon className='h-5 w-5 text-yellow-500'/>
        ) : (
            <MoonIcon className='h-5 w-5 text-blue-gray-900'/>
        )}
      </IconButton>
  );
};

export default ThemeToggle;
