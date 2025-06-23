// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f57c00',
      light: '#ffb74d',
      dark: '#e65100',
      contrastText: '#000000',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.9)',
      secondary: 'rgba(0, 0, 0, 0.7)',
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
    fontSize: 16, // Increased from default 14
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
          minHeight: 48, // WCAG AA compliance
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
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
  },
});

export default theme;