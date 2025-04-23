import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

// Define custom shadow type
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      navbar: string;
      card: string;
      button: string;
    };
  }
  
  interface ThemeOptions {
    customShadows?: {
      navbar?: string;
      card?: string;
      button?: string;
    };
  }
}

// Create theme with customizations
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#3a6ea5',
      light: '#90caf9',
      dark: '#2c5282',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6b6b',
      light: '#ffada9',
      dark: '#e64a4a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#64748b',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          direction: 'rtl',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.3s, transform 0.3s',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
        },
      },
    },
  },
  // Custom shadows
  customShadows: {
    navbar: '0 1px 3px rgba(0,0,0,0.12)',
    card: '0 2px 8px rgba(0,0,0,0.05)',
    button: '0 3px 6px rgba(58, 110, 165, 0.2)',
  },
});

// Add lighter variants for some colors
const { palette } = theme;

(palette.primary as any).lighter = alpha(palette.primary.main, 0.08);
(palette.secondary as any).lighter = alpha(palette.secondary.main, 0.08);
(palette.success as any).lighter = alpha(palette.success.main, 0.08);
(palette.warning as any).lighter = alpha(palette.warning.main, 0.08);
(palette.info as any).lighter = alpha(palette.info.main, 0.08);

export default theme;
