# Migration Guide: Refactoring Base Webapp for Better AI Support

This guide provides step-by-step instructions for migrating the existing Base webapp to the new AI-friendly file structure with smaller, more focused components.

## Migration Approach

The migration will follow an incremental approach:

1. **Set up the new folder structure** without changing functionality
2. **Move and refactor one feature at a time**, starting with smaller components
3. **Extract shared code** into appropriate locations
4. **Update imports** throughout the codebase
5. **Verify functionality** after each significant change

## Phase 1: Initial Setup

### Step 1: Create New Directory Structure

```bash
# Create the main directories
mkdir -p src/assets
mkdir -p src/components/common/{buttons,cards,inputs,layout,navigation,feedback,typography}
mkdir -p src/components/widgets
mkdir -p src/features/{auth,clients,workouts,calendar,analytics,nutrition,messaging}/components
mkdir -p src/features/{auth,clients,workouts,calendar,analytics,nutrition,messaging}/hooks
mkdir -p src/features/{auth,clients,workouts,calendar,analytics,nutrition,messaging}/types
mkdir -p src/features/{auth,clients,workouts,calendar,analytics,nutrition,messaging}/utils
mkdir -p src/hooks
mkdir -p src/layouts/components
mkdir -p src/pages/{auth,dashboard,clients,workouts,calendar,settings,error}
mkdir -p src/services
mkdir -p src/store/slices
mkdir -p src/styles/theme
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/config
```

### Step 2: Create Initial Index Files

Create index.ts files in key directories to enable clean imports:

```ts
// src/components/index.ts
export * from './common';
export * from './widgets';

// src/components/common/index.ts
export * from './buttons';
export * from './cards';
export * from './inputs';
export * from './layout';
export * from './navigation';
export * from './feedback';
export * from './typography';

// Create similar index files for other major directories
```

## Phase 2: Component Refactoring Pattern

Follow this pattern when breaking down large components:

### Example: Refactoring WorkoutCard

1. **Create the component directory**

```bash
mkdir -p src/features/workouts/components/workout-card
```

2. **Extract types to a separate file**

```tsx
// src/features/workouts/types/workout.ts
export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface Workout {
  id: number;
  title: string;
  description?: string;
  scheduledFor: string;
  completed: boolean;
  exercises: Exercise[];
  clientName: string;
}
```

3. **Break down the component into smaller pieces**

```tsx
// src/features/workouts/components/workout-card/WorkoutCardHeader.tsx
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

interface WorkoutCardHeaderProps {
  title: string;
  description?: string;
  clientName: string;
  formattedDate: string;
  completed: boolean;
}

export const WorkoutCardHeader: React.FC<WorkoutCardHeaderProps> = ({
  title,
  description,
  clientName,
  formattedDate,
  completed
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Box>
        <Typography variant="h6" component="h2" align="right" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" align="right" sx={{ mb: 1 }}>
            {description}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" align="right">
          <strong>מתאמן:</strong> {clientName}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="right">
          <strong>מועד:</strong> {formattedDate}
        </Typography>
      </Box>
      <Box>
        <Chip 
          icon={completed ? <CheckCircleIcon /> : <PendingIcon />} 
          label={completed ? "הושלם" : "ממתין"} 
          color={completed ? "success" : "warning"}
          sx={{ mb: 1 }}
        />
      </Box>
    </Box>
  );
};
```

4. **Repeat for other sub-components**

Create similar files for:
- `ExercisesList.tsx`
- `WorkoutCardActions.tsx`
- `WorkoutCardStatus.tsx`

5. **Create the main component that composes the sub-components**

```tsx
// src/features/workouts/components/workout-card/WorkoutCard.tsx
import React from 'react';
import { Card, CardContent } from '@mui/material';
import { WorkoutCardHeader } from './WorkoutCardHeader';
import { ExercisesList } from './ExercisesList';
import { WorkoutCardActions } from './WorkoutCardActions';
import { Workout } from '../../types/workout';

interface WorkoutCardProps extends Workout {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = (props) => {
  // Format the date to be more readable
  const formattedDate = new Date(props.scheduledFor).toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card sx={{ 
      mb: 2, 
      borderRadius: 2, 
      borderRight: props.completed ? '4px solid #4caf50' : '4px solid #ff9800' 
    }}>
      <CardContent>
        <WorkoutCardHeader
          title={props.title}
          description={props.description}
          clientName={props.clientName}
          formattedDate={formattedDate}
          completed={props.completed}
        />
        
        <ExercisesList exercises={props.exercises} />
        
        <WorkoutCardActions
          id={props.id}
          completed={props.completed}
          onComplete={props.onComplete}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
        />
      </CardContent>
    </Card>
  );
};
```

6. **Create an index file to re-export the main component**

```tsx
// src/features/workouts/components/workout-card/index.ts
export * from './WorkoutCard';
```

## Phase 3: Moving Auth-Related Code

The authentication logic is a good starting point for refactoring since it's a well-defined feature.

### Step 1: Move Types

```tsx
// src/features/auth/types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

### Step 2: Create Auth Service

```tsx
// src/features/auth/services/authService.ts
import axios from 'axios';
import { User } from '../types/auth';

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  // Special case for admin login
  if (email === 'admin' && password === 'admin') {
    const mockUser = {
      id: 'admin',
      name: 'מנהל מערכת',
      email: 'admin',
      role: 'coach'
    };
    const mockToken = 'mock-jwt-token-for-admin-user';
    
    return { token: mockToken, user: mockUser };
  }
  
  // Regular API login
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await axios.get('/api/auth/me');
  return response.data;
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};
```

### Step 3: Refactor Auth Context and Hook

```tsx
// src/features/auth/hooks/useAuthProvider.tsx
import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import * as authService from '../services/authService';

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Check for admin token
        if (token === 'mock-jwt-token-for-admin-user') {
          // Set admin user
          setUser({
            id: 'admin',
            name: 'מנהל מערכת',
            email: 'admin',
            role: 'coach'
          });
          setLoading(false);
          return;
        }
        
        // Set token in axios headers
        authService.setAuthToken(token);
        
        try {
          // Get user info
          const user = await authService.fetchCurrentUser();
          setUser(user);
        } catch (err) {
          // Clear invalid token
          authService.setAuthToken(null);
        }
      } catch (err) {
        console.error('Authentication error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { token, user } = await authService.login(email, password);
      
      // Set token in localStorage and axios headers
      authService.setAuthToken(token);
      
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'התחברות נכשלה. נא לנסות שוב.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.setAuthToken(null);
    setUser(null);
  };

  return {
    isAuthenticated: !!user,
    user,
    loading,
    error,
    login,
    logout
  };
};
```

```tsx
// src/features/auth/components/AuthProvider.tsx
import React, { createContext } from 'react';
import { AuthContextType } from '../types/auth';
import { useAuthProvider } from '../hooks/useAuthProvider';

// Create auth context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
```

```tsx
// src/features/auth/hooks/useAuth.tsx
import { useContext } from 'react';
import { AuthContext } from '../components/AuthProvider';

export const useAuth = () => {
  return useContext(AuthContext);
};
```

```tsx
// src/features/auth/index.ts
export * from './components/AuthProvider';
export * from './hooks/useAuth';
export * from './types/auth';
```

## Phase 4: Breaking Down Large Page Components

Large page components like Dashboard.tsx should also be broken down:

### Example: Dashboard Page

1. **Create the directory structure**

```bash
mkdir -p src/pages/dashboard/components
```

2. **Extract components to separate files**

```tsx
// src/pages/dashboard/components/StatCard.tsx
// src/pages/dashboard/components/ActivityItem.tsx
// src/pages/dashboard/components/PerformanceChart.tsx
// src/pages/dashboard/components/UpcomingSessionsList.tsx
// etc.
```

3. **Compose the dashboard page from these components**

```tsx
// src/pages/dashboard/DashboardPage.tsx
import React from 'react';
import { Container, Grid, Box, Typography, Button } from '@mui/material';
import { MainLayout } from '../../layouts/MainLayout';
import { StatCard } from './components/StatCard';
import { PerformanceChart } from './components/PerformanceChart';
import { ActivityList } from './components/ActivityList';
import { UpcomingSessionsList } from './components/UpcomingSessionsList';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './hooks/useDashboardData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    stats, 
    activities, 
    upcomingSessions, 
    performanceData,
    formattedDate 
  } = useDashboardData();

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          {/* Dashboard header content */}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* Chart & Activity Section */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} lg={8}>
            <PerformanceChart data={performanceData} />
            <ActivityList activities={activities} />
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <UpcomingSessionsList sessions={upcomingSessions} />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};
```

## Phase 5: Migration Testing Strategy

Follow these steps to ensure your refactoring doesn't break existing functionality:

1. **Implement unit tests** for components before refactoring
2. **Update one component/feature at a time**
3. **Run the app locally** after each significant change
4. **Check visual appearance and interactions**
5. **Verify RTL functionality** is maintained
6. **Automated tests**: Run existing test suite after changes

## Phase 6: Import and Path Improvements

Configure path aliases in tsconfig.json for cleaner imports:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@features/*": ["features/*"],
      "@hooks/*": ["hooks/*"],
      "@layouts/*": ["layouts/*"],
      "@pages/*": ["pages/*"],
      "@services/*": ["services/*"],
      "@store/*": ["store/*"],
      "@styles/*": ["styles/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"],
      "@config/*": ["config/*"]
    }
  }
}
```

This allows for imports like:

```tsx
// Instead of this:
import { WorkoutCard } from '../../../features/workouts/components/workout-card';

// Use this:
import { WorkoutCard } from '@features/workouts/components/workout-card';
```

## Conclusion

This migration approach allows for incremental progress while maintaining a functioning application throughout the process. The result will be a more maintainable, AI-friendly codebase with clearer separation of concerns and smaller, more focused files.
