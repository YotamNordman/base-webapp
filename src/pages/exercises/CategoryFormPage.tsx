import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  IconButton, 
  Divider,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategoryById, 
  createCategory,
  updateCategory,
  selectSelectedCategory,
  selectExerciseStatus,
  selectExerciseError,
  clearSelectedCategory
} from '../../store/slices/exercisesSlice';
import { ExerciseCategory } from '../../types/exercise';
import { AppDispatch } from '../../store';

const CategoryFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const existingCategory = useSelector(selectSelectedCategory);
  const status = useSelector(selectExerciseStatus);
  const error = useSelector(selectExerciseError);
  
  // Default empty category
  const emptyCategory: Omit<ExerciseCategory, 'id'> = {
    name: '',
    description: '',
    targetMuscleGroups: ''
  };
  
  // Form state
  const [formData, setFormData] = useState<Omit<ExerciseCategory, 'id'>>(emptyCategory);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Load category data when in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchCategoryById(id));
    } else {
      dispatch(clearSelectedCategory());
    }
    
    return () => {
      dispatch(clearSelectedCategory());
    };
  }, [isEditMode, id, dispatch]);
  
  // Populate form with existing category data
  useEffect(() => {
    if (isEditMode && existingCategory) {
      setFormData({
        name: existingCategory.name,
        description: existingCategory.description,
        targetMuscleGroups: existingCategory.targetMuscleGroups
      });
    }
  }, [isEditMode, existingCategory]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode && id) {
        await dispatch(updateCategory({ 
          ...formData, 
          id
        })).unwrap();
        setSnackbarMessage('הקטגוריה עודכנה בהצלחה');
      } else {
        await dispatch(createCategory(formData)).unwrap();
        setSnackbarMessage('הקטגוריה נוצרה בהצלחה');
      }
      
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/exercises');
      }, 1500);
    } catch (err) {
      console.error('Failed to save category:', err);
      setSnackbarMessage('אירעה שגיאה בשמירת הקטגוריה');
      setSnackbarOpen(true);
    }
  };
  
  const handleBack = () => {
    navigate('/exercises');
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
          {error || 'טעינת הקטגוריה נכשלה'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          variant="outlined"
        >
          חזרה למאגר התרגילים
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
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 2 }} />
          {isEditMode ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}
        </Typography>
      </Box>
      
      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        elevation={2} 
        sx={{ p: 3, borderRadius: 2 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              פרטי קטגוריה
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="שם הקטגוריה"
              name="name"
              value={formData.name}
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
              placeholder="תיאור קצר של הקטגוריה וסוגי התרגילים שהיא כוללת"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="קבוצות שרירים עיקריות"
              name="targetMuscleGroups"
              value={formData.targetMuscleGroups}
              onChange={handleChange}
              placeholder="לדוגמא: חזה, טריצפס, כתפיים"
            />
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
                {isEditMode ? 'עדכן קטגוריה' : 'צור קטגוריה'}
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

export default CategoryFormPage;