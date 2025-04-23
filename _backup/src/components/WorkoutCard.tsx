import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Button,
  IconButton
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

interface WorkoutCardProps {
  id: number;
  title: string;
  description?: string;
  scheduledFor: string;
  completed: boolean;
  exercises: Exercise[];
  clientName: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  id,
  title,
  description,
  scheduledFor,
  completed,
  exercises,
  clientName,
  onEdit,
  onDelete,
  onComplete
}) => {
  // Format the date to be more readable
  const formattedDate = new Date(scheduledFor).toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card sx={{ mb: 2, borderRadius: 2, borderRight: completed ? '4px solid #4caf50' : '4px solid #ff9800' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h2" align="right" gutterBottom>
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" align="right" sx={{ mb: 1 }}>
                {description}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" align="right">
              <strong>מתאמן:</strong> {clientName}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="right">
              <strong>מועד:</strong> {formattedDate}
            </Typography>
          </Box>
          <Box>
            <Chip 
              icon={completed ? <CheckCircleIcon /> : <PendingIcon />} 
              label={completed ? "הושלם" : "ממתין"} 
              color={completed ? "success" : "warning"}
              sx={{ mb: 1 }}
            />
          </Box>
        </Box>
        
        {/* Exercises summary */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle2" align="right" gutterBottom>
            תרגילים ({exercises.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-end' }}>
            {exercises.map((exercise) => (
              <Chip
                key={exercise.id}
                icon={<FitnessCenterIcon />}
                label={`${exercise.name} (${exercise.sets}×${exercise.reps})`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
        
        {/* Action buttons */}
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
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
