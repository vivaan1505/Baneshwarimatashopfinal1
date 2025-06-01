import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type SeasonalTheme = 'default' | 'christmas' | 'summer' | 'autumn' | 'spring';
export type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'pink';
export type FontFamily = 'default' | 'serif' | 'sans-serif' | 'monospace';
export type ViewMode = 'desktop' | 'mobile' | 'tablet';
export type LayoutType = 'default' | 'featured-collections' | 'hero-centered' | 'minimal';

interface ThemeState {
  mode: ThemeMode;
  seasonalTheme: SeasonalTheme;
  colorScheme: ColorScheme;
  fontFamily: FontFamily;
  viewMode: ViewMode;
  homeLayout: LayoutType;
  setMode: (mode: ThemeMode) => void;
  setSeasonalTheme: (theme: SeasonalTheme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setFontFamily: (font: FontFamily) => void;
  setViewMode: (view: ViewMode) => void;
  setHomeLayout: (layout: LayoutType) => void;
  resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      seasonalTheme: 'default',
      colorScheme: 'default',
      fontFamily: 'default',
      viewMode: 'desktop',
      homeLayout: 'default',
      
      setMode: (mode) => set({ mode }),
      setSeasonalTheme: (seasonalTheme) => set({ seasonalTheme }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setViewMode: (viewMode) => set({ viewMode }),
      setHomeLayout: (homeLayout) => set({ homeLayout }),
      
      resetTheme: () => set({
        mode: 'light',
        seasonalTheme: 'default',
        colorScheme: 'default',
        fontFamily: 'default',
        viewMode: 'desktop',
        homeLayout: 'default'
      })
    }),
    {
      name: 'theme-settings',
    }
  )
);