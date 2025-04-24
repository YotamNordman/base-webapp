import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from './slices/workoutsSlice';
import exercisesReducer from './slices/exercisesSlice';
import trainingBlocksReducer from './slices/trainingBlocksSlice';
import calendarReducer from './slices/calendarSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import clientsReducer from './slices/clientsSlice';
import workoutLogReducer from './slices/workoutLogSlice';
import methodologiesReducer from './slices/methodologiesSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exercises: exercisesReducer,
    trainingBlocks: trainingBlocksReducer,
    calendar: calendarReducer,
    appointments: appointmentsReducer,
    clients: clientsReducer,
    workoutLog: workoutLogReducer,
    methodologies: methodologiesReducer,
  },
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;