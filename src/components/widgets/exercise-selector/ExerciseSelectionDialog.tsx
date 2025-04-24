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
import { ExerciseSelectionDialogProps, Exercise, ExerciseTemplate } from '../../common/cards/workout-card/types';

// Mock exercise templates - in a real app, these would come from an API
const mockExerciseTemplates: ExerciseTemplate[] = [
  {
    id: '1',
    name: 'סקוואט',
    category: 'רגליים',
    muscleGroups: ['ירכיים', 'ישבן', 'מיתרי הברך'],
    defaultSets: 4,
    defaultReps: 12,
    defaultWeight: 60,
    instructions: 'שמור על גב ישר ויציבה נכונה',
    difficultyLevel: 'intermediate'
  },
  {
    id: '2',
    name: 'לחיצת חזה',
    category: 'חזה',
    muscleGroups: ['חזה', 'כתפיים', 'טרייספס'],
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 40,
    instructions: 'שמור על מרפקים מתחת לכתפיים',
    difficultyLevel: 'intermediate'
  },
  {
    id: '3',
    name: 'מתח',
    category: 'גב',
    muscleGroups: ['גב עליון', 'לאטס', 'בייספס'],
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 0,
    instructions: 'משוך את עצמך כלפי מעלה עד שהסנטר מגיע למוט',
    difficultyLevel: 'advanced'
  },
  {
    id: '4',
    name: 'דדליפט',
    category: 'רגליים',
    muscleGroups: ['גב תחתון', 'ישבן', 'מיתרי הברך'],
    defaultSets: 3,
    defaultReps: 8,
    defaultWeight: 80,
    instructions: 'שמור על גב ישר ותנועה מהירכיים',
    difficultyLevel: 'advanced'
  },
  {
    id: '5',
    name: 'לחיצת כתפיים',
    category: 'כתפיים',
    muscleGroups: ['כתפיים', 'טרייספס'],
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 25,
    instructions: 'הרם את המשקולות מעל הראש בתנועה איטית',
    difficultyLevel: 'intermediate'
  },
  {
    id: '6',
    name: 'מכרעים',
    category: 'רגליים',
    muscleGroups: ['ירכיים', 'ישבן'],
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 20,
    instructions: 'שמור על ברך קדמית מעל הקרסול',
    difficultyLevel: 'beginner'
  },
  {
    id: '7',
    name: 'כפיפות בטן',
    category: 'בטן',
    muscleGroups: ['בטן', 'שרירי הליבה'],
    defaultSets: 3,
    defaultReps: 20,
    defaultWeight: 0,
    instructions: 'התמקד בכיווץ שרירי הבטן',
    difficultyLevel: 'beginner'
  },
  {
    id: '8',
    name: 'פולאובר',
    category: 'גב',
    muscleGroups: ['לאטס', 'גב'],
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 20,
    instructions: 'משוך את המוט כלפי החזה בתנועה שולטת',
    difficultyLevel: 'intermediate'
  },
  {
    id: '9',
    name: 'כפיפות זרוע',
    category: 'זרועות',
    muscleGroups: ['בייספס'],
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 15,
    instructions: 'שמור על מרפקים צמודים לגוף',
    difficultyLevel: 'beginner'
  },
  {
    id: '10',
    name: 'פשיטות זרוע',
    category: 'זרועות',
    muscleGroups: ['טרייספס'],
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 15,
    instructions: 'החזק את המרפקים קרוב לראש',
    difficultyLevel: 'beginner'
  }
];

// All unique categories
const allCategories = Array.from(
  new Set(mockExerciseTemplates.map(template => template.category))
);

// All unique difficulty levels
const allDifficultyLevels = ['beginner', 'intermediate', 'advanced'] as const;
const difficultyLevelLabels: Record<string, string> = {
  beginner: 'מתחילים',
  intermediate: 'בינוני',
  advanced: 'מתקדם'
};

const ExerciseSelectionDialog: React.FC<ExerciseSelectionDialogProps> = ({
  open,
  onClose,
  onExerciseSelect
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Reset filters when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSelectedCategory('');
      setSelectedDifficulty('');
    }
  }, [open]);
  
  // Filter templates based on search and filters
  const filteredTemplates = mockExerciseTemplates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === '' || 
      template.category === selectedCategory;
      
    const matchesDifficulty = selectedDifficulty === '' || 
      template.difficultyLevel === selectedDifficulty;
      
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Handle exercise selection
  const handleSelectExercise = (template: ExerciseTemplate) => {
    // Create an exercise from the template
    const exercise: Exercise = {
      name: template.name,
      sets: template.defaultSets || 3,
      reps: template.defaultReps || 10,
      weight: template.defaultWeight || 0,
      notes: template.instructions,
      category: template.category,
      muscleGroups: template.muscleGroups,
      difficultyLevel: template.difficultyLevel
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
                {allCategories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
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
                    {difficultyLevelLabels[level]}
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
              {filteredTemplates.map(template => (
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
                          <Chip 
                            size="small" 
                            label={template.category} 
                            sx={{ mr: 0.5, mb: 0.5 }} 
                          />
                          <Chip 
                            size="small"
                            label={difficultyLevelLabels[template.difficultyLevel]}
                            color={
                              template.difficultyLevel === 'beginner' ? 'success' :
                              template.difficultyLevel === 'intermediate' ? 'info' : 'warning'
                            }
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
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
              ))}
              
              {filteredTemplates.length === 0 && (
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
              name: '',
              sets: 3,
              reps: 10,
              weight: 0
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