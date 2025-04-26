import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  InputAdornment, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  CircularProgress, 
  Alert,
  SelectChangeEvent,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { devLogin } from '../../utils/auth';
import { 
  fetchWorkouts, 
  selectFilteredWorkouts, 
  selectWorkoutStatus, 
  selectWorkoutError, 
  setSearchQuery, 
  setStatusFilter,
  selectWorkoutFilters,
  setClientFilter,
  completeWorkout,
  deleteWorkout
} from '../../store/slices/workoutsSlice';
import WorkoutCard from '../../components/common/cards/workout-card/WorkoutCard';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store';

const WorkoutListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const workouts = useSelector(selectFilteredWorkouts);
  const status = useSelector(selectWorkoutStatus);
  const error = useSelector(selectWorkoutError);
  const { searchQuery, statusFilter, clientFilter } = useSelector(selectWorkoutFilters);
  
  // Local debounced state for search query
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [loginLoading, setLoginLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Try to log in with developer credentials
  useEffect(() => {
    const login = async () => {
      try {
        setLoginLoading(true);
        const success = await devLogin();
        if (!success) {
          setLoginError('Failed to log in. Using mock data without authentication.');
        }
      } catch (err) {
        console.error('Login error:', err);
        setLoginError('Error during login. Using mock data without authentication.');
      } finally {
        setLoginLoading(false);
      }
    };
    
    login();
  }, []);
  
  useEffect(() => {
    // Load workouts when the component mounts and after login
    if (status === 'idle' && !loginLoading) {
      dispatch(fetchWorkouts());
    }
  }, [status, dispatch, loginLoading]);
  
  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [localSearchQuery, dispatch]);
  
  const handleAddWorkout = () => {
    navigate('/workouts/new');
  };
  
  const handleWorkoutClick = (id: string | number) => {
    navigate(`/workouts/${id}`);
  };
  
  const handleEditWorkout = (id: string | number) => {
    navigate(`/workouts/${id}/edit`);
  };
  
  const handleDeleteWorkout = (id: string | number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק אימון זה?')) {
      dispatch(deleteWorkout(id.toString()));
    }
  };
  
  const handleCompleteWorkout = (id: string | number) => {
    dispatch(completeWorkout(id.toString()));
  };
  
  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setStatusFilter(event.target.value as 'all' | 'completed' | 'pending'));
  };
  
  const handleClientFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setClientFilter(event.target.value));
  };
  
  const handleRefresh = () => {
    dispatch(fetchWorkouts());
  };
  
  // Get unique clients for filter dropdown
  const clientOptions = useSelector((state: any) => {
    const uniqueClients = new Map();
    state.workouts.workouts.forEach((workout: any) => {
      if (workout.clientName && workout.clientId) {
        uniqueClients.set(workout.clientId, workout.clientName);
      }
    });
    return Array.from(uniqueClients).map(([id, name]) => ({ id, name }));
  });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          אימונים
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            onClick={handleRefresh} 
            sx={{ mr: 1 }}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
          
          <Button 
            variant="outlined"
            onClick={() => navigate('/workouts/program')}
          >
            מתכנן תוכניות אימון
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/workouts/new')}
          >
            אימון חדש
          </Button>
        </Box>
      </Box>
      
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="חיפוש אימונים לפי שם, תיאור או מתאמן..."
              variant="outlined"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3.5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-filter-label">סטטוס</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="סטטוס"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">כל הסטטוסים</MenuItem>
                <MenuItem value="completed">הושלמו</MenuItem>
                <MenuItem value="pending">ממתינים</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3.5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="client-filter-label">מתאמן</InputLabel>
              <Select
                labelId="client-filter-label"
                id="client-filter"
                value={clientFilter}
                label="מתאמן"
                onChange={handleClientFilterChange}
              >
                <MenuItem value="">כל המתאמנים</MenuItem>
                {clientOptions.map((client: any) => (
                  <MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      {status === 'loading' && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      
      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'טעינת האימונים נכשלה'}
        </Alert>
      )}
      
      {status === 'succeeded' && workouts.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          לא נמצאו אימונים. נסה לשנות את החיפוש או הסינון.
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {workouts.map(workout => (
          <Grid item xs={12} sm={6} md={4} key={workout.id}>
            <WorkoutCard 
              id={workout.id}
              title={workout.title}
              description={workout.description || ''}
              duration={workout.duration}
              exercises={workout.exercises}
              scheduledFor={workout.scheduledFor}
              completed={workout.completed}
              clientName={workout.clientName}
              onClick={() => handleWorkoutClick(workout.id)}
              onComplete={handleCompleteWorkout}
              onEdit={handleEditWorkout}
              onDelete={handleDeleteWorkout}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WorkoutListPage;