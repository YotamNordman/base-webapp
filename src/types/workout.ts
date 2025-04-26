import { Exercise } from '../components/common/cards/workout-card/types';
import { EnhancedExercise, LogbookEntry } from './exercise';

// Make sure Exercise type can work with WorkoutExercise
export type { Exercise };

// Exercise Set with detailed information
export interface ExerciseSet {
  id?: number;
  setNumber: number;
  plannedReps: number;
  plannedWeight?: number;
  plannedRir?: number;
  actualReps?: number;
  actualWeight?: number;
  actualRir?: number;
  completed: boolean;
}

// Exercise in a workout
export interface WorkoutExercise {
  id?: string | number;
  name: string;
  sets?: number; // For backwards compatibility
  reps?: number; // For backwards compatibility
  weight?: number; // For backwards compatibility
  restTime?: number;
  notes?: string;
  duration?: number;
  setDetails?: ExerciseSet[]; // Detailed information about sets
}

// Standard Workout interface
export interface Workout {
  id: string | number; // Allow both string and number for compatibility
  title: string;
  description?: string;
  coachId?: string;
  clientId: string | number; // Allow both string and number for compatibility
  clientName?: string;
  createdAt?: string;
  scheduledFor?: string;
  completed: boolean;
  exercises: WorkoutExercise[];
  duration?: number;
}

// Legacy workout interface for backward compatibility
export interface LegacyWorkout {
  id: string;
  title: string;
  description: string;
  coachId: string;
  clientId: string;
  clientName?: string;
  createdAt: string;
  scheduledFor: string;
  completed: boolean;
  exercises: Exercise[];
  duration?: number;
}

// Enhanced workout interface based on trainer's methodology
export interface EnhancedWorkout {
  id: string | number;
  title: string;
  description?: string;
  coachId: string;
  clientId: string | number; // Allow both string and number for compatibility
  clientName?: string;
  createdAt: string;
  scheduledFor: string;
  completedAt?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  exercises: EnhancedExercise[];
  notes?: string;
  duration: number;
  
  // Enhanced fields for trainer's methodology
  workoutType: 'strength' | 'cardio' | 'recovery' | 'mixed';
  workoutNumber: number;
  weekNumber: number;
  bodyFocus: string[];
  totalVolume?: number;
  previousWorkoutId?: number;
  logbookEntries?: LogbookEntry[];
  
  // Methodology-specific fields
  methodologyId?: string;
  methodologyWorkoutTypeId?: string;
  trainingStyleId?: string;
  targetRir?: number;
  rirRangeId?: string;
}

// Training Week entity
export interface TrainingWeek {
  id: string | number;
  title: string;
  description?: string;
  blockId: string | number;
  weekNumber: number;
  notes?: string;
  workouts?: Workout[];
}

// Training Block entity
export interface TrainingBlock {
  id: string | number;
  title: string;
  description?: string;
  coachId?: string;
  clientId?: string | number;
  clientName?: string;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
  goal?: string;
  notes?: string;
  isTemplate: boolean;
  weeks?: TrainingWeek[];
}

export interface WorkoutFilters {
  searchQuery: string;
  statusFilter: 'all' | 'completed' | 'pending' | 'cancelled';
  clientFilter: string;
  dateFilter: {
    startDate: string | null;
    endDate: string | null;
  };
  workoutTypeFilter?: 'all' | 'strength' | 'cardio' | 'recovery' | 'mixed';
  weekNumberFilter?: number | null;
}

export interface PreviousWorkoutPerformance {
  workoutId: string | number;
  title?: string;
  date?: string;
  completedAt?: string;
  exercises: {
    id?: string | number;
    exerciseId?: string | number;
    name: string;
    sets: {
      setNumber: number;
      reps?: number;
      weight?: number;
      rir?: number;
      actualWeight?: number;
      actualReps?: number;
      actualRir?: number;
    }[];
  }[];
  volume?: number;
}