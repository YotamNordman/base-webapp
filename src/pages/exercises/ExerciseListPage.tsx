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
  Tabs,
  Tab,
  IconButton,
  Paper,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Refresh as RefreshIcon,
  FitnessCenter as FitnessCenterIcon
} from '@mui/icons-material';
import ExerciseCsvImport from '../../components/widgets/exercise-csv-import';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategories,
  fetchTemplates,
  selectAllCategories,
  selectFilteredTemplates, 
  selectExerciseStatus, 
  selectExerciseError, 
  setSearchQuery, 
  setCategoryFilter,
  setDifficultyFilter,
  selectExerciseFilters,
  deleteTemplate
} from '../../store/slices/exercisesSlice';
import ExerciseCard from '../../components/common/cards/exercise-card';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store';

// Difficulty level options
const difficultyOptions = [
  { value: '', label: 'כל הרמות' },
  { value: 'קל', label: 'קל' },
  { value: 'בינוני', label: 'בינוני' },
  { value: 'מתקדם', label: 'מתקדם' }
];

const ExerciseListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const categories = useSelector(selectAllCategories);
  const templates = useSelector(selectFilteredTemplates);
  const status = useSelector(selectExerciseStatus);
  const error = useSelector(selectExerciseError);
  const { searchQuery, categoryFilter, difficultyFilter } = useSelector(selectExerciseFilters);
  
  const [currentTab, setCurrentTab] = useState<number>(0);
  
  // Local debounced state for search query
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  useEffect(() => {
    // Load exercise data when the component mounts
    if (status === 'idle') {
      dispatch(fetchCategories());
      dispatch(fetchTemplates());
    }
  }, [status, dispatch]);
  
  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [localSearchQuery, dispatch]);
  
  const handleAddExercise = () => {
    navigate('/exercises/templates/new');
  };
  
  const handleAddCategory = () => {
    navigate('/exercises/categories/new');
  };
  
  const handleExerciseClick = (id: string) => {
    navigate(`/exercises/templates/${id}`);
  };
  
  const handleEditExercise = (id: string) => {
    navigate(`/exercises/templates/${id}/edit`);
  };
  
  const handleDeleteExercise = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תבנית תרגיל זו?')) {
      dispatch(deleteTemplate(id));
    }
  };
  
  const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setCategoryFilter(event.target.value));
  };
  
  const handleDifficultyFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setDifficultyFilter(event.target.value));
  };
  
  const handleCategoryClick = (id: string) => {
    dispatch(setCategoryFilter(id));
    setCurrentTab(0); // Switch to templates tab
  };
  
  const handleRefresh = () => {
    dispatch(fetchCategories());
    dispatch(fetchTemplates());
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <FitnessCenterIcon sx={{ mr: 2, fontSize: 32 }} />
          מאגר תרגילים
        </Typography>
        
        <Box display="flex" alignItems="center">
          <IconButton 
            onClick={handleRefresh} 
            sx={{ mr: 1 }}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
          
          <ExerciseCsvImport onImportComplete={handleRefresh} />
          
          <Button 
            variant="outlined"
            color="secondary"
            onClick={() => {
              // Call export API to sync with mobile backend
              fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api'}/exercises/export`)
                .then(response => {
                  if (response.ok) {
                    return response.json();
                  }
                  throw new Error('Failed to export exercises');
                })
                .then(data => {
                  setSnackbarMessage(data.message || 'יוצאו בהצלחה תבניות תרגילים לאפליקציה');
                  setSnackbarSeverity('success');
                  setSnackbarOpen(true);
                })
                .catch(error => {
                  console.error('Export error:', error);
                  setSnackbarMessage('שגיאה ביצוא התרגילים לאפליקציה');
                  setSnackbarSeverity('error');
                  setSnackbarOpen(true);
                });
            }}
            sx={{ mr: 1 }}
          >
            סנכרון לאפליקציה
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={currentTab === 0 ? handleAddExercise : handleAddCategory}
            sx={{ ml: 2 }}
          >
            {currentTab === 0 ? 'תרגיל חדש' : 'קטגוריה חדשה'}
          </Button>
        </Box>
      </Box>
      
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="תבניות תרגילים" />
        <Tab label="קטגוריות" />
      </Tabs>
      
      {currentTab === 0 && (
        <Box mb={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              סינון תרגילים
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="חיפוש לפי שם, תיאור או קבוצת שרירים"
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
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="category-filter-label">קטגוריה</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    id="category-filter"
                    value={categoryFilter}
                    label="קטגוריה"
                    onChange={handleCategoryFilterChange}
                  >
                    <MenuItem value="">כל הקטגוריות</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="difficulty-filter-label">רמת קושי</InputLabel>
                  <Select
                    labelId="difficulty-filter-label"
                    id="difficulty-filter"
                    value={difficultyFilter}
                    label="רמת קושי"
                    onChange={handleDifficultyFilterChange}
                  >
                    {difficultyOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      
      {status === 'loading' && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      
      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'טעינת התרגילים נכשלה'}
        </Alert>
      )}
      
      {currentTab === 0 && (
        <>
          {status === 'succeeded' && templates.length === 0 && (
            <Alert severity="info" sx={{ mb: 4 }}>
              לא נמצאו תבניות תרגילים. נסה לשנות את החיפוש או הסינון, או צור תבנית חדשה.
            </Alert>
          )}
          
          <Grid container spacing={3}>
            {templates.map(template => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <ExerciseCard 
                  template={template}
                  onClick={handleExerciseClick}
                  onEdit={handleEditExercise}
                  onDelete={handleDeleteExercise}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {currentTab === 1 && (
        <>
          {status === 'succeeded' && categories.length === 0 && (
            <Alert severity="info" sx={{ mb: 4 }}>
              לא נמצאו קטגוריות תרגילים. צור קטגוריה חדשה.
            </Alert>
          )}
          
          <Grid container spacing={3}>
            {categories.map(category => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                    {category.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {category.description}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Typography variant="body2" fontWeight="bold">
                    קבוצות שרירים:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.targetMuscleGroups}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default ExerciseListPage;