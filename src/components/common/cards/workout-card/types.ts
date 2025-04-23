// Exercise type definition
export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  restTime?: number;
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