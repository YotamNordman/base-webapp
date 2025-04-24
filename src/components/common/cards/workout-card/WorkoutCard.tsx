import React from 'react';
import { 
  Box, 
  Card, 
  CardContent,
  Chip,
  Typography, 
  Button,
  IconButton,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { WorkoutCardProps } from './types';
import ExercisesList from './ExercisesList';

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  id = '',
  title,
  description,
  duration,
  exercises,
  scheduledFor,
  completed,
  clientName,
  onClick,
  onComplete,
  onEdit,
  onDelete
}) => {
  const theme = useTheme();

  // Format the date to be more readable
  const formattedDate = scheduledFor 
    ? new Date(scheduledFor).toLocaleDateString('he-IL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : '';

  const handleCardClick = () => {
    if (onClick) onClick();
  };

  return (
    <Card 
      sx={{ 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
        cursor: onClick ? 'pointer' : 'default',
        mb: 3,
        borderRight: 5,
        borderColor: completed ? 'success.main' : 'warning.main',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start' 
          }}
          onClick={handleCardClick}
        >
          <Box>
            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 600,
                mb: 0.5 
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 1 }}
            >
              {description}
            </Typography>
            
            {clientName && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {clientName}
                </Typography>
              </Box>
            )}
            
            {formattedDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formattedDate}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip
              icon={completed ? <CheckCircleIcon /> : <PendingIcon />}
              label={completed ? "הושלם" : "ממתין"}
              color={completed ? "success" : "warning"}
              size="small"
            />
            
            {duration && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 4,
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
              >
                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                {duration} דקות
              </Box>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box onClick={handleCardClick}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1.5, 
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            <FitnessCenterIcon 
              fontSize="small" 
              sx={{ mr: 1, color: 'primary.main' }} 
            />
            תרגילים ({exercises.length})
          </Typography>
          
          <ExercisesList 
            exercises={exercises} 
            maxDisplayed={3} 
            compact={exercises.length > 3}
          />
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.background.default, 0.4)
          }}
        >
          {!completed && onComplete && (
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onComplete(id);
              }}
              sx={{ mr: 1 }}
            >
              סמן כהושלם
            </Button>
          )}
          
          {onEdit && (
            <IconButton 
              size="small" 
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              sx={{ ml: 1 }}
            >
              <EditIcon />
            </IconButton>
          )}
          
          {onDelete && (
            <IconButton 
              size="small" 
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;