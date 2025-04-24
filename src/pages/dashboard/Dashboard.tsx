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
  CircularProgress,
  Chip,
  IconButton,
  Stack,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PendingIcon from '@mui/icons-material/Pending';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { WorkoutCard } from '../../components/common/cards/workout-card';
import { dashboardService, DashboardStat, DashboardWorkout, DashboardClient } from '../../services/dashboardService';

// Map icon names from API to actual icon components
const iconMap = {
  PeopleIcon: <PeopleIcon />,
  FitnessCenterIcon: <FitnessCenterIcon />,
  TrendingUpIcon: <TrendingUpIcon />,
  EventNoteIcon: <EventNoteIcon />,
  CheckCircleIcon: <CheckCircleIcon />,
  AssignmentIcon: <AssignmentIcon />,
  DirectionsRunIcon: <DirectionsRunIcon />,
  CalendarTodayIcon: <CalendarTodayIcon />,
  AccessTimeIcon: <AccessTimeIcon />,
  ArrowForwardIcon: <ArrowForwardIcon />,
  PersonIcon: <PersonIcon />,
  MoreVertIcon: <MoreVertIcon />,
  PendingIcon: <PendingIcon />,
  WhatshotIcon: <WhatshotIcon />
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
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
    <Box sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 }, maxWidth: '1600px', mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          mb: 5,
          overflow: 'hidden',
          position: 'relative',
          backgroundImage: `linear-gradient(to left, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.9)})`,
          boxShadow: '0 10px 30px -5px rgba(58, 110, 165, 0.15)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 10px, transparent 10px, transparent 20px)',
          }}
        />
        <Box sx={{ p: { xs: 4, md: 5 }, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: 'white', mb: 1, fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' } }}>
                  שלום, מאמן כושר
                </Typography>
                <Typography variant="subtitle1" sx={{ color: alpha('#fff', 0.9), mb: 3, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}>
                  {formattedDate}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<CalendarTodayIcon />}
                    onClick={() => navigate('/calendar')}
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      color: 'white',
                      '&:hover': { bgcolor: alpha('#fff', 0.3) },
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontWeight: 500,
                      px: 3,
                      py: 1.2,
                    }}
                  >
                    צפה ביומן
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<FitnessCenterIcon />}
                    onClick={() => navigate('/workouts/new')}
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      color: 'white',
                      '&:hover': { bgcolor: alpha('#fff', 0.3) },
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontWeight: 500,
                      px: 3,
                      py: 1.2,
                    }}
                  >
                    צור אימון חדש
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  gap: 3,
                  mt: { xs: 3, md: 0 },
                }}
              >
                <Box
                  sx={{
                    borderRadius: 3,
                    bgcolor: alpha('#fff', 0.15),
                    p: { xs: 2.5, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: { xs: 120, md: 150 },
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <WhatshotIcon sx={{ fontSize: { xs: 32, md: 36 }, color: theme.palette.warning.light, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '1.75rem', md: '2rem' } }}>
                    {todaysWorkouts.length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), fontSize: { xs: '0.8rem', md: '0.9rem' }, mt: 0.5 }}>
                    אימונים להיום
                  </Typography>
                </Box>
                <Box
                  sx={{
                    borderRadius: 3,
                    bgcolor: alpha('#fff', 0.15),
                    p: { xs: 2.5, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: { xs: 120, md: 150 },
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <PeopleIcon sx={{ fontSize: { xs: 32, md: 36 }, color: theme.palette.info.light, mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '1.75rem', md: '2rem' } }}>
                    {upcomingClients.length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: alpha('#fff', 0.8), fontSize: { xs: '0.8rem', md: '0.9rem' }, mt: 0.5 }}>
                    מתאמנים היום
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Stats cards */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            mb: 4, 
            display: 'flex', 
            alignItems: 'center',
            px: 1,
            fontSize: { xs: '1.25rem', md: '1.5rem' }
          }}
        >
          <AssignmentIcon sx={{ ml: 1.5, color: 'primary.main', fontSize: { xs: '1.5rem', md: '1.75rem' } }} />
          סטטיסטיקות כלליות
        </Typography>
        <Grid container spacing={4}>
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
                    p: 3.5, 
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    border: `1px solid ${alpha(colorValue, 0.2)}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.04)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 35px -10px rgba(0,0,0,0.1)',
                      borderColor: alpha(colorValue, 0.5),
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: 8, 
                      height: '100%',
                      bgcolor: colorValue,
                      borderTopLeftRadius: 3,
                      borderBottomLeftRadius: 3,
                    }} 
                  />
                  <Box sx={{ mb: 3, pl: 1 }}>
                    <Typography 
                      color="text.secondary" 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'nowrap',
                        fontWeight: 500,
                        pr: 1
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.title}</span>
                      <Tooltip title="פרטים נוספים">
                        <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    <Typography 
                      variant="h2" 
                      component="div" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1.5,
                        color: colorValue,
                        fontSize: { xs: '2.25rem', md: '3rem' },
                        lineHeight: 1.1,
                        textAlign: 'right',
                        direction: 'ltr'
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mt: 'auto',
                      pt: 2,
                      borderTop: `1px dashed ${alpha(theme.palette.divider, 0.6)}`,
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 40,
                        height: 40,
                        bgcolor: alpha(colorValue, 0.15), 
                        color: colorValue,
                      }}
                    >
                      {iconMap[stat.icon as keyof typeof iconMap]}
                    </Avatar>
                    <Chip 
                      label={index % 2 === 0 ? "↑ 4%" : "↓ 2%"} 
                      size="small" 
                      color={index % 2 === 0 ? "success" : "error"}
                      sx={{ height: 28, fontSize: '0.8rem', fontWeight: 600, px: 1 }}
                    />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Today's workouts and upcoming clients */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={0}
            sx={{ 
              mb: { xs: 3, md: 0 }, 
              p: 0,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              height: '100%',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 20px rgba(0,0,0,0.03)',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: alpha(theme.palette.primary.main, 0.06),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                p: { xs: 2.5, md: 3 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WhatshotIcon sx={{ color: theme.palette.warning.main, ml: 1.5, fontSize: { xs: '1.4rem', md: '1.6rem' } }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                  אימונים להיום
                </Typography>
              </Box>
              <Box>
                <Chip 
                  label={`${todaysWorkouts.length} אימונים`} 
                  size="small" 
                  color="primary"
                  sx={{ 
                    borderRadius: 2,
                    fontWeight: 600,
                    height: { xs: 26, md: 28 },
                    fontSize: { xs: '0.7rem', md: '0.8rem' }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ maxHeight: 450, overflow: 'auto', p: 2 }}>
              {todaysWorkouts.length === 0 ? (
                <Box 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200
                  }}
                >
                  <DirectionsRunIcon sx={{ fontSize: 48, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
                  <Typography color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    אין אימונים מתוכננים להיום
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    לחץ על הכפתור למטה כדי להוסיף אימון חדש
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                    startIcon={<FitnessCenterIcon />}
                    onClick={() => navigate('/workouts/new')}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    צור אימון חדש
                  </Button>
                </Box>
              ) : (
                <Box>
                  {todaysWorkouts.map((workout, index) => (
                    <Card
                      key={workout.id}
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: 'none',
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-3px)',
                          boxShadow: `0 6px 15px -3px ${alpha(theme.palette.primary.main, 0.1)}`
                        },
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onClick={() => navigate(`/workouts/${workout.id}`)}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          right: 0, 
                          top: 0, 
                          width: 5,
                          height: '100%', 
                          bgcolor: theme.palette.warning.main 
                        }} 
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {workout.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon 
                              fontSize="small" 
                              sx={{ 
                                ml: 0.5, 
                                color: theme.palette.text.secondary, 
                                fontSize: '0.9rem' 
                              }} 
                            />
                            <Typography variant="caption" color="text.secondary">
                              {workout.duration} דקות
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <PersonIcon 
                            fontSize="small" 
                            sx={{ mr: 0.5, color: theme.palette.text.secondary, fontSize: '0.9rem' }} 
                          />
                          <Typography variant="body2" color="text.secondary">
                            {workout.clientName}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FitnessCenterIcon 
                              fontSize="small" 
                              sx={{ mr: 0.5, color: theme.palette.primary.main }} 
                            />
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                              {workout.exercises.length} תרגילים
                            </Typography>
                          </Box>
                          <Chip 
                            label="פעיל" 
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ height: 22, fontSize: '0.7rem' }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
            
            <Box 
              sx={{ 
                p: 2.5, 
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                display: 'flex',
                justifyContent: 'space-between',
                background: alpha(theme.palette.background.default, 0.7)
              }}
            >
              <Button
                size="medium"
                startIcon={<FitnessCenterIcon />}
                onClick={() => navigate('/workouts/new')}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 2.5,
                  py: 0.8
                }}
              >
                צור אימון חדש
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                size="medium"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/workouts')}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 2.5,
                  py: 0.8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                צפה בכל האימונים
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 0,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              height: '100%',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 20px rgba(0,0,0,0.03)',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                borderColor: alpha(theme.palette.info.main, 0.3),
              },
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: alpha(theme.palette.info.main, 0.04),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                p: { xs: 2, md: 3 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ color: theme.palette.info.main, ml: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', md: '1.1rem' } }}>
                  מתאמנים ופגישות
                </Typography>
              </Box>
              <Box>
                <Chip 
                  label={`${upcomingClients.length} אנשים`} 
                  size="small" 
                  color="info"
                  sx={{ 
                    borderRadius: 1,
                    fontWeight: 500,
                    height: { xs: 22, md: 24 },
                    fontSize: { xs: '0.65rem', md: '0.75rem' }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ maxHeight: 450, overflow: 'auto', p: { xs: 2.5, md: 3 } }}>
              {upcomingClients.length === 0 ? (
                <Box 
                  sx={{ 
                    p: 5, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 220
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 56, color: alpha(theme.palette.text.secondary, 0.25), mb: 3 }} />
                  <Typography color="text.secondary" sx={{ mb: 1.5, fontWeight: 600, fontSize: '1.1rem' }}>
                    אין פגישות קרובות להיום
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                    לחץ על הכפתור למטה כדי להוסיף מתאמן חדש
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="info" 
                    size="medium"
                    startIcon={<PersonIcon />}
                    onClick={() => navigate('/clients/new')}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1
                    }}
                  >
                    הוסף מתאמן חדש
                  </Button>
                </Box>
              ) : (
                <List sx={{ py: 1 }}>
                  {upcomingClients.map((client, index) => (
                    <React.Fragment key={client.id}>
                      <ListItem
                        onClick={() => navigate(`/clients/${client.id}`)}
                        sx={{ 
                          px: 2,
                          py: 1.5,
                          borderRadius: 2.5,
                          mb: 2,
                          border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                          cursor: 'pointer'
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 48 }}>
                          <Avatar 
                            sx={{ 
                              width: 48, 
                              height: 48, 
                              bgcolor: client.progress > 80 
                                ? alpha(theme.palette.success.main, 0.8) 
                                : client.progress > 50
                                  ? alpha(theme.palette.info.main, 0.8)
                                  : alpha(theme.palette.warning.main, 0.8),
                              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                              border: '2px solid white',
                              fontSize: '1.1rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {client.name.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                                {client.name}
                              </Typography>
                              {client.progress > 80 && (
                                <Tooltip title="מתקדם מצוין">
                                  <CheckCircleIcon 
                                    sx={{ 
                                      color: theme.palette.success.main, 
                                      ml: 1.5, 
                                      fontSize: 18 
                                    }} 
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', color: theme.palette.text.secondary }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {client.time} - אימון אישי
                              </Typography>
                            </Box>
                          }
                          primaryTypographyProps={{ fontWeight: 700 }}
                          secondaryTypographyProps={{ component: 'div' }}
                          sx={{ my: 0.5 }}
                        />
                        <Box sx={{ minWidth: 100, mr: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8, justifyContent: 'flex-end', width: '100%' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 700, 
                                color: client.progress > 80 
                                  ? theme.palette.success.main 
                                  : client.progress > 50
                                    ? theme.palette.info.main
                                    : theme.palette.warning.main,
                                fontSize: '0.9rem'
                              }}
                            >
                              {client.progress}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.7, fontWeight: 600 }}>
                              התקדמות
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={client.progress} 
                            sx={{ 
                              width: '100%',
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: alpha(theme.palette.divider, 0.2),
                              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: client.progress > 80 
                                  ? theme.palette.success.main 
                                  : client.progress > 50
                                    ? theme.palette.info.main
                                    : theme.palette.warning.main,
                                borderRadius: 4,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }
                            }}
                          />
                        </Box>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
            
            <Box 
              sx={{ 
                p: 2.5, 
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                display: 'flex',
                justifyContent: 'space-between',
                background: alpha(theme.palette.background.default, 0.7)
              }}
            >
              <Button
                size="medium"
                startIcon={<PersonIcon />}
                onClick={() => navigate('/clients/new')}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 2.5,
                  py: 0.8
                }}
              >
                הוסף מתאמן חדש
              </Button>
              <Button 
                variant="outlined" 
                color="info" 
                size="medium"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/clients')}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 2.5,
                  py: 0.8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                צפה בכל המתאמנים
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;