import React, { useState } from 'react';
import { Sun, Moon, Monitor, Palette, Type, Layout, Smartphone, Tablet, Monitor as Desktop, X, Snowflake, Flower, Leaf, Sun as SummerIcon, Check, Ghost, Heart, Egg, Sparkles, Flame, Clover, Flag, GraduationCap, ShoppingCart, Grid, Columns, Layers, Video, Split, Sliders as Slideshow, LayoutGrid, Maximize, BookOpen, Store, Feather, Minimize2, BoldIcon, Crown } from 'lucide-react';
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
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl shadow-xl">
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-medium dark:text-white">Theme & Layout Manager</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <button
                      onClick={() => setSeasonalTheme('winter')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'winter'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Snowflake className={`h-6 w-6 mb-2 ${seasonalTheme === 'winter' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'winter' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Winter</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('halloween')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'halloween'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Ghost className={`h-6 w-6 mb-2 ${seasonalTheme === 'halloween' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'halloween' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Halloween</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('valentine')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'valentine'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Heart className={`h-6 w-6 mb-2 ${seasonalTheme === 'valentine' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'valentine' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Valentine</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('easter')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'easter'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Egg className={`h-6 w-6 mb-2 ${seasonalTheme === 'easter' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'easter' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Easter</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('diwali')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'diwali'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Sparkles className={`h-6 w-6 mb-2 ${seasonalTheme === 'diwali' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'diwali' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Diwali</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('lunar-new-year')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'lunar-new-year'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Sparkles className={`h-6 w-6 mb-2 ${seasonalTheme === 'lunar-new-year' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'lunar-new-year' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Lunar New Year</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('thanksgiving')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'thanksgiving'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Flame className={`h-6 w-6 mb-2 ${seasonalTheme === 'thanksgiving' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'thanksgiving' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Thanksgiving</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('st-patricks')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'st-patricks'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Clover className={`h-6 w-6 mb-2 ${seasonalTheme === 'st-patricks' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'st-patricks' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>St. Patrick's</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('independence')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'independence'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Flag className={`h-6 w-6 mb-2 ${seasonalTheme === 'independence' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'independence' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Independence</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('back-to-school')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'back-to-school'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <GraduationCap className={`h-6 w-6 mb-2 ${seasonalTheme === 'back-to-school' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'back-to-school' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Back to School</span>
                    </button>
                    <button
                      onClick={() => setSeasonalTheme('cyber-monday')}
                      className={`p-4 rounded-lg border ${
                        seasonalTheme === 'cyber-monday'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <ShoppingCart className={`h-6 w-6 mb-2 ${seasonalTheme === 'cyber-monday' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${seasonalTheme === 'cyber-monday' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Cyber Monday</span>
                    </button>
                  </div>
                </div>

                {/* Color Schemes */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Color Scheme</h3>
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
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
                    <button
                      onClick={() => setColorScheme('teal')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'teal'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-teal-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'teal' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Teal</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('amber')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'amber'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'amber' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Amber</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('rose')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'rose'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-rose-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'rose' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Rose</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('emerald')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'emerald'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'emerald' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Emerald</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('indigo')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'indigo'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'indigo' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Indigo</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('sky')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'sky'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-sky-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'sky' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Sky</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('lime')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'lime'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-lime-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'lime' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Lime</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('slate')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'slate'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'slate' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Slate</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('neutral')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'neutral'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-neutral-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'neutral' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Neutral</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('red')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'red'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-red-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'red' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Red</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('orange')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'orange'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'orange' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Orange</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('yellow')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'yellow'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-yellow-500 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'yellow' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Yellow</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('cyan')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'cyan'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-cyan-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'cyan' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Cyan</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('fuchsia')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'fuchsia'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-fuchsia-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'fuchsia' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Fuchsia</span>
                    </button>
                    <button
                      onClick={() => setColorScheme('violet')}
                      className={`p-4 rounded-lg border ${
                        colorScheme === 'violet'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <div className="w-6 h-6 rounded-full bg-violet-600 mb-2"></div>
                      <span className={`text-sm ${colorScheme === 'violet' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Violet</span>
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
                    <button
                      onClick={() => setFontFamily('playfair')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'playfair'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'playfair' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span style={{fontFamily: 'Playfair Display'}} className={`text-sm ${fontFamily === 'playfair' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Playfair</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('roboto')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'roboto'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'roboto' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'roboto' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Roboto</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('oswald')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'oswald'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'oswald' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'oswald' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Oswald</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('raleway')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'raleway'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'raleway' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'raleway' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Raleway</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('merriweather')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'merriweather'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'merriweather' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'merriweather' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Merriweather</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('nunito')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'nunito'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'nunito' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'nunito' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Nunito</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('quicksand')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'quicksand'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'quicksand' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'quicksand' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Quicksand</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('josefin')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'josefin'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'josefin' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'josefin' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Josefin</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('crimson')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'crimson'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'crimson' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'crimson' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Crimson</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('mulish')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'mulish'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'mulish' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'mulish' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Mulish</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('karla')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'karla'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'karla' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'karla' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Karla</span>
                    </button>
                    <button
                      onClick={() => setFontFamily('inter')}
                      className={`p-4 rounded-lg border ${
                        fontFamily === 'inter'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center transition-all hover:shadow-md`}
                    >
                      <Type className={`h-6 w-6 mb-2 ${fontFamily === 'inter' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className={`text-sm ${fontFamily === 'inter' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Inter</span>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <button
                      onClick={() => setHomeLayout('modern-grid')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'modern-grid'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Grid className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'modern-grid' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Modern Grid</span>
                      {homeLayout === 'modern-grid' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('magazine')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'magazine'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Columns className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'magazine' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Magazine</span>
                      {homeLayout === 'magazine' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('lookbook')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'lookbook'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Layers className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'lookbook' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Lookbook</span>
                      {homeLayout === 'lookbook' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('parallax')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'parallax'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Layers className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'parallax' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Parallax</span>
                      {homeLayout === 'parallax' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('video-hero')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'video-hero'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Video className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'video-hero' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Video Hero</span>
                      {homeLayout === 'video-hero' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('split-screen')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'split-screen'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Split className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'split-screen' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Split Screen</span>
                      {homeLayout === 'split-screen' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('carousel')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'carousel'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Slideshow className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'carousel' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Carousel</span>
                      {homeLayout === 'carousel' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('masonry')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'masonry'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <LayoutGrid className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'masonry' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Masonry</span>
                      {homeLayout === 'masonry' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('fullscreen-slider')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'fullscreen-slider'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Maximize className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'fullscreen-slider' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Fullscreen</span>
                      {homeLayout === 'fullscreen-slider' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('editorial')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'editorial'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <BookOpen className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'editorial' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Editorial</span>
                      {homeLayout === 'editorial' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('boutique')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'boutique'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Store className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'boutique' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Boutique</span>
                      {homeLayout === 'boutique' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('elegant')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'elegant'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Feather className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'elegant' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Elegant</span>
                      {homeLayout === 'elegant' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('minimalist')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'minimalist'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Minimize2 className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'minimalist' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Minimalist</span>
                      {homeLayout === 'minimalist' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('bold')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'bold'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <BoldIcon className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'bold' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Bold</span>
                      {homeLayout === 'bold' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('luxury')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'luxury'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Crown className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'luxury' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Luxury</span>
                      {homeLayout === 'luxury' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setHomeLayout('contemporary')}
                      className={`p-4 rounded-lg border ${
                        homeLayout === 'contemporary'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } flex flex-col items-center relative transition-all hover:shadow-md`}
                    >
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 relative overflow-hidden">
                        <Grid className="absolute inset-0 m-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <span className={`text-sm ${homeLayout === 'contemporary' ? 'font-medium text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>Contemporary</span>
                      {homeLayout === 'contemporary' && (
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