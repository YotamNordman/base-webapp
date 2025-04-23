# Base Webapp Implementation Guide

This guide provides practical instructions for implementing features in the refactored Base webapp structure.

## Component Implementation Pattern

When implementing or modifying features, follow this pattern:

1. First, identify the feature and determine the right location for new components
2. Create/update type definitions
3. Implement/modify UI components
4. Implement/modify hooks for state management and API integration
5. Update or add exports from index files
6. Test the implementation

## Feature-First Organization

Our architecture is organized around features rather than technical concerns:

- **Feature modules** contain all code related to a specific capability
- **Shared modules** contain code used across multiple features
- **UI components** are broken down into small, focused pieces

## Example: Adding a New Workout Type Feature

Let's walk through an example of adding a new feature to allow coaches to define workout types.

### 1. Create Type Definitions

```tsx
// src/features/workouts/types/workout-type.ts
export interface WorkoutType {
  id: number;
  name: string;
  description?: string;
  targetMuscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in minutes
  createdBy: string;
  createdAt: string;
}

export interface WorkoutTypeFormValues {
  name: string;
  description?: string;
  targetMuscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
}
```

### 2. Create API Service

```tsx
// src/features/workouts/services/workoutTypeService.ts
import axios from 'axios';
import { WorkoutType, WorkoutTypeFormValues } from '../types/workout-type';

const API_URL = '/api/workout-types';

export const getWorkoutTypes = async (): Promise<WorkoutType[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getWorkoutTypeById = async (id: number): Promise<WorkoutType> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createWorkoutType = async (workoutType: WorkoutTypeFormValues): Promise<WorkoutType> => {
  const response = await axios.post(API_URL, workoutType);
  return response.data;
};

export const updateWorkoutType = async (id: number, workoutType: WorkoutTypeFormValues): Promise<WorkoutType> => {
  const response = await axios.put(`${API_URL}/${id}`, workoutType);
  return response.data;
};

export const deleteWorkoutType = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
```

### 3. Create React Hook

```tsx
// src/features/workouts/hooks/useWorkoutTypes.ts
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { WorkoutType, WorkoutTypeFormValues } from '../types/workout-type';
import * as workoutTypeService from '../services/workoutTypeService';

export const useWorkoutTypes = () => {
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch all workout types
  const fetchWorkoutTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workoutTypeService.getWorkoutTypes();
      setWorkoutTypes(data);
    } catch (err) {
      setError('Failed to fetch workout types');
      enqueueSnackbar('Failed to load workout types', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Create a new workout type
  const createWorkoutType = useCallback(async (formValues: WorkoutTypeFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const newWorkoutType = await workoutTypeService.createWorkoutType(formValues);
      setWorkoutTypes(prev => [...prev, newWorkoutType]);
      enqueueSnackbar('Workout type created successfully', { variant: 'success' });
      return newWorkoutType;
    } catch (err) {
      setError('Failed to create workout type');
      enqueueSnackbar('Failed to create workout type', { variant: 'error' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Update an existing workout type
  const updateWorkoutType = useCallback(async (id: number, formValues: WorkoutTypeFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const updatedWorkoutType = await workoutTypeService.updateWorkoutType(id, formValues);
      setWorkoutTypes(prev => 
        prev.map(wt => wt.id === id ? updatedWorkoutType : wt)
      );
      enqueueSnackbar('Workout type updated successfully', { variant: 'success' });
      return updatedWorkoutType;
    } catch (err) {
      setError('Failed to update workout type');
      enqueueSnackbar('Failed to update workout type', { variant: 'error' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Delete a workout type
  const deleteWorkoutType = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await workoutTypeService.deleteWorkoutType(id);
      setWorkoutTypes(prev => prev.filter(wt => wt.id !== id));
      enqueueSnackbar('Workout type deleted successfully', { variant: 'success' });
    } catch (err) {
      setError('Failed to delete workout type');
      enqueueSnackbar('Failed to delete workout type', { variant: 'error' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Load workout types on initial mount
  useEffect(() => {
    fetchWorkoutTypes();
  }, [fetchWorkoutTypes]);

  return {
    workoutTypes,
    loading,
    error,
    fetchWorkoutTypes,
    createWorkoutType,
    updateWorkoutType,
    deleteWorkoutType
  };
};
```

### 4. Create UI Components

Start by creating small, focused UI components:

```tsx
// src/features/workouts/components/workout-type/WorkoutTypeItem.tsx
import React from 'react';
import { 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Chip, 
  Box 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { WorkoutType } from '../../types/workout-type';

interface WorkoutTypeItemProps {
  workoutType: WorkoutType;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const WorkoutTypeItem: React.FC<WorkoutTypeItemProps> = ({
  workoutType,
  onEdit,
  onDelete
}) => {
  // Map difficulty to color
  const getDifficultyColor = () => {
    switch (workoutType.difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'primary';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <ListItem 
      divider 
      sx={{ 
        py: 2,
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.04)',
        }
      }}
    >
      <ListItemText
        primary={workoutType.name}
        secondary={
          <>
            {workoutType.description && (
              <Box component="span" display="block" mb={1}>
                {workoutType.description}
              </Box>
            )}
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
              <Chip 
                size="small" 
                color={getDifficultyColor()} 
                label={workoutType.difficulty} 
              />
              <Chip 
                size="small" 
                variant="outlined" 
                label={`${workoutType.estimatedDuration} דקות`} 
              />
              {workoutType.targetMuscleGroups.map((muscle) => (
                <Chip 
                  key={muscle} 
                  size="small" 
                  variant="outlined" 
                  label={muscle} 
                />
              ))}
            </Box>
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={() => onEdit(workoutType.id)} sx={{ mr: 1 }}>
          <EditIcon />
        </IconButton>
        <IconButton edge="end" onClick={() => onDelete(workoutType.id)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
```

```tsx
// src/features/workouts/components/workout-type/WorkoutTypeForm.tsx
// Create form component for adding/editing workout types
```

```tsx
// src/features/workouts/components/workout-type/WorkoutTypeList.tsx
// Create list component that uses WorkoutTypeItem components
```

### 5. Create Feature Page

```tsx
// src/pages/workouts/WorkoutTypesPage.tsx
import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { MainLayout } from '../../layouts/MainLayout';
import { WorkoutTypeList } from '../../features/workouts/components/workout-type/WorkoutTypeList';
import { WorkoutTypeForm } from '../../features/workouts/components/workout-type/WorkoutTypeForm';
import { useWorkoutTypes } from '../../features/workouts/hooks/useWorkoutTypes';
import { WorkoutTypeFormValues } from '../../features/workouts/types/workout-type';

export const WorkoutTypesPage: React.FC = () => {
  const { 
    workoutTypes, 
    loading, 
    createWorkoutType, 
    updateWorkoutType, 
    deleteWorkoutType 
  } = useWorkoutTypes();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [currentWorkoutType, setCurrentWorkoutType] = useState<number | null>(null);
  
  const handleAdd = () => {
    setCurrentWorkoutType(null);
    setOpenDialog(true);
  };
  
  const handleEdit = (id: number) => {
    setCurrentWorkoutType(id);
    setOpenDialog(true);
  };
  
  const handleClose = () => {
    setOpenDialog(false);
  };
  
  const handleSubmit = async (values: WorkoutTypeFormValues) => {
    try {
      if (currentWorkoutType === null) {
        await createWorkoutType(values);
      } else {
        await updateWorkoutType(currentWorkoutType, values);
      }
      setOpenDialog(false);
    } catch (err) {
      // Error is handled in the hook
    }
  };
  
  const handleDelete = async (id: number) => {
    // In a real app, add confirmation dialog
    try {
      await deleteWorkoutType(id);
    } catch (err) {
      // Error is handled in the hook
    }
  };
  
  // Get current workout type for editing if needed
  const editingWorkoutType = currentWorkoutType !== null 
    ? workoutTypes.find(wt => wt.id === currentWorkoutType) 
    : null;
  
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          סוגי אימונים
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAdd}
          sx={{ mb: 3 }}
        >
          הוסף סוג אימון חדש
        </Button>
        
        <Paper elevation={2}>
          <WorkoutTypeList 
            workoutTypes={workoutTypes} 
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Paper>
        
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {currentWorkoutType === null ? 'הוסף סוג אימון חדש' : 'ערוך סוג אימון'}
          </DialogTitle>
          <DialogContent>
            <WorkoutTypeForm 
              initialValues={editingWorkoutType ? {
                name: editingWorkoutType.name,
                description: editingWorkoutType.description,
                targetMuscleGroups: editingWorkoutType.targetMuscleGroups,
                difficulty: editingWorkoutType.difficulty,
                estimatedDuration: editingWorkoutType.estimatedDuration
              } : undefined}
              onSubmit={handleSubmit}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>ביטול</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};
```

### 6. Update Routes

```tsx
// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ClientsPage } from './pages/clients/ClientsPage';
import { ClientDetailsPage } from './pages/clients/ClientDetailsPage';
import { WorkoutsPage } from './pages/workouts/WorkoutsPage';
import { WorkoutTypesPage } from './pages/workouts/WorkoutTypesPage'; // Add this line
import { CalendarPage } from './pages/calendar/CalendarPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { NotFoundPage } from './pages/error/NotFoundPage';
import { ProtectedRoute } from './components/common/navigation/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientDetailsPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workout-types" element={<WorkoutTypesPage />} /> {/* Add this line */}
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      
      {/* Redirect to dashboard if authenticated */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
```

## Summary and Best Practices

1. **Keep components small** - ideally under 150 lines
2. **Separate logic from presentation** - use hooks for data fetching and state management
3. **Use TypeScript interfaces** for type safety and improved development experience
4. **Follow consistent naming conventions**:
   - PascalCase for components and types
   - camelCase for functions, variables, and properties
   - kebab-case for file names and folders
5. **Create index.ts files** for clean exports
6. **Leverage path aliases** for cleaner imports
7. **Document code** with JSDoc comments for key functions and components
8. **Extract reusable logic** into custom hooks
9. **Unit test components** and hooks separately

By following these patterns and guidelines, we'll achieve a codebase that is:
- Easier to understand
- More maintainable
- Better suited for AI-assisted development
- More scalable as the application grows
