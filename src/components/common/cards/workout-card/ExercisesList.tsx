import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  alpha, 
  useTheme,
  Chip,
  Tooltip, 
  Grid
} from '@mui/material';
import {
  DirectionsRun as RunIcon,
  RepeatOn as RepeatIcon,
  FitnessCenter as WeightIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import { Exercise } from './types';

interface ExercisesListProps {
  exercises: Exercise[];
  maxDisplayed?: number;
  showFullDetails?: boolean;
  compact?: boolean;
}

const ExercisesList: React.FC<ExercisesListProps> = ({ 
  exercises, 
  maxDisplayed = 3,
  showFullDetails = false,
  compact = false
}) => {
  const theme = useTheme();
  const displayedExercises = maxDisplayed ? exercises.slice(0, maxDisplayed) : exercises;
  const hasMoreExercises = exercises.length > maxDisplayed;
  
  if (compact) {
    return (
      <Box>
        <Grid container spacing={1}>
          {displayedExercises.map((exercise, index) => (
            <Grid item key={exercise.id || index}>
              <Chip
                label={exercise.name}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Grid>
          ))}
          
          {hasMoreExercises && (
            <Grid item>
              <Chip
                label={`+${exercises.length - maxDisplayed}`}
                size="small"
                color="default"
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }
  
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
            py: 1,
            px: 1.5,
            transition: 'all 0.15s ease-in-out',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              transform: 'translateX(-2px)'
            }
          }}
        >
          <ListItemText
            primary={
              <Typography fontWeight={500} fontSize="0.95rem">
                {exercise.name}
              </Typography>
            }
            secondary={
              <Box sx={{ mt: 0.5 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <Tooltip title="סטים וחזרות">
                      <Chip
                        icon={<RepeatIcon fontSize="small" />}
                        label={`${exercise.sets} × ${exercise.reps}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ height: 24 }}
                      />
                    </Tooltip>
                  </Grid>
                  
                  {exercise.weight !== undefined && exercise.weight > 0 && (
                    <Grid item>
                      <Tooltip title="משקל">
                        <Chip
                          icon={<WeightIcon fontSize="small" />}
                          label={`${exercise.weight} ק"ג`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          sx={{ height: 24 }}
                        />
                      </Tooltip>
                    </Grid>
                  )}
                  
                  {showFullDetails && exercise.notes && (
                    <Grid item xs={12}>
                      <Box 
                        component="div" 
                        sx={{ 
                          mt: 0.5, 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <NotesIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                        <Typography variant="caption" color="text.secondary">
                          {exercise.notes}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            }
          />
        </ListItem>
      ))}
      
      {hasMoreExercises && (
        <Box
          sx={{
            mt: 1,
            textAlign: 'center',
            p: 0.75,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            cursor: 'pointer',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }
          }}
        >
          <Typography 
            variant="body2" 
            color="primary" 
            fontWeight="medium"
          >
            + עוד {exercises.length - maxDisplayed} תרגילים
          </Typography>
        </Box>
      )}
    </List>
  );
};

export default ExercisesList;