import { 
  TrainingMethodology, 
  WorkoutType, 
  BlockType
} from '../types/methodology';
import { getApiBaseUrl, getAuthHeader as configGetAuthHeader, isMockModeEnabled } from '../config';
import { logger } from '../utils';

// Get base API URL from configuration
const API_BASE_URL = getApiBaseUrl();
// Check if we should use mock data
const USE_MOCK_DATA = isMockModeEnabled();

// Use auth header from config
const getAuthHeader = configGetAuthHeader;

// Mock data for development when backend is not available
const mockMethodologies: TrainingMethodology[] = [
  {
    id: '1',
    name: 'Hypertrophy-Focused Methodology',
    description: 'A comprehensive methodology focused on muscle growth using evidence-based training principles.',
    creatorId: 'coach-123',
    createdAt: new Date('2023-05-15').toISOString(),
    updatedAt: new Date('2023-11-20').toISOString(),
    isPublic: true,
    workoutTypes: [
      {
        id: 'wt-1',
        name: 'Push',
        description: 'Focus on pushing movements for chest, shoulders, and triceps',
        purpose: 'Build upper body pushing strength and hypertrophy',
        recommendedFrequency: '1-2 times per week',
        colorCode: '#4CAF50',
        defaultDuration: 60,
        methodologyId: '1'
      },
      {
        id: 'wt-2',
        name: 'Pull',
        description: 'Focus on pulling movements for back and biceps',
        purpose: 'Build upper body pulling strength and hypertrophy',
        recommendedFrequency: '1-2 times per week',
        colorCode: '#2196F3',
        defaultDuration: 60,
        methodologyId: '1'
      },
      {
        id: 'wt-3',
        name: 'Legs',
        description: 'Focus on lower body training',
        purpose: 'Build lower body strength and hypertrophy',
        recommendedFrequency: '1-2 times per week',
        colorCode: '#F44336',
        defaultDuration: 60,
        methodologyId: '1'
      },
      {
        id: 'wt-4',
        name: 'Full Body',
        description: 'Complete body workout in a single session',
        purpose: 'Efficient training for general fitness',
        recommendedFrequency: '2-3 times per week',
        colorCode: '#9C27B0',
        defaultDuration: 75,
        methodologyId: '1'
      },
      {
        id: 'wt-5',
        name: 'Upper/Lower',
        description: 'Split between upper and lower body training',
        purpose: 'Balance training volume across body parts',
        recommendedFrequency: '4 times per week (2 upper, 2 lower)',
        colorCode: '#FF9800',
        defaultDuration: 60,
        methodologyId: '1'
      }
    ],
    trainingStyles: [
      {
        id: 'ts-1',
        name: 'Strength',
        description: 'Focus on heavy loads to build maximal strength',
        setsRange: { min: 3, max: 5 },
        repsRange: { min: 3, max: 6 },
        restRange: { min: 180, max: 300 },
        recommenededRir: 2,
        methodologyId: '1'
      },
      {
        id: 'ts-2',
        name: 'Hypertrophy',
        description: 'Focus on moderate loads to build muscle size',
        setsRange: { min: 3, max: 5 },
        repsRange: { min: 8, max: 12 },
        restRange: { min: 60, max: 120 },
        recommenededRir: 1,
        methodologyId: '1'
      },
      {
        id: 'ts-3',
        name: 'Endurance',
        description: 'Focus on lighter loads for muscular endurance',
        setsRange: { min: 2, max: 4 },
        repsRange: { min: 15, max: 30 },
        restRange: { min: 30, max: 60 },
        recommenededRir: 0,
        methodologyId: '1'
      }
    ],
    exerciseProgressions: [
      {
        id: 'ep-1',
        name: 'Linear Progression',
        description: 'Gradual increase in weight while maintaining reps',
        applicableExerciseTypes: ['compound'],
        progressionStrategy: 'Add 2.5kg to each exercise every week as long as target reps are achieved',
        deloadStrategy: 'Reduce weight by 10% after 3 consecutive failures or every 6 weeks',
        methodologyId: '1'
      },
      {
        id: 'ep-2',
        name: 'Double Progression',
        description: 'Increase reps within a range, then increase weight',
        applicableExerciseTypes: ['isolation', 'compound'],
        progressionStrategy: 'Increase reps within range (e.g., 8-12), then increase weight and drop back to lower rep range',
        deloadStrategy: 'Reduce weight by 10% when progress stalls for 3 consecutive sessions',
        methodologyId: '1'
      },
      {
        id: 'ep-3',
        name: 'Undulating Periodization',
        description: 'Vary reps and weights within the week',
        applicableExerciseTypes: ['compound', 'isolation'],
        progressionStrategy: 'Alternate between high reps/low weight and low reps/high weight sessions',
        deloadStrategy: 'Scheduled deload week every 4-6 weeks with 40% reduction in volume',
        methodologyId: '1'
      }
    ],
    rirRanges: [
      {
        id: 'rir-1',
        name: 'Beginner',
        description: 'Appropriate for lifters with under 1 year of experience',
        minRir: 2,
        maxRir: 4,
        targetRir: 3,
        workoutTypes: ['wt-1', 'wt-2', 'wt-3', 'wt-4', 'wt-5'],
        methodologyId: '1'
      },
      {
        id: 'rir-2',
        name: 'Intermediate',
        description: 'Appropriate for lifters with 1-3 years of experience',
        minRir: 1,
        maxRir: 3,
        targetRir: 2,
        workoutTypes: ['wt-1', 'wt-2', 'wt-3', 'wt-4', 'wt-5'],
        methodologyId: '1'
      },
      {
        id: 'rir-3',
        name: 'Advanced',
        description: 'Appropriate for lifters with 3+ years of experience',
        minRir: 0,
        maxRir: 2,
        targetRir: 1,
        workoutTypes: ['wt-1', 'wt-2', 'wt-3', 'wt-4', 'wt-5'],
        methodologyId: '1'
      }
    ],
    blockTypes: [
      {
        id: 'bt-1',
        name: 'Hypertrophy',
        description: 'Focus on muscle growth with moderate weights and higher volume',
        recommendedDuration: { min: 6, max: 12 }, // in weeks
        recommendedFrequency: { min: 3, max: 6 }, // workouts per week
        preferredWorkoutTypes: ['wt-1', 'wt-2', 'wt-3', 'wt-4', 'wt-5'],
        recommendedVolumeRange: { min: 12, max: 20 }, // sets per muscle group per week
        methodologyId: '1'
      },
      {
        id: 'bt-2',
        name: 'Strength',
        description: 'Focus on maximal strength with heavier weights and lower volume',
        recommendedDuration: { min: 4, max: 8 }, // in weeks
        recommendedFrequency: { min: 3, max: 5 }, // workouts per week
        preferredWorkoutTypes: ['wt-1', 'wt-2', 'wt-3'],
        recommendedVolumeRange: { min: 10, max: 15 }, // sets per muscle group per week
        methodologyId: '1'
      },
      {
        id: 'bt-3',
        name: 'Maintenance',
        description: 'Focus on maintaining muscle and strength with reduced volume',
        recommendedDuration: { min: 2, max: 6 }, // in weeks
        recommendedFrequency: { min: 2, max: 4 }, // workouts per week
        preferredWorkoutTypes: ['wt-4', 'wt-5'],
        recommendedVolumeRange: { min: 6, max: 10 }, // sets per muscle group per week
        methodologyId: '1'
      }
    ],
    measuringProtocol: {
      id: 'mp-1',
      name: 'Comprehensive Progress Tracking',
      description: 'A detailed approach to tracking physical changes over time',
      weightFrequency: 'weekly',
      measurementsFrequency: 'bi-weekly',
      photosFrequency: 'monthly',
      requiredMeasurements: ['weight', 'chest', 'waist', 'hips', 'thighs', 'arms', 'shoulders'],
      recommendedPhotoAngles: ['front', 'back', 'side'],
      methodologyId: '1'
    }
  },
  {
    id: '2',
    name: 'Strength-Focused Methodology',
    description: 'A methodical approach for developing maximal strength using periodization.',
    creatorId: 'coach-456',
    createdAt: new Date('2023-03-10').toISOString(),
    updatedAt: new Date('2023-12-05').toISOString(),
    isPublic: true,
    workoutTypes: [
      {
        id: 'wt-6',
        name: 'Squat Day',
        description: 'Focus on squat patterns and leg strength',
        purpose: 'Build lower body strength and power',
        recommendedFrequency: 'once per week',
        colorCode: '#E91E63',
        defaultDuration: 75,
        methodologyId: '2'
      },
      {
        id: 'wt-7',
        name: 'Bench Day',
        description: 'Focus on bench press and upper body pushing',
        purpose: 'Build chest, shoulder, and triceps strength',
        recommendedFrequency: 'once per week',
        colorCode: '#3F51B5',
        defaultDuration: 75,
        methodologyId: '2'
      },
      {
        id: 'wt-8',
        name: 'Deadlift Day',
        description: 'Focus on deadlift and posterior chain',
        purpose: 'Build back, hamstring, and grip strength',
        recommendedFrequency: 'once per week',
        colorCode: '#FFC107',
        defaultDuration: 75,
        methodologyId: '2'
      }
    ],
    trainingStyles: [
      {
        id: 'ts-4',
        name: 'Main Lift',
        description: 'Primary compound movement for strength development',
        setsRange: { min: 3, max: 8 },
        repsRange: { min: 1, max: 5 },
        restRange: { min: 180, max: 300 },
        recommenededRir: 1,
        methodologyId: '2'
      },
      {
        id: 'ts-5',
        name: 'Assistance',
        description: 'Secondary movements that support main lifts',
        setsRange: { min: 3, max: 5 },
        repsRange: { min: 6, max: 10 },
        restRange: { min: 120, max: 180 },
        recommenededRir: 2,
        methodologyId: '2'
      },
      {
        id: 'ts-6',
        name: 'Accessory',
        description: 'Supplementary exercises for balance and hypertrophy',
        setsRange: { min: 2, max: 4 },
        repsRange: { min: 8, max: 15 },
        restRange: { min: 60, max: 120 },
        recommenededRir: 1,
        methodologyId: '2'
      }
    ],
    exerciseProgressions: [
      {
        id: 'ep-4',
        name: 'Percentage-Based Linear Progression',
        description: 'Increase weight based on percentage of 1RM',
        applicableExerciseTypes: ['compound', 'main lifts'],
        progressionStrategy: 'Start at 75% 1RM, increase by 2.5% each week for 6 weeks',
        deloadStrategy: 'Week 7 at 60% 1RM, then restart cycle at higher initial percentage',
        methodologyId: '2'
      }
    ],
    rirRanges: [
      {
        id: 'rir-4',
        name: 'Main Lift',
        description: 'RIR ranges for primary compound movements',
        minRir: 0,
        maxRir: 2,
        targetRir: 1,
        workoutTypes: ['wt-6', 'wt-7', 'wt-8'],
        methodologyId: '2'
      }
    ],
    blockTypes: [
      {
        id: 'bt-4',
        name: 'Accumulation',
        description: 'Higher volume, moderate intensity phase',
        recommendedDuration: { min: 3, max: 6 }, // in weeks
        recommendedFrequency: { min: 3, max: 4 }, // workouts per week
        preferredWorkoutTypes: ['wt-6', 'wt-7', 'wt-8'],
        recommendedVolumeRange: { min: 15, max: 25 }, // sets per muscle group per week
        methodologyId: '2'
      },
      {
        id: 'bt-5',
        name: 'Intensification',
        description: 'Higher intensity, lower volume phase',
        recommendedDuration: { min: 3, max: 5 }, // in weeks
        recommendedFrequency: { min: 3, max: 4 }, // workouts per week
        preferredWorkoutTypes: ['wt-6', 'wt-7', 'wt-8'],
        recommendedVolumeRange: { min: 10, max: 15 }, // sets per muscle group per week
        methodologyId: '2'
      },
      {
        id: 'bt-6',
        name: 'Peak/Taper',
        description: 'Very high intensity, very low volume to peak strength',
        recommendedDuration: { min: 1, max: 3 }, // in weeks
        recommendedFrequency: { min: 2, max: 3 }, // workouts per week
        preferredWorkoutTypes: ['wt-6', 'wt-7', 'wt-8'],
        recommendedVolumeRange: { min: 5, max: 10 }, // sets per muscle group per week
        methodologyId: '2'
      }
    ],
    measuringProtocol: {
      id: 'mp-2',
      name: 'Strength Performance Tracking',
      description: 'Focus on performance metrics rather than physical measurements',
      weightFrequency: 'weekly',
      measurementsFrequency: 'monthly',
      photosFrequency: 'quarterly',
      requiredMeasurements: ['weight', '1RM-squat', '1RM-bench', '1RM-deadlift'],
      recommendedPhotoAngles: ['front', 'side'],
      methodologyId: '2'
    }
  }
];

// Helper functions for mock data
const findMockMethodologyById = (id: string): TrainingMethodology | undefined => {
  return mockMethodologies.find(methodology => methodology.id === id);
};

export const methodologyService = {
  // Get all methodologies
  getMethodologies: async (): Promise<TrainingMethodology[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return [...mockMethodologies];
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/methodologies`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch methodologies');
      }
      return response.json();
    } catch (error) {
      logger.warn('Using mock methodologies because API call failed:', error);
      // Return mock data on error
      return [...mockMethodologies];
    }
  },

  // Get methodology by ID
  getMethodologyById: async (id: string): Promise<TrainingMethodology> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      const mockMethodology = findMockMethodologyById(id);
      if (mockMethodology) {
        return { ...mockMethodology };
      }
      throw new Error(`Methodology with id ${id} not found in mock data`);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/methodologies/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch methodology with id ${id}`);
      }
      return response.json();
    } catch (error) {
      logger.warn(`Using mock methodology because API call failed for methodology ${id}:`, error);
      // Look for a matching methodology in mock data
      const mockMethodology = findMockMethodologyById(id);
      if (mockMethodology) {
        return { ...mockMethodology };
      }
      throw new Error(`Methodology with id ${id} not found in mock data`);
    }
  },

  // Create a new methodology
  createMethodology: async (methodology: Omit<TrainingMethodology, 'id' | 'createdAt' | 'updatedAt'>): Promise<TrainingMethodology> => {
    // If mock mode is enabled, create in mock data
    if (USE_MOCK_DATA) {
      const newMethodology: TrainingMethodology = {
        ...methodology,
        id: `mock-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockMethodologies.push(newMethodology);
      return newMethodology;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/methodologies`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(methodology),
      });
      if (!response.ok) {
        throw new Error('Failed to create methodology');
      }
      return response.json();
    } catch (error) {
      logger.warn('Using mock create because API call failed:', error);
      // Create a new methodology with mock data
      const newMethodology: TrainingMethodology = {
        ...methodology,
        id: `mock-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockMethodologies.push(newMethodology);
      return newMethodology;
    }
  },

  // Update an existing methodology
  updateMethodology: async (methodology: TrainingMethodology): Promise<TrainingMethodology> => {
    // If mock mode is enabled, update in mock data
    if (USE_MOCK_DATA) {
      const index = mockMethodologies.findIndex(m => m.id === methodology.id);
      if (index !== -1) {
        const updatedMethodology = {
          ...methodology,
          updatedAt: new Date().toISOString()
        };
        mockMethodologies[index] = updatedMethodology;
        return updatedMethodology;
      }
      throw new Error(`Methodology with id ${methodology.id} not found in mock data`);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/methodologies/${methodology.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(methodology),
      });
      if (!response.ok) {
        throw new Error(`Failed to update methodology with id ${methodology.id}`);
      }
      return response.json();
    } catch (error) {
      logger.warn(`Using mock update because API call failed for methodology ${methodology.id}:`, error);
      // Update the methodology in mock data
      const index = mockMethodologies.findIndex(m => m.id === methodology.id);
      if (index !== -1) {
        const updatedMethodology = {
          ...methodology,
          updatedAt: new Date().toISOString()
        };
        mockMethodologies[index] = updatedMethodology;
        return updatedMethodology;
      }
      throw new Error(`Methodology with id ${methodology.id} not found in mock data`);
    }
  },

  // Delete a methodology
  deleteMethodology: async (id: string): Promise<void> => {
    // If mock mode is enabled, delete from mock data
    if (USE_MOCK_DATA) {
      const index = mockMethodologies.findIndex(m => m.id === id);
      if (index !== -1) {
        mockMethodologies.splice(index, 1);
        return;
      }
      throw new Error(`Methodology with id ${id} not found in mock data`);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/methodologies/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete methodology with id ${id}`);
      }
    } catch (error) {
      logger.warn(`Using mock delete because API call failed for methodology ${id}:`, error);
      // Remove the methodology from mock data
      const index = mockMethodologies.findIndex(m => m.id === id);
      if (index !== -1) {
        mockMethodologies.splice(index, 1);
        return;
      }
      throw new Error(`Methodology with id ${id} not found in mock data`);
    }
  },

  // Get workout types for a methodology
  getWorkoutTypes: async (methodologyId: string): Promise<WorkoutType[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      const methodology = findMockMethodologyById(methodologyId);
      if (methodology) {
        return [...methodology.workoutTypes];
      }
      throw new Error(`Methodology with id ${methodologyId} not found in mock data`);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/methodologies/${methodologyId}/workout-types`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch workout types for methodology ${methodologyId}`);
      }
      return response.json();
    } catch (error) {
      logger.warn(`Using mock workout types because API call failed for methodology ${methodologyId}:`, error);
      // Return workout types from mock data
      const methodology = findMockMethodologyById(methodologyId);
      if (methodology) {
        return [...methodology.workoutTypes];
      }
      throw new Error(`Methodology with id ${methodologyId} not found in mock data`);
    }
  },

  // Get block types for a methodology
  getBlockTypes: async (methodologyId: string): Promise<BlockType[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      const methodology = findMockMethodologyById(methodologyId);
      if (methodology) {
        return [...methodology.blockTypes];
      }
      throw new Error(`Methodology with id ${methodologyId} not found in mock data`);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/methodologies/${methodologyId}/block-types`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch block types for methodology ${methodologyId}`);
      }
      return response.json();
    } catch (error) {
      logger.warn(`Using mock block types because API call failed for methodology ${methodologyId}:`, error);
      // Return block types from mock data
      const methodology = findMockMethodologyById(methodologyId);
      if (methodology) {
        return [...methodology.blockTypes];
      }
      throw new Error(`Methodology with id ${methodologyId} not found in mock data`);
    }
  }
};