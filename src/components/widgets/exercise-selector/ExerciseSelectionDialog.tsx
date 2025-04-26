import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  Box,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActionArea,
  InputAdornment,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  FitnessCenter as FitnessCenterIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { ExerciseSelectionDialogProps, Exercise } from '../../common/cards/workout-card/types';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCategories, 
  fetchTemplates, 
  selectAllCategories, 
  selectAllTemplates,
  selectExerciseStatus
} from '../../../store/slices/exercisesSlice';
import { ExerciseTemplate } from '../../../types/exercise';
import { AppDispatch } from '../../../store';

// Difficulty level labels mapping
const difficultyLevelLabels: Record<string, string> = {
  'קל': 'מתחילים',
  'בינוני': 'בינוני',
  'מתקדם': 'מתקדם'
};

const ExerciseSelectionDialog: React.FC<ExerciseSelectionDialogProps> = ({
  open,
  onClose,
  onExerciseSelect
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Get data from Redux store
  const categories = useSelector(selectAllCategories);
  const templates = useSelector(selectAllTemplates);
  const status = useSelector(selectExerciseStatus);
  
  // Fetch exercise data when dialog opens
  useEffect(() => {
    if (open && status === 'idle') {
      dispatch(fetchCategories());
      dispatch(fetchTemplates());
    }
  }, [open, status, dispatch]);
  
  // Reset filters when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSelectedCategory('');
      setSelectedDifficulty('');
    }
  }, [open]);
  
  // Get all unique difficulty levels from templates
  const allDifficultyLevels = Array.from(
    new Set(templates.map(template => template.difficultyLevel))
  ).filter(level => level); // Filter out undefined/null values
  
  // Filter templates based on search and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === '' || 
      template.categoryId === selectedCategory;
      
    const matchesDifficulty = selectedDifficulty === '' || 
      template.difficultyLevel === selectedDifficulty;
      
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Handle exercise selection
  const handleSelectExercise = (template: ExerciseTemplate) => {
    // Get the category for this template
    const category = categories.find(cat => cat.id === template.categoryId);
    
    // Create an exercise from the template
    const exercise: Exercise = {
      id: template.id,
      name: template.name,
      sets: template.defaultSets || 3,
      reps: template.defaultReps || 10,
      weight: template.defaultWeight || 0,
      notes: template.instructions,
      category: category?.name || '',
      muscleGroups: [template.targetMuscleGroups],
      difficultyLevel: template.difficultyLevel as 'beginner' | 'intermediate' | 'advanced',
      videoUrl: template.videoUrl
    };
    
    // Simulate loading for better UX
    setLoading(true);
    setTimeout(() => {
      onExerciseSelect(exercise);
      setLoading(false);
      onClose();
    }, 300);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3,
        py: 2
      }}>
        <Typography variant="h6" fontWeight="bold">
          בחירת תרגיל
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, py: 2 }}>
        {status === 'loading' ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Search and filters */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder="חיפוש תרגילים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  value={selectedCategory}
                  label="קטגוריה"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">הכל</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>רמת קושי</InputLabel>
                <Select
                  value={selectedDifficulty}
                  label="רמת קושי"
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <MenuItem value="">הכל</MenuItem>
                  {allDifficultyLevels.map(level => (
                    <MenuItem key={level} value={level}>
                      {difficultyLevelLabels[level] || level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                נמצאו {filteredTemplates.length} תרגילים
              </Typography>
            </Grid>
            
            {/* Exercise templates grid */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {filteredTemplates.map(template => {
                  // Get category for this template
                  const category = categories.find(cat => cat.id === template.categoryId);
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={template.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <CardActionArea 
                          onClick={() => handleSelectExercise(template)}
                          sx={{ 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                          }}
                        >
                          <CardContent sx={{ width: '100%', p: 2 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 1.5 
                            }}>
                              <FitnessCenterIcon 
                                color="primary" 
                                fontSize="small" 
                                sx={{ mr: 1 }} 
                              />
                              <Typography variant="subtitle1" fontWeight="medium">
                                {template.name}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 1.5 }}>
                              {category && (
                                <Chip 
                                  size="small" 
                                  label={category.name} 
                                  sx={{ mr: 0.5, mb: 0.5 }} 
                                />
                              )}
                              {template.difficultyLevel && (
                                <Chip 
                                  size="small"
                                  label={difficultyLevelLabels[template.difficultyLevel] || template.difficultyLevel}
                                  color={
                                    template.difficultyLevel === 'קל' ? 'success' :
                                    template.difficultyLevel === 'בינוני' ? 'info' : 'warning'
                                  }
                                  variant="outlined"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              )}
                              {template.videoUrl && (
                                <Chip
                                  size="small"
                                  label="יש סרטון"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              )}
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                              {template.defaultSets || 3} סטים × {template.defaultReps || 10} חזרות
                              {template.defaultWeight ? ` • ${template.defaultWeight} ק"ג` : ''}
                            </Typography>
                            
                            {template.instructions && (
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {template.instructions}
                              </Typography>
                            )}
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
                
                {filteredTemplates.length === 0 && status === 'succeeded' && (
                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        py: 4, 
                        textAlign: 'center',
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        borderRadius: 2
                      }}
                    >
                      <Typography color="text.secondary">
                        לא נמצאו תרגילים התואמים את החיפוש
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        bgcolor: alpha(theme.palette.background.default, 0.5)
      }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={loading}
        >
          ביטול
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={() => {
            // Create an empty custom exercise
            const customExercise: Exercise = {
              id: `custom-${Date.now()}`,
              name: '',
              sets: 3,
              reps: 10,
              weight: 0,
              muscleGroups: [],
              category: ''
            };
            onExerciseSelect(customExercise);
            onClose();
          }}
          disabled={loading}
        >
          תרגיל מותאם אישית
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExerciseSelectionDialog;