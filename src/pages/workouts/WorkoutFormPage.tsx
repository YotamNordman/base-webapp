import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton, 
  Card, 
  CardContent, 
  Divider,
  Alert,
  CircularProgress,
  SelectChangeEvent,
  Snackbar
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessCenterIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchWorkoutById, 
  createWorkout, 
  updateWorkout,
  selectSelectedWorkout,
  selectWorkoutStatus,
  selectWorkoutError,
  clearSelectedWorkout
} from '../../store/slices/workoutsSlice';
import { Exercise } from '../../components/common/cards/workout-card/types';
import { AppDispatch } from '../../store';
import { Workout } from '../../types/workout';

// Default empty exercise template
const emptyExercise: Exercise = {
  name: '',
  sets: 3,
  reps: 10,
  weight: 0,
  notes: ''
};

// Default client options for dropdown (should come from API in a real implementation)
const clientOptions = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Michael Johnson' },
  { id: '4', name: 'Emily Williams' },
  { id: '5', name: 'David Brown' }
];

const WorkoutFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const existingWorkout = useSelector(selectSelectedWorkout);
  const status = useSelector(selectWorkoutStatus);
  const error = useSelector(selectWorkoutError);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Workout, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    coachId: '1', // Default coach ID (should be the logged in user in real app)
    clientId: '',
    clientName: '',
    scheduledFor: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
    completed: false,
    exercises: [{ ...emptyExercise }],
    duration: 30
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Load workout data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchWorkoutById(id));
    } else {
      dispatch(clearSelectedWorkout());
    }
    
    return () => {
      dispatch(clearSelectedWorkout());
    };
  }, [isEditMode, id, dispatch]);
  
  // Populate form with existing workout data
  useEffect(() => {
    if (isEditMode && existingWorkout) {
      setFormData({
        title: existingWorkout.title,
        description: existingWorkout.description,
        coachId: existingWorkout.coachId,
        clientId: existingWorkout.clientId,
        clientName: existingWorkout.clientName,
        scheduledFor: new Date(existingWorkout.scheduledFor).toISOString().slice(0, 16),
        completed: existingWorkout.completed,
        exercises: existingWorkout.exercises.map(ex => ({ ...ex })),
        duration: existingWorkout.duration
      });
    }
  }, [isEditMode, existingWorkout]);
  
  // Update client name when client ID changes
  useEffect(() => {
    if (formData.clientId) {
      const selectedClient = clientOptions.find(client => client.id === formData.clientId);
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientName: selectedClient.name
        }));
      }
    }
  }, [formData.clientId]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select field changes
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle exercise field changes
  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    setFormData(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value
      };
      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };
  
  // Add a new exercise
  const handleAddExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...emptyExercise }]
    }));
  };
  
  // Remove an exercise
  const handleRemoveExercise = (index: number) => {
    setFormData(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises.splice(index, 1);
      return {
        ...prev,
        exercises: updatedExercises.length > 0 ? updatedExercises : [{ ...emptyExercise }]
      };
    });
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode && id) {
        await dispatch(updateWorkout({ 
          ...formData, 
          id, 
          createdAt: existingWorkout?.createdAt || new Date().toISOString() 
        })).unwrap();
        setSnackbarMessage('האימון עודכן בהצלחה');
      } else {
        await dispatch(createWorkout(formData)).unwrap();
        setSnackbarMessage('האימון נוצר בהצלחה');
      }
      
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/workouts');
      }, 1500);
    } catch (err) {
      console.error('Failed to save workout:', err);
      setSnackbarMessage('אירעה שגיאה בשמירת האימון');
      setSnackbarOpen(true);
    }
  };
  
  const handleBack = () => {
    navigate('/workouts');
  };
  
  if (isEditMode && status === 'loading') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (isEditMode && status === 'failed') {
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
          {isEditMode ? 'עריכת אימון' : 'יצירת אימון חדש'}
        </Typography>
      </Box>
      
      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        elevation={2} 
        sx={{ p: 3, borderRadius: 2 }}
      >
        <Grid container spacing={3}>
          {/* Basic workout information */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              פרטי אימון
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="כותרת האימון"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="תיאור"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="client-label">מתאמן</InputLabel>
              <Select
                labelId="client-label"
                name="clientId"
                value={formData.clientId}
                label="מתאמן"
                onChange={handleSelectChange}
              >
                {clientOptions.map(client => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="datetime-local"
              label="תאריך ושעה"
              name="scheduledFor"
              value={formData.scheduledFor}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="משך האימון (דקות)"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              inputProps={{ min: 5, max: 240 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">סטטוס</InputLabel>
              <Select
                labelId="status-label"
                name="completed"
                value={formData.completed.toString()}
                label="סטטוס"
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    completed: e.target.value === 'true'
                  }));
                }}
              >
                <MenuItem value="false">ממתין</MenuItem>
                <MenuItem value="true">הושלם</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Exercises section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                תרגילים
              </Typography>
              <Button 
                startIcon={<AddIcon />} 
                onClick={handleAddExercise}
                variant="outlined"
                color="primary"
              >
                הוסף תרגיל
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            {formData.exercises.map((exercise, index) => (
              <Card 
                key={index} 
                sx={{ 
                  mb: 2, 
                  borderRight: 4, 
                  borderColor: 'primary.main'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center">
                      <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        תרגיל {index + 1}
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={() => handleRemoveExercise(index)}
                      color="error"
                      disabled={formData.exercises.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="שם התרגיל"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        type="number"
                        label="מספר סטים"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', Number(e.target.value))}
                        inputProps={{ min: 1, max: 20 }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        type="number"
                        label="מספר חזרות"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', Number(e.target.value))}
                        inputProps={{ min: 1, max: 100 }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label='משקל (ק"ג)'
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, 'weight', Number(e.target.value))}
                        inputProps={{ min: 0, max: 1000 }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="הערות"
                        value={exercise.notes || ''}
                        onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>
          
          {/* Submit buttons */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button 
                variant="outlined" 
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                ביטול
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                startIcon={<SaveIcon />}
                disabled={status === 'loading'}
              >
                {isEditMode ? 'עדכן אימון' : 'צור אימון'}
                {status === 'loading' && <CircularProgress size={20} sx={{ ml: 1 }} />}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default WorkoutFormPage;