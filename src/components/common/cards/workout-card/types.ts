// Exercise type definition
export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  restTime?: number;
  duration?: number; // in seconds
  category?: string;
  muscleGroups?: string[];
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
}

// ExerciseTemplate type for predefined exercises
export interface ExerciseTemplate {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  defaultSets?: number;
  defaultReps?: number;
  defaultWeight?: number;
  instructions?: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  videoUrl?: string;
}

// WorkoutCard component props interface
export interface WorkoutCardProps {
  id?: string;
  title: string;
  description: string;
  duration?: number;  // Make duration optional
  exercises: Exercise[];
  scheduledFor?: string; // Changed from Date to string
  date?: string;       // Keep date for backward compatibility
  completed?: boolean;
  clientName?: string;
  onClick?: () => void;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Exercise selection dialog props
export interface ExerciseSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onExerciseSelect: (exercise: Exercise) => void;
}