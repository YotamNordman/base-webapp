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
  Divider,
  Alert,
  CircularProgress,
  SelectChangeEvent,
  Snackbar
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  FitnessCenter as FitnessCenterIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTemplateById, 
  fetchCategories,
  createTemplate,
  updateTemplate,
  selectAllCategories,
  selectSelectedTemplate,
  selectExerciseStatus,
  selectExerciseError,
  clearSelectedTemplate
} from '../../store/slices/exercisesSlice';
import { ExerciseTemplate } from '../../types/exercise';
import { AppDispatch } from '../../store';

// Difficulty level options
const difficultyOptions = [
  { value: 'קל', label: 'קל' },
  { value: 'בינוני', label: 'בינוני' },
  { value: 'מתקדם', label: 'מתקדם' }
];

const ExerciseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const categories = useSelector(selectAllCategories);
  const existingTemplate = useSelector(selectSelectedTemplate);
  const status = useSelector(selectExerciseStatus);
  const error = useSelector(selectExerciseError);
  
  // Default empty template
  const emptyTemplate: Omit<ExerciseTemplate, 'id'> = {
    name: '',
    description: '',
    categoryId: '',
    targetMuscleGroups: '',
    instructions: '',
    difficultyLevel: 'בינוני',
    equipmentNeeded: '',
    imageUrl: '',
    videoUrl: '',
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: undefined,
    defaultWeight: undefined
  };
  
  // Form state
  const [formData, setFormData] = useState<Omit<ExerciseTemplate, 'id'>>(emptyTemplate);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Load categories when component mounts
  useEffect(() => {
    dispatch(fetchCategories());
    
    if (isEditMode && id) {
      dispatch(fetchTemplateById(id));
    } else {
      dispatch(clearSelectedTemplate());
    }
    
    return () => {
      dispatch(clearSelectedTemplate());
    };
  }, [isEditMode, id, dispatch]);
  
  // Populate form with existing template data
  useEffect(() => {
    if (isEditMode && existingTemplate) {
      setFormData({
        name: existingTemplate.name,
        description: existingTemplate.description,
        categoryId: existingTemplate.categoryId || '',
        targetMuscleGroups: existingTemplate.targetMuscleGroups,
        instructions: existingTemplate.instructions,
        difficultyLevel: existingTemplate.difficultyLevel,
        equipmentNeeded: existingTemplate.equipmentNeeded,
        imageUrl: existingTemplate.imageUrl || '',
        videoUrl: existingTemplate.videoUrl || '',
        defaultSets: existingTemplate.defaultSets,
        defaultReps: existingTemplate.defaultReps,
        defaultDuration: existingTemplate.defaultDuration,
        defaultWeight: existingTemplate.defaultWeight
      });
    }
  }, [isEditMode, existingTemplate]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => ({
      ...prev,
      [name]: numValue
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
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode && id) {
        await dispatch(updateTemplate({ 
          ...formData, 
          id
        })).unwrap();
        setSnackbarMessage('התרגיל עודכן בהצלחה');
      } else {
        await dispatch(createTemplate(formData)).unwrap();
        setSnackbarMessage('התרגיל נוצר בהצלחה');
      }
      
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/exercises');
      }, 1500);
    } catch (err) {
      console.error('Failed to save exercise:', err);
      setSnackbarMessage('אירעה שגיאה בשמירת התרגיל');
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
          {error || 'טעינת התרגיל נכשלה'}
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
          <FitnessCenterIcon sx={{ mr: 2 }} />
          {isEditMode ? 'עריכת תרגיל' : 'תרגיל חדש'}
        </Typography>
      </Box>
      
      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        elevation={2} 
        sx={{ p: 3, borderRadius: 2 }}
      >
        <Grid container spacing={3}>
          {/* Basic info section */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              פרטי תרגיל בסיסיים
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="שם התרגיל"
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
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="category-label">קטגוריה</InputLabel>
              <Select
                labelId="category-label"
                name="categoryId"
                value={formData.categoryId}
                label="קטגוריה"
                onChange={handleSelectChange}
              >
                <MenuItem value="">
                  <em>בחר קטגוריה</em>
                </MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="difficulty-label">רמת קושי</InputLabel>
              <Select
                labelId="difficulty-label"
                name="difficultyLevel"
                value={formData.difficultyLevel}
                label="רמת קושי"
                onChange={handleSelectChange}
              >
                {difficultyOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="קבוצות שרירים"
              name="targetMuscleGroups"
              value={formData.targetMuscleGroups}
              onChange={handleChange}
              placeholder="לדוגמא: חזה, טריצפס, כתפיים"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="ציוד נדרש"
              name="equipmentNeeded"
              value={formData.equipmentNeeded}
              onChange={handleChange}
              placeholder="לדוגמא: מוט משקולות, משקולות יד, מזרן"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              הוראות ביצוע
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="הוראות ביצוע מפורטות"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              multiline
              rows={5}
              placeholder="הסבר מפורט כיצד לבצע את התרגיל, כולל הנחיות לביצוע נכון ובטוח"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ערכי ברירת מחדל
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="מספר סטים"
              name="defaultSets"
              value={formData.defaultSets === undefined ? '' : formData.defaultSets}
              onChange={handleNumberChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="מספר חזרות"
              name="defaultReps"
              value={formData.defaultReps === undefined ? '' : formData.defaultReps}
              onChange={handleNumberChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label='משקל (ק"ג)'
              name="defaultWeight"
              value={formData.defaultWeight === undefined ? '' : formData.defaultWeight}
              onChange={handleNumberChange}
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="משך זמן (שניות)"
              name="defaultDuration"
              value={formData.defaultDuration === undefined ? '' : formData.defaultDuration}
              onChange={handleNumberChange}
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              מדיה
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="קישור לתמונה"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="URL של תמונה המציגה את התרגיל"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="קישור לסרטון"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="URL של סרטון הדרכה (למשל מיוטיוב)"
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
                {isEditMode ? 'עדכן תרגיל' : 'צור תרגיל'}
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

export default ExerciseFormPage;