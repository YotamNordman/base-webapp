// Types for the workout feature

export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface WorkoutBase {
  id: number;
  title: string;
  description?: string;
  scheduledFor: string;
  completed: boolean;
  exercises: Exercise[];
  clientName: string;
}

export interface WorkoutActions {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
}

export type WorkoutCardProps = WorkoutBase & WorkoutActions;
