export interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
  targetMuscleGroups: string;
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  description: string;
  categoryId?: string;
  targetMuscleGroups: string;
  instructions: string;
  difficultyLevel: string;
  equipmentNeeded: string;
  imageUrl?: string;
  videoUrl?: string;
  defaultSets?: number;
  defaultReps?: number;
  defaultDuration?: number; // in seconds
  defaultWeight?: number;
}

export interface ExerciseFilters {
  searchQuery: string;
  categoryFilter: string;
  difficultyFilter: string;
  equipmentFilter: string;
}

// Enhanced exercise type based on trainer's methodology
export interface EnhancedExercise {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  targetMuscles: string[];
  instructions?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  restTime: number; // in seconds
  notes?: string;
  order: number;
  
  // Enhanced fields for trainer's methodology
  videoUrl?: string;
  muscleGroup: string;
  sets: ExerciseSet[];
  manipulationStrategy?: string; // e.g., "Add 2.5kg each week"
  previousPerformance?: PreviousPerformance;
  volume?: number; // Calculated from sets × reps × weight
  volumeProgression?: number; // % change from previous performance
  
  // Methodology-specific fields
  exerciseProgressionId?: string; // Reference to progression strategy from methodology
  trainingStyleId?: string; // Reference to training style from methodology
  progressionHistory?: ProgressionEntry[]; // History of progression over time
  lastDeloadDate?: string; // When deload was last applied
}

export interface ExerciseSet {
  setNumber: number;
  plannedReps: number;
  plannedWeight?: number;
  plannedRir?: number; // Planned Reps In Reserve
  actualReps?: number;
  actualWeight?: number;
  actualRir?: number; // Actual Reps In Reserve
  completed: boolean;
}

export interface PreviousPerformance {
  date: string; // ISO 8601 format
  sets: PreviousSet[];
  totalVolume?: number;
}

export interface PreviousSet {
  setNumber: number;
  reps: number;
  weight?: number;
  rir?: number; // Reps In Reserve
}

export interface LogbookEntry {
  id?: number | string;
  workoutId: number;
  exerciseId: number;
  setNumber: number;
  plannedReps: number;
  actualReps?: number;
  plannedWeight?: number;
  actualWeight?: number;
  plannedRir: number; // Planned Reps In Reserve
  actualRir?: number; // Actual Reps In Reserve
  completed: boolean;
  loggedAt?: string; // ISO 8601 format
  notes?: string;
}

export interface ProgressionEntry {
  date: string; // ISO 8601 format
  exerciseId: number;
  workoutId: number;
  bestWeight: number; // Best weight achieved for target reps
  bestReps: number; // Best reps achieved for target weight
  volume: number; // Total volume for exercise
  progressionApplied: string; // Description of progression applied
  deloadApplied?: boolean; // Whether a deload was applied
  notes?: string; // Any additional notes about the progression
}