// src/contexts/ThemeContext.jsx
import React, { createContext, useContext } from 'react';
import { useThemeMode } from '../hooks/useThemeMode';

const ThemeContext = createContext();

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  const { mode, toggleTheme, setThemeMode, isDark } = useThemeMode();

  const value = {
    mode,
    toggleTheme,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;