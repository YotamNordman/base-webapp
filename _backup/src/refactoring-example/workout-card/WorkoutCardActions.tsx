import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface WorkoutCardActionsProps {
  id: number;
  completed: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
}

export const WorkoutCardActions: React.FC<WorkoutCardActionsProps> = ({
  id,
  completed,
  onEdit,
  onDelete,
  onComplete
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      {!completed && (
        <Button
          startIcon={<CheckCircleIcon />}
          color="success"
          onClick={() => onComplete(id)}
          size="small"
          sx={{ ml: 1 }}
        >
          סמן כהושלם
        </Button>
      )}
      <IconButton color="primary" onClick={() => onEdit(id)} size="small" sx={{ ml: 1 }}>
        <EditIcon />
      </IconButton>
      <IconButton color="error" onClick={() => onDelete(id)} size="small">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
