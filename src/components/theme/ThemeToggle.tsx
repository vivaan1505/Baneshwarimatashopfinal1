import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore, ThemeMode } from '../../stores/themeStore';

const ThemeToggle: React.FC = () => {
  const { mode, setMode } = useThemeStore();

  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label="Toggle theme"
    >
      {mode === 'light' && <Sun className="h-5 w-5" />}
      {mode === 'dark' && <Moon className="h-5 w-5" />}
      {mode === 'system' && <Monitor className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;