import React, { useEffect, useState } from 'react';
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
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  FlagOutlined as FlagIcon,
  Add as AddIcon,
  AssignmentOutlined as AssignIcon,
  AutoAwesome as MethodologyIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchBlockById, 
  selectSelectedBlock, 
  selectBlockStatus, 
  selectBlockError, 
  deleteBlock 
} from '../../store/slices/trainingBlocksSlice';
import { 
  fetchMethodologyById,
  selectCurrentMethodology
} from '../../store/slices/methodologiesSlice';
import TrainingWeekCard from '../../components/common/cards/training-week-card';
import { MethodologyDetails } from '../../components/widgets';
import { TrainingWeek } from '../../types/trainingBlock';
import { AppDispatch } from '../../store';

const TrainingBlockDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const block = useSelector(selectSelectedBlock);
  const status = useSelector(selectBlockStatus);
  const error = useSelector(selectBlockError);
  const methodology = useSelector(selectCurrentMethodology);
  
  // Track expanded weeks
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (id) {
      dispatch(fetchBlockById(id));
    }
  }, [id, dispatch]);
  
  // Fetch methodology when block is loaded
  useEffect(() => {
    if (block?.methodologyId) {
      dispatch(fetchMethodologyById(block.methodologyId));
    }
  }, [block, dispatch]);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleToggleWeekExpand = (weekId: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };
  
  const handleEditBlock = () => {
    if (id) {
      navigate(`/training/blocks/${id}/edit`);
    }
  };
  
  const handleDeleteBlock = () => {
    if (id && window.confirm('האם אתה בטוח שברצונך למחוק תוכנית אימון זו?')) {
      dispatch(deleteBlock(id));
      navigate('/training/blocks');
    }
  };
  
  const handleAssignBlock = () => {
    if (id) {
      navigate(`/training/blocks/${id}/assign`);
    }
  };
  
  const handleBack = () => {
    navigate('/training/blocks');
  };
  
  const handleAddWeek = () => {
    if (id) {
      navigate(`/training/blocks/${id}/weeks/new`);
    }
  };
  
  const handleEditWeek = (weekId: string) => {
    if (id) {
      navigate(`/training/blocks/${id}/weeks/${weekId}/edit`);
    }
  };
  
  const handleDeleteWeek = (weekId: string) => {
    // This would be implemented with a proper API call in a real app
    alert(`Deleting week ${weekId}. This would be implemented with a proper API call in a real app.`);
  };
  
  const handleAddWorkout = (weekId: string) => {
    if (id) {
      navigate(`/training/blocks/${id}/weeks/${weekId}/workouts/new`);
    }
  };
  
  const handleEditWorkout = (workoutId: string) => {
    navigate(`/workouts/${workoutId}/edit`);
  };
  
  const handleDeleteWorkout = (workoutId: string) => {
    // This would be implemented with a proper API call in a real app
    alert(`Deleting workout ${workoutId}. This would be implemented with a proper API call in a real app.`);
  };
  
  const handleViewWorkout = (workoutId: string) => {
    navigate(`/workouts/${workoutId}`);
  };
  
  if (status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (status === 'failed') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'טעינת תוכנית האימון נכשלה'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          variant="outlined"
        >
          חזרה לתוכניות אימון
        </Button>
      </Container>
    );
  }
  
  if (!block) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          תוכנית האימון המבוקשת לא נמצאה
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          variant="outlined"
        >
          חזרה לתוכניות אימון
        </Button>
      </Container>
    );
  }
  
  // Order weeks by weekNumber
  const orderedWeeks = [...block.weeks].sort((a, b) => a.weekNumber - b.weekNumber);
  
  // Calculate total workouts
  const totalWorkouts = block.weeks.reduce((total, week) => total + week.workouts.length, 0);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton 
          onClick={handleBack} 
          sx={{ mr: 2, bgcolor: 'background.default' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarIcon sx={{ mr: 2 }} />
          פרטי תוכנית אימון
        </Typography>
      </Box>
      
      {/* Basic info card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {block.title}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {block.description}
            </Typography>
          </Box>
          
          <Box display="flex" gap={1}>
            {block.methodologyId && (
              <Chip 
                icon={<MethodologyIcon />}
                label="Methodology Applied" 
                color="secondary"
              />
            )}
            <Chip 
              label={block.isTemplate ? "תבנית" : "מוקצה"} 
              color={block.isTemplate ? "primary" : "success"}
            />
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>תאריך התחלה:</strong> {formatDate(block.startDate)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>תאריך סיום:</strong> {formatDate(block.endDate)}
              </Typography>
            </Box>
            
            {block.clientName && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>מתאמן:</strong> {block.clientName}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {block.goal && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FlagIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <strong>מטרה:</strong> {block.goal}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>מספר שבועות:</strong> {block.weeks.length}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>סה"כ אימונים:</strong> {totalWorkouts}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {block.notes && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              הערות
            </Typography>
            
            <Typography variant="body1">
              {block.notes}
            </Typography>
          </>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Box display="flex" justifyContent="flex-end" gap={2}>
          {block.isTemplate && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AssignIcon />}
              onClick={handleAssignBlock}
            >
              שייך למתאמן
            </Button>
          )}
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditBlock}
          >
            ערוך תוכנית
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteBlock}
          >
            מחק תוכנית
          </Button>
        </Box>
      </Paper>

      {/* Methodology Section */}
      {methodology && (
        <MethodologyDetails 
          methodology={methodology}
          selectedBlockType={methodology.blockTypes.find(bt => bt.id === block.blockTypeId)}
          selectedWorkoutType={methodology.workoutTypes.find(wt => wt.id === block.workoutTypeId)}
        />
      )}
      
      {/* Weeks section */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            שבועות אימון
          </Typography>
          
          <Button 
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddWeek}
          >
            הוסף שבוע
          </Button>
        </Box>
        
        {orderedWeeks.length === 0 ? (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                אין שבועות אימון בתוכנית זו
              </Typography>
              <Button 
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddWeek}
                sx={{ mt: 2 }}
              >
                הוסף שבוע אימון
              </Button>
            </CardContent>
          </Card>
        ) : (
          orderedWeeks.map(week => (
            <TrainingWeekCard
              key={week.id}
              week={week}
              expanded={!!expandedWeeks[week.id]}
              onToggleExpand={() => handleToggleWeekExpand(week.id)}
              onEditWeek={handleEditWeek}
              onDeleteWeek={handleDeleteWeek}
              onAddWorkout={handleAddWorkout}
              onEditWorkout={handleEditWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              onViewWorkout={handleViewWorkout}
            />
          ))
        )}
      </Box>
    </Container>
  );
};

export default TrainingBlockDetailPage;