import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button,
  CircularProgress, 
  Alert,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import WorkoutCard from '../components/WorkoutCard';

// Mock data for clients
const CLIENTS = {
  '2': 'רונית כהן',
  '3': 'אלון לוי',
  '4': 'שירה דוד'
};

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

interface Workout {
  id: number;
  title: string;
  description?: string;
  coachId: string;
  clientId: string;
  createdAt: string;
  scheduledFor: string;
  completed: boolean;
  exercises: Exercise[];
}

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);

  // Fetch workouts on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from the API
        // const response = await axios.get('/api/workouts');
        // setWorkouts(response.data);
        
        // For now, we'll use mock data
        const mockWorkouts: Workout[] = [
          {
            id: 1,
            title: 'אימון כוח מלא',
            description: 'אימון כוח לכל הגוף עם דגש על קבוצות שרירים גדולות',
            coachId: '1',
            clientId: '2',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days in future
            completed: false,
            exercises: [
              { id: 1, name: 'סקוואט', sets: 4, reps: 10, weight: 100, notes: 'שמור על גב ישר' },
              { id: 2, name: 'לחיצת חזה', sets: 3, reps: 12, weight: 80, notes: 'נשימה נכונה' },
              { id: 3, name: 'מתח', sets: 3, reps: 8, weight: 0, notes: 'עד כאב' }
            ]
          },
          {
            id: 2,
            title: 'אימון קרדיו',
            description: 'אימון קרדיו לשריפת שומנים ושיפור סיבולת',
            coachId: '1',
            clientId: '3',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            scheduledFor: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day in future
            completed: false,
            exercises: [
              { id: 4, name: 'ריצה', sets: 1, reps: 1, weight: 0, notes: '20 דקות בקצב מתון' },
              { id: 5, name: 'קפיצות', sets: 3, reps: 20, weight: 0, notes: 'מנוחה של 30 שניות בין סטים' },
              { id: 6, name: 'פלנק', sets: 3, reps: 1, weight: 0, notes: '60 שניות כל סט' }
            ]
          },
          {
            id: 3,
            title: 'אימון גמישות',
            description: 'אימון גמישות ומתיחות לשיפור טווחי תנועה',
            coachId: '1',
            clientId: '4',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            scheduledFor: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (in past)
            completed: true,
            exercises: [
              { id: 7, name: 'מתיחת המסטרינג', sets: 3, reps: 1, weight: 0, notes: '30 שניות כל צד' },
              { id: 8, name: 'מתיחת כתפיים', sets: 3, reps: 1, weight: 0, notes: '20 שניות החזקה' },
              { id: 9, name: 'גשר', sets: 3, reps: 1, weight: 0, notes: '15 שניות החזקה' }
            ]
          }
        ];
        
        setWorkouts(mockWorkouts);
        setFilteredWorkouts(mockWorkouts);
      } catch (err) {
        // Log error and set error message
        setError('אירעה שגיאה בטעינת האימונים. נא לנסות שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...workouts];
    
    // Filter by tab (All, Upcoming, Completed)
    if (tabValue === 1) { // Upcoming
      filtered = filtered.filter(workout => new Date(workout.scheduledFor) > new Date() && !workout.completed);
    } else if (tabValue === 2) { // Completed
      filtered = filtered.filter(workout => workout.completed);
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(workout => 
        workout.title.toLowerCase().includes(searchLower) ||
        (workout.description && workout.description.toLowerCase().includes(searchLower)) ||
        CLIENTS[workout.clientId as keyof typeof CLIENTS].toLowerCase().includes(searchLower) ||
        workout.exercises.some(ex => ex.name.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredWorkouts(filtered);
  }, [workouts, searchTerm, tabValue]);

  const handleEditWorkout = (id: number) => {
    // Navigate to edit page
    // In a real app, this would navigate to an edit workout page
  };

  const handleDeleteWorkout = (id: number) => {
    // Handle workout deletion
    // In a real app, this would show a confirmation dialog and then delete
    const updatedWorkouts = workouts.filter(workout => workout.id !== id);
    setWorkouts(updatedWorkouts);
  };

  const handleCompleteWorkout = (id: number) => {
    // Handle workout completion
    // In a real app, this would call the API to update the workout status
    const updatedWorkouts = workouts.map(workout => 
      workout.id === id ? { ...workout, completed: true } : workout
    );
    setWorkouts(updatedWorkouts);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" align="right">
          אימונים
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => { /* Create new workout */ }}
        >
          אימון חדש
        </Button>
      </Box>
      
      {/* Search and Filter */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center" component="div">
          <Grid item xs={12} md={6} component="div">
            <TextField
              fullWidth
              placeholder="חיפוש אימונים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} component="div">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
            >
              <Tab label="הכל" />
              <Tab label="מתוכננים" />
              <Tab label="הושלמו" />
            </Tabs>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Workouts List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : filteredWorkouts.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            לא נמצאו אימונים
          </Typography>
          <Typography variant="body2" color="text.secondary">
            נסה לשנות את פרמטרי החיפוש או צור אימון חדש
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} component="div">
          {filteredWorkouts.map((workout) => (
            <Grid item xs={12} key={workout.id} component="div">
              <WorkoutCard
                id={workout.id}
                title={workout.title}
                description={workout.description}
                scheduledFor={workout.scheduledFor}
                completed={workout.completed}
                exercises={workout.exercises}
                clientName={CLIENTS[workout.clientId as keyof typeof CLIENTS] || 'לקוח לא ידוע'}
                onEdit={handleEditWorkout}
                onDelete={handleDeleteWorkout}
                onComplete={handleCompleteWorkout}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WorkoutsPage;
