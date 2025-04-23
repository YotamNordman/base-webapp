import { ExerciseTemplate } from '../../../../types/exercise';

export interface ExerciseCardProps {
  template: ExerciseTemplate;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (template: ExerciseTemplate) => void;
  selectable?: boolean;
  selected?: boolean;
}