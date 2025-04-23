import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Exercise } from './types';

interface ExercisesListProps {
  exercises: Exercise[];
}

export const ExercisesList: React.FC<ExercisesListProps> = ({ exercises }) => {
  return (
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
  );
};
