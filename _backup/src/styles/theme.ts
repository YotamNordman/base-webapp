import { createTheme } from '@mui/material/styles';

// Simplified theme with basic settings
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
  },
});

// Add custom shadows to the theme
theme.shadows[1] = '0 2px 4px rgba(0,0,0,0.1)';

export default theme;
