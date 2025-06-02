import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Type, 
  Layout, 
  Smartphone, 
  Tablet, 
  Monitor as Desktop,
  X,
  Snowflake,
  Flower,
  Leaf,
  Sun as SummerIcon,
  Check
} from 'lucide-react';
import { 
  useThemeStore, 
  ThemeMode, 
  SeasonalTheme, 
  ColorScheme, 
  FontFamily,
  ViewMode,
  LayoutType
} from '../../stores/themeStore';

interface ThemeManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeManager: React.FC<ThemeManagerProps> = ({ isOpen, onClose }) => {
  const { 
    mode, 
    seasonalTheme, 
    colorScheme, 
    fontFamily, 
    viewMode,
    homeLayout,
    setMode, 
    setSeasonalTheme, 
    setColorScheme, 
    setFontFamily,
    setViewMode,
    setHomeLayout,
    resetTheme
  } = useThemeStore();

  const [activeTab, setActiveTab] = useState<'theme' | 'layout'>('theme');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl">
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-medium dark:text-white">Theme & Layout Manager</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex border-b dark:border-gray-700 mb-6">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'theme'
                    ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                } transition-colors`}
                onClick={() => setActiveTab('theme')}
              >
                <div className="flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Theme Settings
                </div>
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'layout'
                    ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                } transition-colors`}
                onClick={() => setActiveTab('layout')}
              >
                <div className="flex items-center">
                  <Layout className="w-4 h-4 mr-2" />
                  Layout Settings
                </div>
              </button>
            </div>

            {activeTab === 'theme' && (
              <div className="space-y-6">
                {/* Theme Mode */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Mode</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setMode('light')}
                      className={`p-4 rounded-lg border ${
                        mode === 'light'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Sun className={`h-6 w-6 mb-2 ${mode === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${mode === 'light' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Light</span>
                    </button>
                    <button
                      onClick={() => setMode('dark')}
                      className={`p-4 rounded-lg border ${
                        mode === 'dark'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Moon className={`h-6 w-6 mb-2 ${mode === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${mode === 'dark' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Dark</span>
                    </button>
                    <button
                      onClick={() => setMode('system')}
                      className={`p-4 rounded-lg border ${
                        mode === 'system'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Monitor className={`h-6 w-6 mb-2 ${mode === 'system' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${mode === 'system' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>System</span>
                    </button>
                  </div>
                </div>

                {/* Seasonal Themes */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Seasonal Theme</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    <button
                      onClick={() => setSeasonalTheme('default')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'default'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Palette className={`h-6 w-6 mb-2 ${seasonalTheme === 'default' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'default' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Default</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('christmas')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'christmas'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Snowflake className={`h-6 w-6 mb-2 ${seasonalTheme === 'christmas' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'christmas' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Christmas</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('summer')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'summer'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <SummerIcon className={`h-6 w-6 mb-2 ${seasonalTheme === 'summer' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'summer' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Summer</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('autumn')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'autumn'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Leaf className={`h-6 w-6 mb-2 ${seasonalTheme === 'autumn' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'autumn' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Autumn</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('spring')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'spring'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Flower className={`h-6 w-6 mb-2 ${seasonalTheme === 'spring' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'spring' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Spring</span>
                    </button>
                  </div>
                </div>

                {/* Color Schemes */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Color Scheme</h3>
                  <div className="grid grid-cols-5 gap-4">
                    <button
                      onClick={() => setColorScheme('default')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'default'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'default' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Default</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('blue')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'blue'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'blue' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Blue</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('green')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'green'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-green-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'green' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Green</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('purple')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'purple'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'purple' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Purple</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('pink')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'pink'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-pink-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'pink' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Pink</span>
                    </button>
                  </div>
                </div>

                {/* Font Families */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Font Family</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setFontFamily('default')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'default'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'default' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'default' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Default</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('serif')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'serif'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'serif' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm font-serif ${fontFamily === 'serif' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Serif</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('sans-serif')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'sans-serif'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'sans-serif' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm font-sans ${fontFamily === 'sans-serif' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Sans-serif</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('monospace')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'monospace'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'monospace' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm font-mono ${fontFamily === 'monospace' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Monospace</span>
                    </button>
                  </div>
                </div>

                {/* Additional Font Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Specialty Fonts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setFontFamily('cormorant')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'cormorant'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'cormorant' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span style={{fontFamily: 'Cormorant Garamond'}} className={`text-sm ${fontFamily === 'cormorant' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Cormorant</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('montserrat')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'montserrat'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'montserrat' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span style={{fontFamily: 'Montserrat'}} className={`text-sm ${fontFamily === 'montserrat' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Montserrat</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('poppins')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'poppins'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'poppins' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span style={{fontFamily: 'Poppins'}} className={`text-sm ${fontFamily === 'poppins' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Poppins</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('lora')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'lora'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'lora' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span style={{fontFamily: 'Lora'}} className={`text-sm ${fontFamily === 'lora' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Lora</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                {/* View Mode */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview Mode</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setViewMode('desktop')}
                      className={`p-4 rounded-lg border ${
                        viewMode === 'desktop'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Desktop className={`h-6 w-6 mb-2 ${viewMode === 'desktop' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${viewMode === 'desktop' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Desktop</span>
                    </button>
                    <button
                      onClick={() => setViewMode('tablet')}
                      className={`p-4 rounded-lg border ${
                        viewMode === 'tablet'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Tablet className={`h-6 w-6 mb-2 ${viewMode === 'tablet' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${viewMode === 'tablet' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Tablet</span>
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`p-4 rounded-lg border ${
                        viewMode === 'mobile'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Smartphone className={`h-6 w-6 mb-2 ${viewMode === 'mobile' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${viewMode === 'mobile' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Home Layout */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Homepage Layout</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setHomeLayout('default')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'default'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="absolute top-10 left-2 right-2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="absolute top-16 left-2 right-2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                      <span className={`text-sm ${homeLayout === 'default' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Modern Slider</span>
                      {homeLayout === 'default' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('featured-collections')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'featured-collections'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="absolute top-8 left-2 w-[calc(50%-8px)] h-14 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="absolute top-8 right-2 w-[calc(50%-8px)] h-14 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                      <span className={`text-sm ${homeLayout === 'featured-collections' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Featured Collections</span>
                      {homeLayout === 'featured-collections' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('hero-centered')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'hero-centered'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3/4 h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                      </div>
                      <span className={`text-sm ${homeLayout === 'hero-centered' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Hero Centered</span>
                      {homeLayout === 'hero-centered' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('minimal')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'minimal'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <div className="absolute top-4 left-4 right-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="absolute top-12 left-4 right-4 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                      <span className={`text-sm ${homeLayout === 'minimal' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Minimal</span>
                      {homeLayout === 'minimal' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={resetTheme}
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;