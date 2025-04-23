import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid, 
  Divider, 
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchWorkoutById, 
  selectSelectedWorkout,
  selectWorkoutStatus,
  selectWorkoutError,
  completeWorkout,
  deleteWorkout
} from '../../store/slices/workoutsSlice';
import ExercisesList from '../../components/common/cards/workout-card/ExercisesList';
import { AppDispatch } from '../../store';

const WorkoutDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const workout = useSelector(selectSelectedWorkout);
  const status = useSelector(selectWorkoutStatus);
  const error = useSelector(selectWorkoutError);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchWorkoutById(id));
    }
  }, [id, dispatch]);
  
  const handleEdit = () => {
    if (id) {
      navigate(`/workouts/${id}/edit`);
    }
  };
  
  const handleDelete = () => {
    if (id && window.confirm('האם אתה בטוח שברצונך למחוק אימון זה?')) {
      dispatch(deleteWorkout(id));
      navigate('/workouts');
    }
  };
  
  const handleComplete = () => {
    if (id) {
      dispatch(completeWorkout(id));
    }
  };
  
  const handleBack = () => {
    navigate('/workouts');
  };
  
  if (status === 'loading') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (status === 'failed') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'טעינת האימון נכשלה'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          variant="outlined"
        >
          חזרה לאימונים
        </Button>
      </Container>
    );
  }
  
  if (!workout) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          האימון המבוקש לא נמצא
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          variant="outlined"
        >
          חזרה לאימונים
        </Button>
      </Container>
    );
  }
  
  // Format the date to be more readable
  const formattedDate = new Date(workout.scheduledFor).toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header with back button */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton 
          onClick={handleBack} 
          sx={{ mr: 2, bgcolor: 'background.default' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          פרטי אימון
        </Typography>
      </Box>
      
      {/* Workout card */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          borderRight: 6,
          borderColor: workout.completed ? 'success.main' : 'warning.main' 
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {workout.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {workout.description}
            </Typography>
          </Box>
          
          <Chip 
            label={workout.completed ? "הושלם" : "ממתין"} 
            color={workout.completed ? "success" : "warning"}
            icon={workout.completed ? <CheckCircleIcon /> : undefined}
          />
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>תאריך: </strong>{formattedDate}
              </Typography>
            </Box>
            
            {workout.duration && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>משך זמן: </strong>{workout.duration} דקות
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {workout.clientName && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main', width: 24, height: 24 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Typography variant="body1">
                  <strong>מתאמן: </strong>{workout.clientName}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>תרגילים: </strong>{workout.exercises.length}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="h6" fontWeight="bold" mb={2}>
          רשימת תרגילים
        </Typography>
        
        <ExercisesList 
          exercises={workout.exercises} 
          maxDisplayed={100} 
          showFullDetails={true} 
        />
        
        <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
          {!workout.completed && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleComplete}
            >
              סמן כהושלם
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            ערוך
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            מחק
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default WorkoutDetailPage;