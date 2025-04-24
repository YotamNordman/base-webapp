import axios from 'axios';
import { LogbookEntry, ExerciseSet } from '../types/exercise';
import { PreviousWorkoutPerformance } from '../types/workout';
import { getApiBaseUrl, isMockModeEnabled } from '../config';

// Get base API URL from configuration
const API_BASE_URL = getApiBaseUrl();
// Check if we should use mock data
const USE_MOCK_DATA = isMockModeEnabled();

// Mock data for development when backend is not available
const mockLogbookEntries: LogbookEntry[] = [
  {
    id: '1',
    workoutId: 1,
    exerciseId: 1,
    setNumber: 1,
    plannedReps: 12,
    actualReps: 12,
    plannedWeight: 60,
    actualWeight: 60,
    plannedRir: 2,
    actualRir: 2,
    completed: true,
    loggedAt: new Date().toISOString()
  },
  {
    id: '2',
    workoutId: 1,
    exerciseId: 1,
    setNumber: 2,
    plannedReps: 12,
    actualReps: 10,
    plannedWeight: 60,
    actualWeight: 60,
    plannedRir: 2,
    actualRir: 1,
    completed: true,
    loggedAt: new Date().toISOString()
  },
  {
    id: '3',
    workoutId: 1,
    exerciseId: 2,
    setNumber: 1,
    plannedReps: 10,
    actualReps: 10,
    plannedWeight: 80,
    actualWeight: 80,
    plannedRir: 1,
    actualRir: 1,
    completed: true,
    loggedAt: new Date().toISOString()
  }
];

const mockPreviousPerformance: PreviousWorkoutPerformance = {
  workoutId: 1,
  date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  exercises: [
    {
      exerciseId: 1,
      name: 'סקוואט',
      sets: [
        { setNumber: 1, reps: 12, weight: 55, rir: 2 },
        { setNumber: 2, reps: 10, weight: 55, rir: 1 }
      ]
    },
    {
      exerciseId: 2,
      name: 'דדליפט',
      sets: [
        { setNumber: 1, reps: 8, weight: 75, rir: 1 }
      ]
    }
  ]
};

/**
 * Service for managing workout logging functionality including RIR tracking
 */
export const workoutLogService = {
  /**
   * Get logbook entries for a specific workout
   * @param workoutId The ID of the workout
   * @returns A promise with the logbook entries
   */
  async getLogbookEntries(workoutId: number): Promise<LogbookEntry[]> {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return mockLogbookEntries.filter(entry => entry.workoutId === workoutId);
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/workouts/${workoutId}/logbook-entries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching logbook entries:', error);
      // Return filtered mock data on error
      return mockLogbookEntries.filter(entry => entry.workoutId === workoutId);
    }
  },

  /**
   * Add a new logbook entry for a workout
   * @param workoutId The ID of the workout
   * @param entry The logbook entry data
   * @returns A promise with the created logbook entry
   */
  async addLogbookEntry(workoutId: number, entry: Omit<LogbookEntry, 'id' | 'loggedAt'>): Promise<LogbookEntry> {
    // If mock mode is enabled, add to mock data
    if (USE_MOCK_DATA) {
      const newEntry: LogbookEntry = {
        ...entry,
        id: `mock-entry-${Date.now()}`,
        workoutId,
        loggedAt: new Date().toISOString()
      };
      mockLogbookEntries.push(newEntry);
      return newEntry;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/workouts/${workoutId}/logbook-entries`, entry);
      return response.data;
    } catch (error) {
      console.error('Error adding logbook entry:', error);
      // Create in mock data on error
      const newEntry: LogbookEntry = {
        ...entry,
        id: `mock-entry-${Date.now()}`,
        workoutId,
        loggedAt: new Date().toISOString()
      };
      mockLogbookEntries.push(newEntry);
      return newEntry;
    }
  },

  /**
   * Update an existing logbook entry
   * @param workoutId The ID of the workout
   * @param entryId The ID of the logbook entry
   * @param entry The updated logbook entry data
   * @returns A promise that resolves when the update is complete
   */
  async updateLogbookEntry(workoutId: number, entryId: number, entry: Omit<LogbookEntry, 'id' | 'loggedAt'>): Promise<void> {
    // If mock mode is enabled, update in mock data
    if (USE_MOCK_DATA) {
      const index = mockLogbookEntries.findIndex(e => e.id === entryId.toString());
      if (index !== -1) {
        mockLogbookEntries[index] = {
          ...mockLogbookEntries[index],
          ...entry,
          workoutId,
          id: entryId.toString()
        };
      }
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/workouts/${workoutId}/logbook-entries/${entryId}`, entry);
    } catch (error) {
      console.error('Error updating logbook entry:', error);
      // Update in mock data on error
      const index = mockLogbookEntries.findIndex(e => e.id === entryId.toString());
      if (index !== -1) {
        mockLogbookEntries[index] = {
          ...mockLogbookEntries[index],
          ...entry,
          workoutId,
          id: entryId.toString()
        };
      }
    }
  },

  /**
   * Mark a workout as completed
   * @param workoutId The ID of the workout to complete
   * @returns A promise with the completed workout data
   */
  async completeWorkout(workoutId: number): Promise<any> {
    // If mock mode is enabled, simulate completion
    if (USE_MOCK_DATA) {
      return {
        id: workoutId,
        completed: true,
        completedAt: new Date().toISOString()
      };
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/workouts/${workoutId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error completing workout:', error);
      // Return mock data on error
      return {
        id: workoutId,
        completed: true,
        completedAt: new Date().toISOString()
      };
    }
  },

  /**
   * Get the calculated volume for a workout
   * @param workoutId The ID of the workout
   * @returns A promise with the total volume value
   */
  async getWorkoutVolume(workoutId: number): Promise<number> {
    // If mock mode is enabled, calculate volume from mock data
    if (USE_MOCK_DATA) {
      const entries = mockLogbookEntries.filter(entry => entry.workoutId === workoutId);
      return entries.reduce((total, entry) => {
        return total + ((entry.actualReps || 0) * (entry.actualWeight || 0));
      }, 0);
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/workouts/${workoutId}/logbook-entries/volume`);
      return response.data;
    } catch (error) {
      console.error('Error getting workout volume:', error);
      // Calculate from mock data on error
      const entries = mockLogbookEntries.filter(entry => entry.workoutId === workoutId);
      return entries.reduce((total, entry) => {
        return total + ((entry.actualReps || 0) * (entry.actualWeight || 0));
      }, 0);
    }
  },

  /**
   * Get previous workout performance for comparison
   * @param workoutId The ID of the current workout
   * @returns A promise with the previous performance data
   */
  async getPreviousPerformance(workoutId: number): Promise<PreviousWorkoutPerformance | null> {
    // If mock mode is enabled, return mock performance data
    if (USE_MOCK_DATA) {
      if (mockPreviousPerformance.workoutId === workoutId) {
        return mockPreviousPerformance;
      }
      return null;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/workouts/${workoutId}/previous-performance`);
      return response.data;
    } catch (error) {
      console.error('Error getting previous performance:', error);
      // Return mock data on error if available
      if (mockPreviousPerformance.workoutId === workoutId) {
        return mockPreviousPerformance;
      }
      return null;
    }
  },

  /**
   * Log a full set of workout data (bulk update)
   * @param workoutId The ID of the workout
   * @param exerciseId The ID of the exercise
   * @param sets Array of sets data to log
   * @returns A promise with the logged entries
   */
  async logExerciseSets(workoutId: number, exerciseId: number, sets: ExerciseSet[]): Promise<LogbookEntry[]> {
    // If mock mode is enabled, add all entries to mock data at once
    if (USE_MOCK_DATA) {
      // Convert exercise sets to logbook entries
      const entries = sets.map((set, index) => ({
        id: `mock-entry-${Date.now()}-${index}`,
        workoutId,
        exerciseId,
        setNumber: set.setNumber,
        plannedReps: set.plannedReps,
        actualReps: set.actualReps,
        plannedWeight: set.plannedWeight,
        actualWeight: set.actualWeight,
        plannedRir: set.plannedRir || 0,
        actualRir: set.actualRir,
        completed: set.completed,
        loggedAt: new Date().toISOString()
      }));

      // Add all entries to mock data
      mockLogbookEntries.push(...entries);
      return entries;
    }

    try {
      // Convert exercise sets to logbook entries
      const entries = sets.map(set => ({
        workoutId,
        exerciseId,
        setNumber: set.setNumber,
        plannedReps: set.plannedReps,
        actualReps: set.actualReps,
        plannedWeight: set.plannedWeight,
        actualWeight: set.actualWeight,
        plannedRir: set.plannedRir || 0,
        actualRir: set.actualRir,
        completed: set.completed
      }));

      // Make multiple API calls in parallel
      const promises = entries.map(entry => this.addLogbookEntry(workoutId, entry));
      
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error logging exercise sets:', error);
      // Create in mock data on error
      const entries = sets.map((set, index) => ({
        id: `mock-entry-${Date.now()}-${index}`,
        workoutId,
        exerciseId,
        setNumber: set.setNumber,
        plannedReps: set.plannedReps,
        actualReps: set.actualReps,
        plannedWeight: set.plannedWeight,
        actualWeight: set.actualWeight,
        plannedRir: set.plannedRir || 0,
        actualRir: set.actualRir,
        completed: set.completed,
        loggedAt: new Date().toISOString()
      }));

      // Add all entries to mock data
      mockLogbookEntries.push(...entries);
      return entries;
    }
  }
};

export default workoutLogService;