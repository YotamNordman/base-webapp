import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  alpha, 
  useTheme 
} from '@mui/material';
import { Exercise } from './types';

interface ExercisesListProps {
  exercises: Exercise[];
  maxDisplayed?: number;
  showFullDetails?: boolean;
}

const ExercisesList: React.FC<ExercisesListProps> = ({ 
  exercises, 
  maxDisplayed = 3,
  showFullDetails = false
}) => {
  const theme = useTheme();
  const displayedExercises = maxDisplayed ? exercises.slice(0, maxDisplayed) : exercises;
  const hasMoreExercises = exercises.length > maxDisplayed;
  
  return (
    <List disablePadding>
      {displayedExercises.map((exercise, index) => (
        <ListItem 
          key={exercise.id || index} 
          disablePadding 
          sx={{ 
            mb: 1, 
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 1,
            py: 0.75,
            px: 1.5
          }}
        >
          <ListItemText
            primary={exercise.name}
            secondary={
              <>
                {`${exercise.sets} סטים × ${exercise.reps} חזרות`}
                {showFullDetails && exercise.weight !== undefined && exercise.weight > 0 && 
                  ` • ${exercise.weight} ק"ג`}
                {showFullDetails && exercise.notes && 
                  <Box component="div" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                    הערות: {exercise.notes}
                  </Box>
                }
              </>
            }
            primaryTypographyProps={{ 
              fontWeight: 500, 
              fontSize: '0.9rem'
            }}
            secondaryTypographyProps={{ 
              fontSize: '0.8rem'
            }}
          />
        </ListItem>
      ))}
      
      {hasMoreExercises && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 1, textAlign: 'center' }}
        >
          + עוד {exercises.length - maxDisplayed} תרגילים
        </Typography>
      )}
    </List>
  );
};

export default ExercisesList;