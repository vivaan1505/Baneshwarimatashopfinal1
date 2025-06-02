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
    const seasonalThemeClasses = [
      'theme-default', 'theme-christmas', 'theme-summer', 'theme-autumn', 'theme-spring', 
      'theme-winter', 'theme-halloween', 'theme-valentine', 'theme-easter', 'theme-diwali', 
      'theme-lunar-new-year', 'theme-thanksgiving', 'theme-st-patricks', 'theme-independence', 
      'theme-back-to-school', 'theme-cyber-monday'
    ];
    seasonalThemeClasses.forEach(cls => root.classList.remove(cls));
    root.classList.add(`theme-${seasonalTheme}`);

    // Handle color schemes
    const colorSchemeClasses = [
      'colors-default', 'colors-blue', 'colors-green', 'colors-purple', 'colors-pink', 
      'colors-teal', 'colors-amber', 'colors-rose', 'colors-emerald', 'colors-indigo', 
      'colors-sky', 'colors-lime', 'colors-slate', 'colors-neutral', 'colors-red', 
      'colors-orange', 'colors-yellow', 'colors-cyan', 'colors-fuchsia', 'colors-violet'
    ];
    colorSchemeClasses.forEach(cls => root.classList.remove(cls));
    root.classList.add(`colors-${colorScheme}`);

    // Handle font families
    const fontFamilyClasses = [
      'font-default', 'font-serif', 'font-sans-serif', 'font-monospace', 
      'font-cormorant', 'font-montserrat', 'font-poppins', 'font-lora', 
      'font-playfair', 'font-roboto', 'font-oswald', 'font-raleway', 
      'font-merriweather', 'font-nunito', 'font-quicksand', 'font-josefin', 
      'font-crimson', 'font-mulish', 'font-karla', 'font-inter'
    ];
    fontFamilyClasses.forEach(cls => root.classList.remove(cls));
    root.classList.add(`font-${fontFamily}`);

    // Handle view mode (for preview purposes)
    const viewModeClasses = ['view-desktop', 'view-mobile', 'view-tablet'];
    viewModeClasses.forEach(cls => root.classList.remove(cls));
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