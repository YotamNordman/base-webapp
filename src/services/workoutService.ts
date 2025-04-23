import { Workout } from '../types/workout';

// Base API URL - would be configured from environment variables in a real app
const API_BASE_URL = 'http://localhost:5015/api';

// Helper function to get auth header
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const workoutService = {
  getWorkouts: async (): Promise<Workout[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  },

  getWorkoutById: async (id: string): Promise<Workout> => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch workout with id ${id}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching workout ${id}:`, error);
      throw error;
    }
  },

  createWorkout: async (workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(workout),
      });
      if (!response.ok) {
        throw new Error('Failed to create workout');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  },

  updateWorkout: async (workout: Workout): Promise<Workout> => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${workout.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(workout),
      });
      if (!response.ok) {
        throw new Error(`Failed to update workout with id ${workout.id}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating workout ${workout.id}:`, error);
      throw error;
    }
  },

  deleteWorkout: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete workout with id ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting workout ${id}:`, error);
      throw error;
    }
  },

  completeWorkout: async (id: string): Promise<Workout> => {
    try {
      // In a real application, this would be a separate endpoint
      const workout = await workoutService.getWorkoutById(id);
      const updatedWorkout = { ...workout, completed: true };
      return await workoutService.updateWorkout(updatedWorkout);
    } catch (error) {
      console.error(`Error completing workout ${id}:`, error);
      throw error;
    }
  }
};