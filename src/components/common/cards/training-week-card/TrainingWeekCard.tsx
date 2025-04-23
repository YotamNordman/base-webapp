import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Divider, 
  Collapse,
  List,
  ListItem,
  Button,
  Grid,
  alpha,
  useTheme
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FitnessCenter as FitnessCenterIcon
} from '@mui/icons-material';
import { TrainingWeekCardProps } from './types';
import WorkoutCard from '../../cards/workout-card/WorkoutCard';

const TrainingWeekCard: React.FC<TrainingWeekCardProps> = ({
  week,
  expanded = false,
  onToggleExpand,
  onEditWeek,
  onDeleteWeek,
  onAddWorkout,
  onEditWorkout,
  onDeleteWorkout,
  onViewWorkout
}) => {
  const theme = useTheme();
  
  const handleExpandClick = () => {
    if (onToggleExpand) onToggleExpand();
  };
  
  const handleEditWeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditWeek) onEditWeek(week.id);
  };
  
  const handleDeleteWeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteWeek && window.confirm('האם אתה בטוח שברצונך למחוק שבוע זה?')) {
      onDeleteWeek(week.id);
    }
  };
  
  const handleAddWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddWorkout) onAddWorkout(week.id);
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        mb: 3, 
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          cursor: 'pointer'
        }}
        onClick={handleExpandClick}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {week.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ ml: 2 }}
          >
            {week.description}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {onEditWeek && (
            <IconButton 
              size="small" 
              onClick={handleEditWeek}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          
          {onDeleteWeek && (
            <IconButton 
              size="small" 
              color="error" 
              onClick={handleDeleteWeek}
              sx={{ mr: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
          
          <IconButton 
            size="small"
            onClick={handleExpandClick}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      
      {/* Notes section - always visible */}
      {week.notes && (
        <Box sx={{ px: 2, py: 1, backgroundColor: alpha(theme.palette.warning.light, 0.1) }}>
          <Typography variant="body2" color="text.secondary">
            <strong>הערות:</strong> {week.notes}
          </Typography>
        </Box>
      )}
      
      {/* Collapsible content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              אימונים ({week.workouts.length})
            </Typography>
            
            {onAddWorkout && (
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={handleAddWorkout}
              >
                הוסף אימון
              </Button>
            )}
          </Box>
          
          {week.workouts.length === 0 ? (
            <Box 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: alpha(theme.palette.grey[400], 0.1),
                borderRadius: 1
              }}
            >
              <Typography color="text.secondary">
                אין אימונים מתוכננים לשבוע זה
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {week.workouts.map(workout => (
                <Grid item xs={12} md={6} key={workout.id}>
                  <WorkoutCard
                    id={workout.id}
                    title={workout.title}
                    description={workout.description || ''}
                    duration={workout.duration}
                    exercises={workout.exercises}
                    scheduledFor={workout.scheduledFor}
                    completed={workout.completed}
                    clientName={workout.clientName}
                    onClick={() => onViewWorkout && onViewWorkout(workout.id)}
                    onEdit={() => onEditWorkout && onEditWorkout(workout.id)}
                    onDelete={() => onDeleteWorkout && onDeleteWorkout(workout.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default TrainingWeekCard;