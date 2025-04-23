import { TrainingBlock } from '../../../../types/trainingBlock';

export interface TrainingBlockCardProps {
  block: TrainingBlock;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAssign?: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (block: TrainingBlock) => void;
}