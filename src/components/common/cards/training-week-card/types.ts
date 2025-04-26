import { TrainingWeek } from '../../../../types/trainingBlock';

export interface TrainingWeekCardProps {
  week: TrainingWeek;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onEditWeek?: (weekId: number | string) => void;
  onDeleteWeek?: (weekId: number | string) => void;
  onAddWorkout?: (weekId: number | string) => void;
  onEditWorkout?: (workoutId: number | string) => void;
  onDeleteWorkout?: (workoutId: number | string) => void;
  onViewWorkout?: (workoutId: number | string) => void;
}