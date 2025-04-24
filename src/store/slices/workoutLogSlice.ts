import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LogbookEntry, ExerciseSet } from '../../types/exercise';
import { PreviousWorkoutPerformance } from '../../types/workout';
import workoutLogService from '../../services/workoutLogService';

// Async thunks
export const fetchLogbookEntries = createAsyncThunk(
  'workoutLog/fetchEntries',
  async (workoutId: number) => {
    return await workoutLogService.getLogbookEntries(workoutId);
  }
);

export const addLogbookEntry = createAsyncThunk(
  'workoutLog/addEntry',
  async ({ workoutId, entry }: { workoutId: number, entry: Omit<LogbookEntry, 'id' | 'loggedAt'> }) => {
    return await workoutLogService.addLogbookEntry(workoutId, entry);
  }
);

export const updateLogbookEntry = createAsyncThunk(
  'workoutLog/updateEntry',
  async ({ workoutId, entryId, entry }: { workoutId: number, entryId: number, entry: Omit<LogbookEntry, 'id' | 'loggedAt'> }) => {
    await workoutLogService.updateLogbookEntry(workoutId, entryId, entry);
    return { id: entryId, ...entry };
  }
);

export const logExerciseSets = createAsyncThunk(
  'workoutLog/logSets',
  async ({ workoutId, exerciseId, sets }: { workoutId: number, exerciseId: number, sets: ExerciseSet[] }) => {
    return await workoutLogService.logExerciseSets(workoutId, exerciseId, sets);
  }
);

export const completeWorkout = createAsyncThunk(
  'workoutLog/completeWorkout',
  async (workoutId: number) => {
    return await workoutLogService.completeWorkout(workoutId);
  }
);

export const fetchWorkoutVolume = createAsyncThunk(
  'workoutLog/fetchVolume',
  async (workoutId: number) => {
    return await workoutLogService.getWorkoutVolume(workoutId);
  }
);

export const fetchPreviousPerformance = createAsyncThunk(
  'workoutLog/fetchPreviousPerformance',
  async (workoutId: number) => {
    return await workoutLogService.getPreviousPerformance(workoutId);
  }
);

// Define the slice state interface
interface WorkoutLogState {
  logbookEntries: LogbookEntry[];
  previousPerformance: PreviousWorkoutPerformance | null;
  workoutVolume: number | null;
  loading: boolean;
  error: string | null;
  currentWorkoutId: number | null;
}

// Initial state
const initialState: WorkoutLogState = {
  logbookEntries: [],
  previousPerformance: null,
  workoutVolume: null,
  loading: false,
  error: null,
  currentWorkoutId: null
};

// Create the slice
const workoutLogSlice = createSlice({
  name: 'workoutLog',
  initialState,
  reducers: {
    setCurrentWorkout(state, action: PayloadAction<number>) {
      state.currentWorkoutId = action.payload;
      // Clear existing data when changing workout
      state.logbookEntries = [];
      state.previousPerformance = null;
      state.workoutVolume = null;
    },
    clearWorkoutLog(state) {
      state.logbookEntries = [];
      state.previousPerformance = null;
      state.workoutVolume = null;
      state.currentWorkoutId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchLogbookEntries
    builder.addCase(fetchLogbookEntries.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLogbookEntries.fulfilled, (state, action) => {
      state.loading = false;
      state.logbookEntries = action.payload;
    });
    builder.addCase(fetchLogbookEntries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch logbook entries';
    });

    // addLogbookEntry
    builder.addCase(addLogbookEntry.fulfilled, (state, action) => {
      state.logbookEntries.push(action.payload);
    });

    // updateLogbookEntry
    builder.addCase(updateLogbookEntry.fulfilled, (state, action) => {
      const index = state.logbookEntries.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.logbookEntries[index] = action.payload as LogbookEntry;
      }
    });

    // logExerciseSets
    builder.addCase(logExerciseSets.fulfilled, (state, action) => {
      // Replace existing entries or add new ones
      const newEntries = action.payload;
      for (const newEntry of newEntries) {
        const index = state.logbookEntries.findIndex(entry => 
          entry.exerciseId === newEntry.exerciseId && entry.setNumber === newEntry.setNumber);
        
        if (index !== -1) {
          state.logbookEntries[index] = newEntry;
        } else {
          state.logbookEntries.push(newEntry);
        }
      }
    });

    // completeWorkout
    builder.addCase(completeWorkout.fulfilled, (state) => {
      // Workout completion status will be reflected in the workouts slice
      // Here we just mark our data as up-to-date
      state.loading = false;
    });

    // fetchWorkoutVolume
    builder.addCase(fetchWorkoutVolume.fulfilled, (state, action) => {
      state.workoutVolume = action.payload;
    });

    // fetchPreviousPerformance
    builder.addCase(fetchPreviousPerformance.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPreviousPerformance.fulfilled, (state, action) => {
      state.loading = false;
      state.previousPerformance = action.payload;
    });
    builder.addCase(fetchPreviousPerformance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch previous performance';
      state.previousPerformance = null;
    });
  }
});

export const { setCurrentWorkout, clearWorkoutLog } = workoutLogSlice.actions;

export default workoutLogSlice.reducer;