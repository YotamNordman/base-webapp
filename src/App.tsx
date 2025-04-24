import React from 'react';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { 
  BrowserRouter as Router, 
  useRoutes, 
  RouteObject 
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './App.css';
import theme from './styles/theme';
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/dashboard';
import Login from './pages/auth/Login';
import NotFound from './pages/error/NotFound';
import { 
  ClientDetails, 
  ClientCreatePage, 
  ClientEditPage,
  ClientListPage
} from './pages/clients';
import WorkoutListPage from './pages/workouts/WorkoutListPage';
import WorkoutDetailPage from './pages/workouts/WorkoutDetailPage';
import WorkoutFormPage from './pages/workouts/WorkoutFormPage';
import RIRTrackingDemo from './pages/workouts/RIRTrackingDemo';
import { CalendarPage } from './pages/calendar';
import { 
  ExerciseListPage, 
  ExerciseDetailPage, 
  ExerciseFormPage,
  CategoryFormPage
} from './pages/exercises';
import {
  TrainingBlockListPage,
  TrainingBlockDetailPage
} from './pages/training';
import { ReportsPage } from './pages/reports';
import Settings from './pages/settings/Settings';
import { ProfilePage } from './pages/profile';
import MainLayout from './layouts/MainLayout';

// Create rtl cache for right-to-left text direction
const cacheRtl = createCache({
  key: 'mui-rtl',
  stylisPlugins: [rtlPlugin],
});

// Define routes here to avoid circular dependency
const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'workouts',
        children: [
          {
            index: true,
            element: <WorkoutListPage />
          },
          {
            path: 'new',
            element: <WorkoutFormPage />
          },
          {
            path: ':id',
            element: <WorkoutDetailPage />
          },
          {
            path: ':id/edit',
            element: <WorkoutFormPage />
          },
          {
            path: 'rir-demo',
            element: <RIRTrackingDemo />
          }
        ]
      },
      {
        path: 'exercises',
        children: [
          {
            index: true,
            element: <ExerciseListPage />
          },
          {
            path: 'templates/new',
            element: <ExerciseFormPage />
          },
          {
            path: 'templates/:id',
            element: <ExerciseDetailPage />
          },
          {
            path: 'templates/:id/edit',
            element: <ExerciseFormPage />
          },
          {
            path: 'categories/new',
            element: <CategoryFormPage />
          },
          {
            path: 'categories/:id/edit',
            element: <CategoryFormPage />
          }
        ]
      },
      {
        path: 'training',
        children: [
          {
            path: 'blocks',
            children: [
              {
                index: true,
                element: <TrainingBlockListPage />
              },
              {
                path: ':id',
                element: <TrainingBlockDetailPage />
              }
            ]
          }
        ]
      },
      {
        path: 'clients',
        children: [
          {
            index: true,
            element: <ClientListPage />
          },
          {
            path: 'new',
            element: <ClientCreatePage />
          },
          {
            path: ':id',
            element: <ClientDetails />
          },
          {
            path: ':id/edit',
            element: <ClientEditPage />
          }
        ]
      },
      {
        path: 'calendar',
        element: <CalendarPage />
      },
      {
        path: 'reports',
        element: <ReportsPage />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

// The app with routing
const AppContent = () => {
  const { loading } = useAuth();
  const routeElement = useRoutes(appRoutes);
  
  // Force authentication with a mock login
  React.useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      // Auto login for development
      const autoLogin = async () => {
        const mockUser = {
          id: "dev-user-123",
          name: "Developer",
          email: "dev@example.com",
          role: "admin"
        };
        localStorage.setItem('token', 'mock-token-for-development');
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Refresh the page to apply auth
        window.location.reload();
      };
      
      autoLogin();
    }
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return routeElement;
};

function App() {
  return (
    <Provider store={store}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}

export default App;