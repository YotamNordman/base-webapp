import { Exercise } from '../components/common/cards/workout-card/types';
import { EnhancedExercise, LogbookEntry } from './exercise';

// Legacy workout interface for backward compatibility
export interface Workout {
  id: string;
  title: string;
  description: string;
  coachId: string;
  clientId: string;
  clientName?: string; // For display purposes
  createdAt: string;
  scheduledFor: string;
  completed: boolean;
  exercises: Exercise[];
  duration?: number; // In minutes
}

// Enhanced workout interface based on trainer's methodology
export interface EnhancedWorkout {
  id: number;
  title: string;
  description?: string;
  coachId: string;
  clientId: string;
  clientName?: string; // For display purposes
  createdAt: string; // ISO 8601 format
  scheduledFor: string; // ISO 8601 format
  completedAt?: string; // ISO 8601 format
  status: 'scheduled' | 'completed' | 'cancelled';
  exercises: EnhancedExercise[];
  notes?: string;
  duration: number; // in minutes
  
  // Enhanced fields for trainer's methodology
  workoutType: 'strength' | 'cardio' | 'recovery' | 'mixed';
  workoutNumber: number; // e.g., "Workout 1" in the week
  weekNumber: number; // Associated week in the training block
  bodyFocus: string[]; // Primary body areas trained (e.g., ["chest", "triceps"])
  totalVolume?: number; // Calculated from all exercises
  previousWorkoutId?: number; // Reference to the same workout from previous week
  logbookEntries?: LogbookEntry[];
  
  // Methodology-specific fields
  methodologyId?: string; // Reference to the applied training methodology
  methodologyWorkoutTypeId?: string; // Reference to specific workout type from methodology
  trainingStyleId?: string; // Reference to training style from methodology
  targetRir?: number; // Target RIR for this workout based on methodology
  rirRangeId?: string; // Reference to RIR range from methodology
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
  workoutId: number;
  title?: string;
  date?: string;
  completedAt?: string;
  exercises: {
    id?: number;
    exerciseId?: number;
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