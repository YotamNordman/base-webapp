import { TrainingWeek } from '../../../../types/trainingBlock';

export interface TrainingWeekCardProps {
  week: TrainingWeek;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onEditWeek?: (weekId: string) => void;
  onDeleteWeek?: (weekId: string) => void;
  onAddWorkout?: (weekId: string) => void;
  onEditWorkout?: (workoutId: string) => void;
  onDeleteWorkout?: (workoutId: string) => void;
  onViewWorkout?: (workoutId: string) => void;
}