import { Workout } from './workout';

export interface TrainingWeek {
  id: string;
  title: string;
  description?: string;
  blockId: string;
  weekNumber: number;
  notes?: string;
  workouts: Workout[];
}

export interface TrainingBlock {
  id: string;
  title: string;
  description?: string;
  coachId: string;
  clientId?: string;
  clientName?: string; // For display purposes
  createdAt: string;
  startDate: string;
  endDate: string;
  goal?: string;
  notes?: string;
  isTemplate: boolean;
  weeks: TrainingWeek[];
}

export interface TrainingBlockFilters {
  searchQuery: string;
  clientFilter: string;
  templateFilter: 'all' | 'templates' | 'assigned';
  goalFilter: string;
  dateFilter: {
    startDate: string | null;
    endDate: string | null;
  };
}