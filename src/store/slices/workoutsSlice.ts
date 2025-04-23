import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Workout, WorkoutFilters } from '../../types/workout';
import { workoutService } from '../../services/workoutService';

// Define the state interface
interface WorkoutsState {
  workouts: Workout[];
  selectedWorkout: Workout | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: WorkoutFilters;
}

// Initial state
const initialState: WorkoutsState = {
  workouts: [],
  selectedWorkout: null,
  status: 'idle',
  error: null,
  filter: {
    searchQuery: '',
    statusFilter: 'all',
    clientFilter: '',
    dateFilter: {
      startDate: null,
      endDate: null,
    },
  },
};

// Async thunks
export const fetchWorkouts = createAsyncThunk(
  'workouts/fetchWorkouts',
  async () => {
    return await workoutService.getWorkouts();
  }
);

export const fetchWorkoutById = createAsyncThunk(
  'workouts/fetchWorkoutById',
  async (id: string) => {
    return await workoutService.getWorkoutById(id);
  }
);

export const createWorkout = createAsyncThunk(
  'workouts/createWorkout',
  async (workout: Omit<Workout, 'id' | 'createdAt'>) => {
    return await workoutService.createWorkout(workout);
  }
);

export const updateWorkout = createAsyncThunk(
  'workouts/updateWorkout',
  async (workout: Workout) => {
    return await workoutService.updateWorkout(workout);
  }
);

export const deleteWorkout = createAsyncThunk(
  'workouts/deleteWorkout',
  async (id: string) => {
    await workoutService.deleteWorkout(id);
    return id;
  }
);

export const completeWorkout = createAsyncThunk(
  'workouts/completeWorkout',
  async (id: string) => {
    return await workoutService.completeWorkout(id);
  }
);

// Create the slice
const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'completed' | 'pending'>) => {
      state.filter.statusFilter = action.payload;
    },
    setClientFilter: (state, action: PayloadAction<string>) => {
      state.filter.clientFilter = action.payload;
    },
    setDateFilter: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.filter.dateFilter = action.payload;
    },
    clearSelectedWorkout: (state) => {
      state.selectedWorkout = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all workouts
      .addCase(fetchWorkouts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workouts = action.payload;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch workouts';
      })
      
      // Fetch workout by ID
      .addCase(fetchWorkoutById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkoutById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedWorkout = action.payload;
      })
      .addCase(fetchWorkoutById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch workout';
      })
      
      // Create a new workout
      .addCase(createWorkout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workouts.push(action.payload);
      })
      .addCase(createWorkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create workout';
      })
      
      // Update an existing workout
      .addCase(updateWorkout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateWorkout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.workouts.findIndex(workout => workout.id === action.payload.id);
        if (index !== -1) {
          state.workouts[index] = action.payload;
        }
        if (state.selectedWorkout?.id === action.payload.id) {
          state.selectedWorkout = action.payload;
        }
      })
      .addCase(updateWorkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update workout';
      })
      
      // Delete a workout
      .addCase(deleteWorkout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workouts = state.workouts.filter(workout => workout.id !== action.payload);
        if (state.selectedWorkout?.id === action.payload) {
          state.selectedWorkout = null;
        }
      })
      .addCase(deleteWorkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete workout';
      })
      
      // Complete a workout
      .addCase(completeWorkout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(completeWorkout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.workouts.findIndex(workout => workout.id === action.payload.id);
        if (index !== -1) {
          state.workouts[index] = action.payload;
        }
        if (state.selectedWorkout?.id === action.payload.id) {
          state.selectedWorkout = action.payload;
        }
      })
      .addCase(completeWorkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to complete workout';
      });
  },
});

// Export actions and reducer
export const { 
  setSearchQuery, 
  setStatusFilter, 
  setClientFilter, 
  setDateFilter, 
  clearSelectedWorkout 
} = workoutsSlice.actions;

export default workoutsSlice.reducer;

// Selectors
export const selectAllWorkouts = (state: { workouts: WorkoutsState }) => state.workouts.workouts;
export const selectWorkoutById = (state: { workouts: WorkoutsState }, workoutId: string) => 
  state.workouts.workouts.find(workout => workout.id === workoutId);
export const selectSelectedWorkout = (state: { workouts: WorkoutsState }) => state.workouts.selectedWorkout;
export const selectWorkoutStatus = (state: { workouts: WorkoutsState }) => state.workouts.status;
export const selectWorkoutError = (state: { workouts: WorkoutsState }) => state.workouts.error;
export const selectWorkoutFilters = (state: { workouts: WorkoutsState }) => state.workouts.filter;

export const selectFilteredWorkouts = (state: { workouts: WorkoutsState }) => {
  const { workouts, filter } = state.workouts;
  const { searchQuery, statusFilter, clientFilter, dateFilter } = filter;
  
  return workouts.filter(workout => {
    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'completed' && !workout.completed) return false;
      if (statusFilter === 'pending' && workout.completed) return false;
    }
    
    // Filter by client
    if (clientFilter && workout.clientId !== clientFilter) {
      return false;
    }
    
    // Filter by date range
    if (dateFilter.startDate || dateFilter.endDate) {
      const workoutDate = new Date(workout.scheduledFor).getTime();
      if (dateFilter.startDate) {
        const startDate = new Date(dateFilter.startDate).getTime();
        if (workoutDate < startDate) return false;
      }
      if (dateFilter.endDate) {
        const endDate = new Date(dateFilter.endDate).getTime();
        if (workoutDate > endDate) return false;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        workout.title.toLowerCase().includes(query) ||
        workout.description.toLowerCase().includes(query) ||
        (workout.clientName && workout.clientName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
};