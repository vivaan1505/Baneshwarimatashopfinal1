import React, { useEffect } from 'react';
import { useThemeStore } from '../../stores/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { 
    mode, 
    seasonalTheme, 
    colorScheme, 
    fontFamily,
    viewMode
  } = useThemeStore();

  useEffect(() => {
    // Handle theme mode (light/dark/system)
    const root = window.document.documentElement;
    
    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(mode);
    }

    // Handle seasonal themes
    root.classList.remove('theme-default', 'theme-christmas', 'theme-summer', 'theme-autumn', 'theme-spring');
    root.classList.add(`theme-${seasonalTheme}`);

    // Handle color schemes
    root.classList.remove('colors-default', 'colors-blue', 'colors-green', 'colors-purple', 'colors-pink');
    root.classList.add(`colors-${colorScheme}`);

    // Handle font families
    root.classList.remove(
      'font-default', 
      'font-serif', 
      'font-sans-serif', 
      'font-monospace', 
      'font-cormorant', 
      'font-montserrat', 
      'font-poppins', 
      'font-lora'
    );
    root.classList.add(`font-${fontFamily}`);

    // Handle view mode (for preview purposes)
    root.classList.remove('view-desktop', 'view-mobile', 'view-tablet');
    root.classList.add(`view-${viewMode}`);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, seasonalTheme, colorScheme, fontFamily, viewMode]);

  return <>{children}</>;
};

export default ThemeProvider;