import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  FitnessCenter as FitnessCenterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  DirectionsRun as DirectionsRunIcon,
  Flag as FlagIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTemplateById, 
  fetchCategories,
  selectSelectedTemplate,
  selectCategoryById,
  selectExerciseStatus,
  selectExerciseError,
  deleteTemplate
} from '../../store/slices/exercisesSlice';
import { AppDispatch } from '../../store';

const ExerciseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const template = useSelector(selectSelectedTemplate);
  const status = useSelector(selectExerciseStatus);
  const error = useSelector(selectExerciseError);
  
  const category = useSelector((state: any) => 
    template?.categoryId ? selectCategoryById(state, template.categoryId) : null
  );
  
  useEffect(() => {
    if (id) {
      dispatch(fetchTemplateById(id));
      dispatch(fetchCategories());
    }
  }, [id, dispatch]);
  
  const handleEdit = () => {
    if (id) {
      navigate(`/exercises/templates/${id}/edit`);
    }
  };
  
  const handleDelete = () => {
    if (id && window.confirm('האם אתה בטוח שברצונך למחוק תבנית תרגיל זו?')) {
      dispatch(deleteTemplate(id));
      navigate('/exercises');
    }
  };
  
  const handleBack = () => {
    navigate('/exercises');
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'קל':
        return 'success';
      case 'בינוני':
        return 'primary';
      case 'מתקדם':
        return 'error';
      default:
        return 'default';
    }
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
  
  if (!template) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          התרגיל המבוקש לא נמצא
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
          פרטי תרגיל
        </Typography>
      </Box>
      
      {/* Exercise card */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4
        }}
      >
        {/* Header section with image if available */}
        {template.imageUrl && (
          <Box 
            sx={{ 
              height: 200, 
              width: '100%', 
              backgroundImage: `url(${template.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          />
        )}
        
        <Box sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
                {template.name}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {template.description}
              </Typography>
            </Box>
            
            <Box>
              <Chip 
                label={template.difficultyLevel} 
                color={getDifficultyColor(template.difficultyLevel) as any}
                icon={<FlagIcon />}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>קטגוריה: </strong>{category?.name || 'לא מוגדר'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsRunIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>קבוצות שרירים: </strong>{template.targetMuscleGroups}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>ציוד נדרש: </strong>{template.equipmentNeeded}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {template.defaultSets && template.defaultReps && (
                  <Chip 
                    label={`${template.defaultSets} סטים × ${template.defaultReps} חזרות`}
                    variant="outlined"
                    color="primary"
                  />
                )}
                
                {template.defaultWeight && (
                  <Chip 
                    label={`${template.defaultWeight} ק"ג`}
                    variant="outlined"
                    color="primary"
                  />
                )}
                
                {template.defaultDuration && (
                  <Chip 
                    icon={<AccessTimeIcon />}
                    label={`${Math.floor(template.defaultDuration / 60)} דקות`}
                    variant="outlined"
                    color="primary"
                  />
                )}
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            הוראות ביצוע
          </Typography>
          
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {template.instructions || 'אין הוראות ביצוע מפורטות'}
          </Typography>
          
          {template.videoUrl && (
            <Box mt={3}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                סרטון הדרכה
              </Typography>
              <Box 
                component="iframe"
                sx={{ 
                  width: '100%',
                  height: 315,
                  border: 'none',
                  borderRadius: 2
                }}
                src={template.videoUrl}
                allowFullScreen
              />
            </Box>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Box display="flex" justifyContent="flex-end" gap={2}>
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
        </Box>
      </Paper>
    </Container>
  );
};

export default ExerciseDetailPage;