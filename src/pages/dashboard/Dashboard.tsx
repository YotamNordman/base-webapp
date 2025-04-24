import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider,
  Button,
  useTheme,
  alpha,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { WorkoutCard } from '../../components/common/cards/workout-card';
import { dashboardService, DashboardStat, DashboardWorkout, DashboardClient } from '../../services/dashboardService';

// Map icon names from API to actual icon components
const iconMap = {
  PeopleIcon: <PeopleIcon />,
  FitnessCenterIcon: <FitnessCenterIcon />,
  TrendingUpIcon: <TrendingUpIcon />,
  EventNoteIcon: <EventNoteIcon />,
  CheckCircleIcon: <CheckCircleIcon />
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [todaysWorkouts, setTodaysWorkouts] = useState<DashboardWorkout[]>([]);
  const [upcomingClients, setUpcomingClients] = useState<DashboardClient[]>([]);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await dashboardService.getDashboardData();
        
        setStats(data.stats);
        setTodaysWorkouts(data.todaysWorkouts);
        setUpcomingClients(data.upcomingClients);
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Format the current date in Hebrew
  const currentDate = new Date();
  const hebrewDateFormatter = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedDate = hebrewDateFormatter.format(currentDate);

  // Display loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Display error message
  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          נסה שוב
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
          שלום, מאמן כושר
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {formattedDate}
        </Typography>
      </Box>

      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const colorValue = stat.color === 'primary' 
            ? theme.palette.primary.main 
            : stat.color === 'info' 
              ? theme.palette.info.main 
              : stat.color === 'success' 
                ? theme.palette.success.main 
                : theme.palette.warning.main;
                
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  backgroundColor: alpha(colorValue, 0.04),
                  border: `1px solid ${alpha(colorValue, 0.1)}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(colorValue, 0.1), 
                      color: colorValue,
                      mr: 1.5
                    }}
                  >
                    {iconMap[stat.icon as keyof typeof iconMap]}
                  </Avatar>
                  <Typography color="text.secondary" variant="subtitle2">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Today's workouts and upcoming clients */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
              אימונים להיום
            </Typography>

            {todaysWorkouts.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center'
                }}
              >
                <Typography color="text.secondary">
                  אין אימונים מתוכננים להיום
                </Typography>
              </Paper>
            ) : (
              todaysWorkouts.map((workout) => (
                <Box sx={{ mb: 3 }} key={workout.id}>
                  <WorkoutCard
                    title={workout.title}
                    description={workout.description}
                    duration={workout.duration}
                    exercises={workout.exercises}
                    date={workout.date}
                    clientName={workout.clientName}
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                  />
                </Box>
              ))
            )}

            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => navigate('/workouts')}
              sx={{ 
                borderRadius: 2, 
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                mt: 1
              }}
            >
              צפה בכל האימונים
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
                מתאמנים ופגישות קרובות
              </Typography>

              {upcomingClients.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography color="text.secondary">
                    אין פגישות קרובות
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {upcomingClients.map((client, index) => (
                    <React.Fragment key={client.id}>
                      <ListItem
                        onClick={() => navigate(`/clients/${client.id}`)}
                        sx={{ 
                          px: 0,
                          borderRadius: 1.5,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                          cursor: 'pointer'
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar 
                            sx={{ 
                              width: 35, 
                              height: 35, 
                              bgcolor: client.progress > 80 
                                ? theme.palette.success.light 
                                : alpha(theme.palette.primary.main, 0.7) 
                            }}
                          >
                            {client.name.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={client.name}
                          secondary={`${client.time} - אימון אישי`}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <Box sx={{ minWidth: 100, mr: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                              {client.progress}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              התקדמות
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={client.progress} 
                            sx={{ 
                              height: 5, 
                              borderRadius: 2,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: client.progress > 80 
                                  ? theme.palette.success.main 
                                  : theme.palette.primary.main
                              }
                            }}
                          />
                        </Box>
                      </ListItem>
                      {index < upcomingClients.length - 1 && (
                        <Divider component="li" sx={{ my: 1.5 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}

              <Button 
                fullWidth
                variant="outlined" 
                color="primary" 
                onClick={() => navigate('/clients')}
                sx={{ 
                  borderRadius: 2, 
                  mt: 3,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                צפה בכל המתאמנים
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;