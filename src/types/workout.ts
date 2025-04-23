import { Exercise } from '../components/common/cards/workout-card/types';

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

export interface WorkoutFilters {
  searchQuery: string;
  statusFilter: 'all' | 'completed' | 'pending';
  clientFilter: string;
  dateFilter: {
    startDate: string | null;
    endDate: string | null;
  };
}