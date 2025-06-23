// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

// Función para crear tema basado en el modo
const createAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#90caf9' : '#1976d2',
        light: isDark ? '#b3d4fc' : '#42a5f5',
        dark: isDark ? '#5a9fd4' : '#1565c0',
        contrastText: isDark ? '#000000' : '#ffffff',
      },
      secondary: {
        main: isDark ? '#81c784' : '#4caf50',
        light: isDark ? '#a5d6a7' : '#81c784',
        dark: isDark ? '#66bb6a' : '#388e3c',
        contrastText: isDark ? '#000000' : '#ffffff',
      },
      error: {
        main: isDark ? '#f44336' : '#d32f2f',
        light: isDark ? '#e57373' : '#ef5350',
        dark: isDark ? '#d32f2f' : '#c62828',
        contrastText: '#ffffff',
      },
      warning: {
        main: isDark ? '#ffb74d' : '#f57c00',
        light: isDark ? '#ffcc02' : '#ffb74d',
        dark: isDark ? '#f57c00' : '#e65100',
        contrastText: isDark ? '#000000' : '#ffffff',
      },
      success: {
        main: isDark ? '#66bb6a' : '#2e7d32',
        light: isDark ? '#81c784' : '#4caf50',
        dark: isDark ? '#4caf50' : '#1b5e20',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#0a0a0a' : '#f8f9fa',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
        secondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        disabled: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
      },
      // Colores personalizados para modo oscuro
      grey: {
        50: isDark ? '#fafafa' : '#fafafa',
        100: isDark ? '#f5f5f5' : '#f5f5f5',
        200: isDark ? '#eeeeee' : '#eeeeee',
        300: isDark ? '#424242' : '#e0e0e0',
        400: isDark ? '#616161' : '#bdbdbd',
        500: isDark ? '#757575' : '#9e9e9e',
        600: isDark ? '#9e9e9e' : '#757575',
        700: isDark ? '#bdbdbd' : '#616161',
        800: isDark ? '#e0e0e0' : '#424242',
        900: isDark ? '#f5f5f5' : '#212121',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      fontSize: 16,
      htmlFontSize: 16,
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1.1rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1.1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      button: {
        fontSize: '1rem',
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    spacing: 8,
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            minHeight: 48,
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isDark 
                ? '0 4px 12px rgba(255,255,255,0.1)' 
                : '0 4px 12px rgba(0,0,0,0.15)',
            },
            '&:focus': {
              outline: '2px solid',
              outlineOffset: '2px',
            },
          },
          sizeLarge: {
            minHeight: 56,
            padding: '16px 32px',
            fontSize: '1.1rem',
          },
          sizeSmall: {
            minHeight: 40,
            padding: '8px 16px',
            fontSize: '0.9rem',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            minWidth: 48,
            minHeight: 48,
            padding: 12,
            '&:focus': {
              outline: '2px solid',
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDark 
              ? '0 2px 12px rgba(0,0,0,0.3)' 
              : '0 2px 12px rgba(0,0,0,0.08)',
            borderRadius: 16,
            border: isDark 
              ? '1px solid rgba(255,255,255,0.1)' 
              : '1px solid rgba(0,0,0,0.05)',
            '&:hover': {
              boxShadow: isDark 
                ? '0 4px 20px rgba(0,0,0,0.4)' 
                : '0 4px 20px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              fontSize: '1.1rem',
              minHeight: 56,
            },
            '& .MuiInputLabel-root': {
              fontSize: '1rem',
            },
            '& .MuiFormHelperText-root': {
              fontSize: '0.9rem',
              marginTop: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontSize: '0.9rem',
            height: 36,
            '& .MuiChip-label': {
              padding: '0 12px',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            minHeight: 56,
            padding: '12px 16px',
            borderRadius: 8,
            margin: '4px 8px',
            '&:focus': {
              outline: '2px solid',
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: '1rem',
            fontWeight: 500,
          },
          secondary: {
            fontSize: '0.9rem',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontSize: '1rem',
            padding: '16px',
          },
          head: {
            fontSize: '1.1rem',
            fontWeight: 600,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            fontSize: '1rem',
            padding: '16px',
            borderRadius: 12,
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            '& .MuiSnackbarContent-root': {
              fontSize: '1rem',
              minWidth: 300,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            borderRight: isDark 
              ? '1px solid rgba(255,255,255,0.12)' 
              : '1px solid rgba(0,0,0,0.08)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            borderBottom: isDark 
              ? '1px solid rgba(255,255,255,0.12)' 
              : '1px solid rgba(0,0,0,0.08)',
          },
        },
      },
    },
  });
};

// Exportar tema por defecto (modo claro)
const theme = createAppTheme('light');

export default theme;
export { createAppTheme };