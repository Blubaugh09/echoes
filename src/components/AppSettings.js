import React, { useState, useEffect } from 'react';

const AppSettings = ({ className }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('serif');

  useEffect(() => {
    const savedSettings = localStorage.getItem('bibleAppSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setIsDarkMode(settings.isDarkMode || false);
      setFontSize(settings.fontSize || 'medium');
      setFontFamily(settings.fontFamily || 'serif');
    }
  }, []);

  const handleSettingChange = (setting, value) => {
    switch (setting) {
      case 'darkMode':
        setIsDarkMode(value);
        break;
      case 'fontSize':
        setFontSize(value);
        break;
      case 'fontFamily':
        setFontFamily(value);
        break;
      default:
        break;
    }

    // Save to localStorage
    const currentSettings = {
      isDarkMode,
      fontSize,
      fontFamily,
      [setting]: value
    };
    localStorage.setItem('bibleAppSettings', JSON.stringify(currentSettings));
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <button
        onClick={() => handleSettingChange('darkMode', !isDarkMode)}
        className={`p-2 rounded-lg ${
          isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      
      <select
        value={fontSize}
        onChange={(e) => handleSettingChange('fontSize', e.target.value)}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>

      <select
        value={fontFamily}
        onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        <option value="serif">Serif</option>
        <option value="sans-serif">Sans Serif</option>
      </select>
    </div>
  );
};

export default AppSettings;
