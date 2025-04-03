import React, { useState, useEffect, useRef } from 'react';
import { Settings, X } from 'lucide-react';

const AppSettings = ({ className }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontType, setFontType] = useState('sans-serif');
  const [fontSize, setFontSize] = useState('text-base');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && 
          !event.target.closest('button[title="Settings"]')) {
        if (isSettingsOpen) setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen]);

  // Apply font and dark mode settings
  useEffect(() => {
    // Apply font type to the root element
    document.documentElement.style.fontFamily = fontType;
    
    // Apply font family to reading pane text
    document.querySelectorAll('.bibleReadingSection .prose, .verse-number-container').forEach(el => {
      el.style.fontFamily = fontType;
    });
    
    // Apply font size class (using Tailwind classes)
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    document.documentElement.classList.add(fontSize);
    
    // Apply font size to reading pane
    const fontSizePixels = {
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem'
    };
    
    document.querySelectorAll('.bibleReadingSection .prose').forEach(el => {
      el.style.fontSize = fontSizePixels[fontSize] || '1rem';
    });
    
    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-gray-100');
      
      // Apply dark mode to specific elements
      document.querySelectorAll('.bg-white').forEach(el => {
        el.classList.remove('bg-white');
        el.classList.add('bg-gray-800');
      });
      
      // Section headings, paragraph text etc.
      document.querySelectorAll('.text-gray-800, .text-gray-700, .text-gray-600, .text-indigo-800').forEach(el => {
        el.classList.add('text-gray-200');
      });
      
      // Bible reading section background
      document.querySelectorAll('.bibleReadingSection').forEach(el => {
        el.classList.remove('bg-white');
        el.classList.add('bg-gray-800');
      });
      
      // Verse text
      document.querySelectorAll('.bibleReadingSection .text-gray-800').forEach(el => {
        el.classList.remove('text-gray-800');
        el.classList.add('text-gray-200');
      });
      
      // Various borders
      document.querySelectorAll('.border-gray-200, .border-gray-100').forEach(el => {
        el.classList.remove('border-gray-200', 'border-gray-100');
        el.classList.add('border-gray-700');
      });
      
      // Buttons and interactive elements
      document.querySelectorAll('.bg-indigo-50, .bg-gray-50').forEach(el => {
        el.classList.remove('bg-indigo-50', 'bg-gray-50');
        el.classList.add('bg-gray-700');
      });
      
      // Navigation chapter buttons
      document.querySelectorAll('.bg-indigo-50.text-indigo-700').forEach(el => {
        el.classList.remove('bg-indigo-50', 'hover:bg-indigo-100');
        el.classList.add('bg-indigo-900', 'hover:bg-indigo-800');
        el.classList.remove('text-indigo-700');
        el.classList.add('text-indigo-200');
      });
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900', 'text-gray-100');
      
      // Revert dark mode styles
      document.querySelectorAll('.bg-gray-800').forEach(el => {
        el.classList.remove('bg-gray-800');
        el.classList.add('bg-white');
      });
      
      // Revert text colors
      document.querySelectorAll('.text-gray-200').forEach(el => {
        el.classList.remove('text-gray-200');
        // Restore original classes based on element type
        if (el.matches('h4')) {
          el.classList.add('text-indigo-800');
        } else {
          el.classList.add('text-gray-800');
        }
      });
      
      // Revert borders
      document.querySelectorAll('.border-gray-700').forEach(el => {
        el.classList.remove('border-gray-700');
        el.classList.add('border-gray-200');
      });
      
      // Revert buttons
      document.querySelectorAll('.bg-gray-700').forEach(el => {
        el.classList.remove('bg-gray-700');
        // Check button type to apply correct class
        if (el.classList.contains('text-indigo-200')) {
          el.classList.add('bg-indigo-50');
        } else {
          el.classList.add('bg-gray-50');
        }
      });
      
      // Revert navigation buttons
      document.querySelectorAll('.bg-indigo-900.text-indigo-200').forEach(el => {
        el.classList.remove('bg-indigo-900', 'hover:bg-indigo-800', 'text-indigo-200');
        el.classList.add('bg-indigo-50', 'hover:bg-indigo-100', 'text-indigo-700');
      });
    }
    
    // Store settings in localStorage
    localStorage.setItem('bibleAppSettings', JSON.stringify({
      fontType,
      fontSize,
      isDarkMode
    }));
  }, [fontType, fontSize, isDarkMode]);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('bibleAppSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setFontType(settings.fontType || 'sans-serif');
        setFontSize(settings.fontSize || 'text-base');
        setIsDarkMode(settings.isDarkMode || false);
      } catch (e) {
        console.error('Error parsing saved settings:', e);
      }
    }
  }, []);

  // Font options
  const fontOptions = [
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
    { value: 'Palatino, serif', label: 'Palatino' }
  ];

  // Font size options
  const fontSizeOptions = [
    { value: 'text-sm', label: 'Small' },
    { value: 'text-base', label: 'Medium' },
    { value: 'text-lg', label: 'Large' },
    { value: 'text-xl', label: 'X-Large' }
  ];

  return (
    <div className={`relative ${className || ''}`}>
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="flex items-center py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
        title="Settings"
      >
        <Settings size={16} />
      </button>
      
      {isSettingsOpen && (
        <div 
          ref={panelRef}
          className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Settings</h3>
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Font Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Font Type
            </label>
            <select
              value={fontType}
              onChange={(e) => setFontType(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-800 dark:text-gray-200"
            >
              {fontOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Font Size */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-800 dark:text-gray-200"
            >
              {fontSizeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dark Mode
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="dark-mode-toggle"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                style={{
                  transition: 'transform 0.3s ease-in-out',
                  transform: isDarkMode ? 'translateX(100%)' : 'translateX(0)',
                  borderColor: isDarkMode ? '#4c1d95' : '#cbd5e0'
                }}
              />
              <label
                htmlFor="dark-mode-toggle"
                className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer"
                style={{
                  background: isDarkMode ? '#8b5cf6' : '#e2e8f0'
                }}
              ></label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSettings;
