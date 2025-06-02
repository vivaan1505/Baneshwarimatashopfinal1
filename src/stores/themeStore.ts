import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type SeasonalTheme = 
  'default' | 
  'christmas' | 
  'summer' | 
  'autumn' | 
  'spring' | 
  'winter' | 
  'halloween' | 
  'valentine' | 
  'easter' | 
  'diwali' | 
  'lunar-new-year' | 
  'thanksgiving' | 
  'st-patricks' | 
  'independence' | 
  'back-to-school' | 
  'cyber-monday';

export type ColorScheme = 
  'default' | 
  'blue' | 
  'green' | 
  'purple' | 
  'pink' | 
  'teal' | 
  'amber' | 
  'rose' | 
  'emerald' | 
  'indigo' | 
  'sky' | 
  'lime' | 
  'slate' | 
  'neutral' | 
  'red' | 
  'orange' | 
  'yellow' | 
  'cyan' | 
  'fuchsia' | 
  'violet';

export type FontFamily = 
  'default' | 
  'serif' | 
  'sans-serif' | 
  'monospace' | 
  'cormorant' | 
  'montserrat' | 
  'poppins' | 
  'lora' | 
  'playfair' | 
  'roboto' | 
  'oswald' | 
  'raleway' | 
  'merriweather' | 
  'nunito' | 
  'quicksand' | 
  'josefin' | 
  'crimson' | 
  'mulish' | 
  'karla' | 
  'inter';

export type ViewMode = 'desktop' | 'mobile' | 'tablet';
export type LayoutType = 
  'default' | 
  'featured-collections' | 
  'hero-centered' | 
  'minimal' | 
  'modern-grid' | 
  'magazine' | 
  'lookbook' | 
  'parallax' | 
  'video-hero' | 
  'split-screen' | 
  'carousel' | 
  'masonry' | 
  'fullscreen-slider' | 
  'editorial' | 
  'boutique' | 
  'elegant' | 
  'minimalist' | 
  'bold' | 
  'luxury' | 
  'contemporary';

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