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
  Snackbar,
  Tooltip,
  Fab,
  alpha,
  useTheme
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessCenterIcon,
  ContentCopy as CopyIcon,
  List as ListIcon
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
import { Exercise } from '../../types/workout';
import { AppDispatch } from '../../store';
import { Workout } from '../../types/workout';
import { ExerciseSelectionDialog } from '../../components/widgets/exercise-selector';

// Default empty exercise template
const emptyExercise = {
  name: '',
  sets: 3,
  reps: 10,
  weight: 0,
  notes: ''
};

// Default client options for dropdown (should come from API in a real implementation)
const clientOptions = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Michael Johnson' },
  { id: 4, name: 'Emily Williams' },
  { id: 5, name: 'David Brown' }
];

const WorkoutFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const existingWorkout = useSelector(selectSelectedWorkout);
  const status = useSelector(selectWorkoutStatus);
  const error = useSelector(selectWorkoutError);
  const theme = useTheme();
  
  // Form state
  const [formData, setFormData] = useState<Omit<Workout, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    coachId: '1', // Default coach ID (should be the logged in user in real app)
    clientId: 0,
    clientName: '',
    scheduledFor: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
    completed: false,
    exercises: [{ ...emptyExercise }],
    duration: 30
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
  
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
        scheduledFor: existingWorkout.scheduledFor ? new Date(existingWorkout.scheduledFor).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        completed: existingWorkout.completed,
        exercises: existingWorkout.exercises.map(ex => ({ ...ex })),
        duration: existingWorkout.duration
      });
    }
  }, [isEditMode, existingWorkout]);
  
  // Update client name when client ID changes
  useEffect(() => {
    if (formData.clientId) {
      const selectedClient = clientOptions.find(client => Number(client.id) === formData.clientId);
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
      [name]: name === 'clientId' ? Number(value) : value
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
    setSelectedExerciseIndex(null);
    setExerciseDialogOpen(true);
  };
  
  // Open exercise dialog for an existing exercise
  const handleEditExercise = (index: number) => {
    setSelectedExerciseIndex(index);
    setExerciseDialogOpen(true);
  };
  
  // Handle exercise selected from exercise dialog
  const handleExerciseSelected = (exercise: any) => {
    if (selectedExerciseIndex !== null) {
      // Update existing exercise
      setFormData(prev => {
        const updatedExercises = [...prev.exercises];
        updatedExercises[selectedExerciseIndex] = {
          ...updatedExercises[selectedExerciseIndex],
          ...exercise
        };
        return {
          ...prev,
          exercises: updatedExercises
        };
      });
    } else {
      // Add new exercise
      setFormData(prev => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }));
    }
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

  // Duplicate an exercise
  const handleDuplicateExercise = (index: number) => {
    setFormData(prev => {
      const updatedExercises = [...prev.exercises];
      const exerciseToDuplicate = { ...updatedExercises[index] };
      
      // Remove any ID to ensure it's treated as a new exercise
      if (exerciseToDuplicate.id) {
        delete exerciseToDuplicate.id;
      }
      
      // Insert the duplicated exercise after the original
      updatedExercises.splice(index + 1, 0, exerciseToDuplicate);
      
      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };

  // Move exercise up or down
  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formData.exercises.length - 1)
    ) {
      return; // Can't move further in this direction
    }
    
    setFormData(prev => {
      const updatedExercises = [...prev.exercises];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      // Swap the exercises
      [updatedExercises[index], updatedExercises[targetIndex]] = 
        [updatedExercises[targetIndex], updatedExercises[index]];
      
      return {
        ...prev,
        exercises: updatedExercises
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
          id: Number(id), 
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
                value={formData.clientId.toString()}
                label="מתאמן"
                onChange={handleSelectChange}
              >
                {clientOptions.map(client => (
                  <MenuItem key={client.id} value={client.id.toString()}>
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
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center" 
              mb={2}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                p: 2,
                borderRadius: 1
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                תרגילים
              </Typography>
              <Tooltip title="הוסף תרגיל חדש">
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={handleAddExercise}
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  הוסף תרגיל
                </Button>
              </Tooltip>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 2, fontStyle: 'italic' }}
            >
              השתמש בכפתורי החיצים כדי לשנות את סדר התרגילים. לחץ על כפתור השכפול כדי ליצור עותק של תרגיל.
            </Typography>
            
            {formData.exercises.map((exercise, index) => (
              <Card 
                key={`exercise-${index}`}
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  borderRight: 4, 
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Box 
                        sx={{
                          mr: 1,
                          display: 'flex',
                          alignItems: 'center',
                          color: 'text.secondary'
                        }}
                      >
                        <IconButton 
                          size="small" 
                          onClick={() => handleMoveExercise(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowBackIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleMoveExercise(index, 'down')}
                          disabled={index === formData.exercises.length - 1}
                        >
                          <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />
                        </IconButton>
                      </Box>
                      <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        תרגיל {index + 1}
                      </Typography>
                    </Box>
                    <Box>
                      <Tooltip title="שכפל תרגיל">
                        <IconButton
                          onClick={() => handleDuplicateExercise(index)}
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="הסר תרגיל">
                        <span>
                          <IconButton 
                            onClick={() => handleRemoveExercise(index)}
                            color="error"
                            disabled={formData.exercises.length === 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="שם התרגיל"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        onClick={() => handleEditExercise(index)}
                        InputProps={{
                          endAdornment: (
                            <Tooltip title="בחר מתוך מאגר התרגילים">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent parent onClick from triggering
                                  handleEditExercise(index);
                                }}
                              >
                                <ListIcon />
                              </IconButton>
                            </Tooltip>
                          ),
                        }}
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
                        InputProps={{
                          sx: { fontWeight: 'bold' }
                        }}
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
                        InputProps={{
                          sx: { fontWeight: 'bold' }
                        }}
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
                        InputProps={{
                          sx: { fontWeight: 'bold' }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="הערות"
                        value={exercise.notes || ''}
                        onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                        placeholder="הוסף הערות או הנחיות מיוחדות לתרגיל..."
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
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              sx={{
                bgcolor: alpha(theme.palette.background.default, 0.7),
                p: 2,
                borderRadius: 1
              }}
            >
              <Button 
                variant="outlined" 
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{ fontWeight: 'medium' }}
              >
                ביטול
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                startIcon={<SaveIcon />}
                disabled={status === 'loading'}
                sx={{ 
                  fontWeight: 'bold',
                  px: 4,
                  py: 1,
                  boxShadow: 2
                }}
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

      {/* Floating Action Button for Exercise Library */}
      <Tooltip title="בחר מתוך מאגר תרגילים">
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
          onClick={() => {
            setSelectedExerciseIndex(null);
            setExerciseDialogOpen(true);
          }}
        >
          <ListIcon />
        </Fab>
      </Tooltip>
      
      {/* Exercise Selection Dialog */}
      <ExerciseSelectionDialog
        open={exerciseDialogOpen}
        onClose={() => setExerciseDialogOpen(false)}
        onExerciseSelect={handleExerciseSelected}
      />
    </Container>
  );
};

export default WorkoutFormPage;