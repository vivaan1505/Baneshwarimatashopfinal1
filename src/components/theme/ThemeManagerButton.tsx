import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import ThemeManager from './ThemeManager';

const ThemeManagerButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Theme manager"
      >
        <Palette className="h-5 w-5" />
      </button>
      
      <ThemeManager isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ThemeManagerButton;