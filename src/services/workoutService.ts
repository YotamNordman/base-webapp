import { Workout } from '../types/workout';
import { getApiBaseUrl, getAuthHeader as configGetAuthHeader, isMockModeEnabled } from '../config';

// Get base API URL from configuration
const API_BASE_URL = getApiBaseUrl();
// Check if we should use mock data
const USE_MOCK_DATA = isMockModeEnabled();

// Use auth header from config
const getAuthHeader = configGetAuthHeader;

// Mock data for development when backend is not available
const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'אימון כוח מלא',
    description: 'אימון כוח כללי לכל הגוף עם דגש על רגליים וגב',
    coachId: 'coach-123',
    clientId: '1',
    clientName: 'John Doe',
    createdAt: new Date('2023-10-15').toISOString(),
    scheduledFor: new Date('2023-10-20').toISOString(),
    completed: false,
    exercises: [
      {
        id: '1',
        name: 'סקוואט',
        sets: 4,
        reps: 12,
        weight: 60,
        restTime: 90,
        notes: 'שמור על גב ישר',
      },
      {
        id: '2',
        name: 'מתח',
        sets: 3,
        reps: 8,
        weight: 0,
        restTime: 60,
        notes: 'להשתמש במשקל גוף',
      },
      {
        id: '3',
        name: 'דדליפט',
        sets: 3,
        reps: 10,
        weight: 80,
        restTime: 120,
        notes: 'שמור על טכניקה נכונה',
      }
    ],
    duration: 60
  },
  {
    id: '2',
    title: 'אימון היט',
    description: 'אימון אינטרוולים בעצימות גבוהה לשריפת שומנים',
    coachId: 'coach-123',
    clientId: '2',
    clientName: 'Jane Smith',
    createdAt: new Date('2023-10-12').toISOString(),
    scheduledFor: new Date('2023-10-18').toISOString(),
    completed: true,
    exercises: [
      {
        id: '4',
        name: 'ריצה במקום',
        sets: 5,
        reps: 0,
        weight: 0,
        restTime: 30,
        notes: '30 שניות עבודה, 30 שניות מנוחה',
        duration: 30
      },
      {
        id: '5',
        name: 'ברפי',
        sets: 5,
        reps: 10,
        weight: 0,
        restTime: 30,
        notes: 'ביצוע מלא',
      },
      {
        id: '6',
        name: 'קפיצות',
        sets: 5,
        reps: 20,
        weight: 0,
        restTime: 30,
        notes: 'קפיצות מהירות',
      }
    ],
    duration: 30
  },
  {
    id: '3',
    title: 'אימון גמישות',
    description: 'אימון מתיחות וגמישות לשיפור טווחי תנועה',
    coachId: 'coach-123',
    clientId: '3',
    clientName: 'Michael Johnson',
    createdAt: new Date('2023-10-10').toISOString(),
    scheduledFor: new Date('2023-10-17').toISOString(),
    completed: false,
    exercises: [
      {
        id: '7',
        name: 'מתיחת רגליים',
        sets: 3,
        reps: 0,
        weight: 0,
        restTime: 0,
        notes: 'להחזיק 30 שניות בכל צד',
        duration: 30
      },
      {
        id: '8',
        name: 'מתיחת כתפיים',
        sets: 3,
        reps: 0,
        weight: 0,
        restTime: 0,
        notes: 'להחזיק 30 שניות',
        duration: 30
      }
    ],
    duration: 45
  }
];

// Find a workout by ID from mock data
const findMockWorkoutById = (id: string): Workout | undefined => {
  return mockWorkouts.find(workout => workout.id === id);
};

export const workoutService = {
  getWorkouts: async (): Promise<Workout[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return [...mockWorkouts];
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/workouts`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock workouts because API call failed:', error);
      // Return mock data on error
      return [...mockWorkouts];
    }
  },

  getWorkoutById: async (id: string): Promise<Workout> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      const mockWorkout = findMockWorkoutById(id);
      if (mockWorkout) {
        return { ...mockWorkout };
      }
      throw new Error(`Workout with id ${id} not found in mock data`);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch workout with id ${id}`);
      }
      return response.json();
    } catch (error) {
      console.warn(`Using mock workout because API call failed for workout ${id}:`, error);
      // Look for a matching workout in mock data
      const mockWorkout = findMockWorkoutById(id);
      if (mockWorkout) {
        return { ...mockWorkout };
      }
      throw new Error(`Workout with id ${id} not found in mock data`);
    }
  },

  createWorkout: async (workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> => {
    // If mock mode is enabled, create in mock data
    if (USE_MOCK_DATA) {
      const newWorkout: Workout = {
        ...workout,
        id: `mock-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      mockWorkouts.push(newWorkout);
      return newWorkout;
    }
    
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
      console.warn('Using mock create because API call failed:', error);
      // Create a new workout with mock data
      const newWorkout: Workout = {
        ...workout,
        id: `mock-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      mockWorkouts.push(newWorkout);
      return newWorkout;
    }
  },

  updateWorkout: async (workout: Workout): Promise<Workout> => {
    // If mock mode is enabled, update in mock data
    if (USE_MOCK_DATA) {
      const index = mockWorkouts.findIndex(w => w.id === workout.id);
      if (index !== -1) {
        mockWorkouts[index] = { ...workout };
        return { ...workout };
      }
      throw new Error(`Workout with id ${workout.id} not found in mock data`);
    }
    
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
      console.warn(`Using mock update because API call failed for workout ${workout.id}:`, error);
      // Update the workout in mock data
      const index = mockWorkouts.findIndex(w => w.id === workout.id);
      if (index !== -1) {
        mockWorkouts[index] = { ...workout };
        return { ...workout };
      }
      throw new Error(`Workout with id ${workout.id} not found in mock data`);
    }
  },

  deleteWorkout: async (id: string): Promise<void> => {
    // If mock mode is enabled, delete from mock data
    if (USE_MOCK_DATA) {
      const index = mockWorkouts.findIndex(w => w.id === id);
      if (index !== -1) {
        mockWorkouts.splice(index, 1);
        return;
      }
      throw new Error(`Workout with id ${id} not found in mock data`);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete workout with id ${id}`);
      }
    } catch (error) {
      console.warn(`Using mock delete because API call failed for workout ${id}:`, error);
      // Remove the workout from mock data
      const index = mockWorkouts.findIndex(w => w.id === id);
      if (index !== -1) {
        mockWorkouts.splice(index, 1);
        return;
      }
      throw new Error(`Workout with id ${id} not found in mock data`);
    }
  },

  completeWorkout: async (id: string): Promise<Workout> => {
    // If mock mode is enabled, handle in mock data
    if (USE_MOCK_DATA) {
      const workout = findMockWorkoutById(id);
      if (workout) {
        workout.completed = true;
        return { ...workout };
      }
      throw new Error(`Workout with id ${id} not found in mock data`);
    }
    
    try {
      // In a real application, this would be a separate endpoint
      const workout = await workoutService.getWorkoutById(id);
      const updatedWorkout = { ...workout, completed: true };
      return await workoutService.updateWorkout(updatedWorkout);
    } catch (error) {
      console.warn(`Using mock complete because API call failed for workout ${id}:`, error);
      // Mark the workout as completed in mock data
      const workout = findMockWorkoutById(id);
      if (workout) {
        workout.completed = true;
        return { ...workout };
      }
      throw new Error(`Workout with id ${id} not found in mock data`);
    }
  }
};