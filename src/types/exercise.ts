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