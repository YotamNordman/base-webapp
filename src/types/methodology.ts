/**
 * Types for the trainer's methodology implementation
 */

export interface TrainingMethodology {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  workoutTypes: WorkoutType[];
  trainingStyles: TrainingStyle[];
  exerciseProgressions: ExerciseProgression[];
  rirRanges: RirRange[];
  blockTypes: BlockType[];
  measuringProtocol: MeasurementProtocol;
}

export interface WorkoutType {
  id: string;
  name: string;
  description: string;
  purpose: string;
  recommendedFrequency: string;
  colorCode: string;
  defaultDuration: number; // in minutes
  methodologyId: string;
}

export interface TrainingStyle {
  id: string;
  name: string;
  description: string;
  setsRange: { min: number; max: number };
  repsRange: { min: number; max: number };
  restRange: { min: number; max: number }; // in seconds
  recommenededRir: number;
  methodologyId: string;
}

export interface ExerciseProgression {
  id: string;
  name: string; // e.g., "Linear Progression", "Double Progression", "Undulating Progression"
  description: string;
  applicableExerciseTypes: string[]; // e.g., ["compound", "isolation"]
  progressionStrategy: string;
  deloadStrategy: string;
  methodologyId: string;
}

export interface RirRange {
  id: string;
  name: string; // e.g., "Beginner", "Intermediate", "Advanced"
  description: string;
  minRir: number;
  maxRir: number;
  targetRir: number;
  workoutTypes: string[]; // IDs of workout types this applies to
  methodologyId: string;
}

export interface BlockType {
  id: string;
  name: string; // e.g., "Hypertrophy", "Strength", "Endurance", "Recovery"
  description: string;
  recommendedDuration: { min: number; max: number }; // in weeks
  recommendedFrequency: { min: number; max: number }; // workouts per week
  preferredWorkoutTypes: string[]; // IDs of workout types
  recommendedVolumeRange: { min: number; max: number }; // sets per muscle group per week
  methodologyId: string;
}

export interface MeasurementProtocol {
  id: string;
  name: string;
  description: string;
  weightFrequency: string; // e.g., "daily", "weekly"
  measurementsFrequency: string; // e.g., "bi-weekly", "monthly"
  photosFrequency: string; // e.g., "monthly", "quarterly"
  requiredMeasurements: string[]; // e.g., ["weight", "chest", "waist", "hips", "thighs", "arms"]
  recommendedPhotoAngles: string[]; // e.g., ["front", "back", "side"]
  methodologyId: string;
}

export interface MethodologyFilters {
  searchQuery: string;
  creatorFilter: string;
  publicFilter: 'all' | 'public' | 'private';
  blockTypeFilter: string;
}