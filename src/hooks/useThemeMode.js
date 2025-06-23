// src/hooks/useThemeMode.js
import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'app-theme-mode';

export const useThemeMode = () => {
  // Obtener tema inicial del localStorage o usar 'light' por defecto
  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && (saved === 'light' || saved === 'dark')) {
        return saved;
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }
    return 'light';
  };

  const [mode, setMode] = useState(getInitialTheme);

  // Guardar tema en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [mode]);

  // Función para alternar entre temas
  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // Función para establecer tema específico
  const setThemeMode = (newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      setMode(newMode);
    }
  };

  return {
    mode,
    toggleTheme,
    setThemeMode,
    isDark: mode === 'dark'
  };
};

export default useThemeMode;