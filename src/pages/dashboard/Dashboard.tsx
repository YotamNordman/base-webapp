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
    <Box sx={{ py: 3 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
          position: 'relative',
          backgroundImage: `linear-gradient(to left, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.9)})`,
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
        <Box sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                שלום, מאמן כושר
              </Typography>
              <Typography variant="subtitle1" sx={{ color: alpha('#fff', 0.8), mb: 2 }}>
                {formattedDate}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2, display: { xs: 'none', md: 'flex' } }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<CalendarTodayIcon />}
                  onClick={() => navigate('/calendar')}
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    '&:hover': { bgcolor: alpha('#fff', 0.3) },
                    borderRadius: 2,
                    boxShadow: 'none',
                    fontWeight: 500,
                  }}
                >
                  צפה ביומן
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<FitnessCenterIcon />}
                  onClick={() => navigate('/workouts/new')}
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    '&:hover': { bgcolor: alpha('#fff', 0.3) },
                    borderRadius: 2,
                    boxShadow: 'none',
                    fontWeight: 500,
                  }}
                >
                  צור אימון חדש
                </Button>
              </Stack>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1,
                mt: { xs: 2, md: 0 },
                width: { xs: '100%', md: 'auto' }
              }}
            >
              <Box
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha('#fff', 0.15),
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 130,
                  mr: 2,
                }}
              >
                <WhatshotIcon sx={{ fontSize: 28, color: theme.palette.warning.light, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                  {todaysWorkouts.length}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                  אימונים להיום
                </Typography>
              </Box>
              <Box
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha('#fff', 0.15),
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 130,
                }}
              >
                <PeopleIcon sx={{ fontSize: 28, color: theme.palette.info.light, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                  {upcomingClients.length}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                  מתאמנים היום
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Stats cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
          סטטיסטיקות כלליות
        </Typography>
        <Grid container spacing={3}>
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
                  elevation={isMobile ? 1 : 0}
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    border: isMobile ? 'none' : `1px solid ${alpha(colorValue, 0.2)}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px -5px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: 7, 
                      height: '100%',
                      bgcolor: colorValue 
                    }} 
                  />
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      color="text.secondary" 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{stat.title}</span>
                      <Tooltip title="פרטים נוספים">
                        <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1,
                        color: colorValue,
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
                      pt: 1,
                      borderTop: `1px dashed ${alpha(theme.palette.divider, 0.6)}`,
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 35,
                        height: 35,
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
                      sx={{ height: 24, fontSize: '0.75rem' }}
                    />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Today's workouts and upcoming clients */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={isMobile ? 1 : 0}
            sx={{ 
              mb: 3, 
              p: 0,
              borderRadius: 3,
              border: isMobile ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: alpha(theme.palette.primary.main, 0.04),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                p: 2,
                pl: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WhatshotIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  אימונים להיום
                </Typography>
              </Box>
              <Box>
                <Chip 
                  label={`${todaysWorkouts.length} אימונים`} 
                  size="small" 
                  color="primary"
                  sx={{ 
                    borderRadius: 1,
                    fontWeight: 500,
                    height: 24
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
                                mr: 0.5, 
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
                p: 2, 
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                display: 'flex',
                justifyContent: 'space-between',
                background: alpha(theme.palette.background.default, 0.5)
              }}
            >
              <Button
                size="small"
                startIcon={<FitnessCenterIcon />}
                onClick={() => navigate('/workouts/new')}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 500
                }}
              >
                צור אימון חדש
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/workouts')}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 500
                }}
              >
                צפה בכל האימונים
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper 
            elevation={isMobile ? 1 : 0}
            sx={{ 
              p: 0,
              borderRadius: 3,
              border: isMobile ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: alpha(theme.palette.info.main, 0.04),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                p: 2,
                pl: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  מתאמנים ופגישות קרובות
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
                    height: 24
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ maxHeight: 450, overflow: 'auto', p: 2 }}>
              {upcomingClients.length === 0 ? (
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
                  <PeopleIcon sx={{ fontSize: 48, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
                  <Typography color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    אין פגישות קרובות להיום
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    לחץ על הכפתור למטה כדי להוסיף מתאמן חדש
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="info" 
                    size="small"
                    startIcon={<PersonIcon />}
                    onClick={() => navigate('/clients/new')}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
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
                          px: 1,
                          py: 1.2,
                          borderRadius: 2,
                          mb: 1,
                          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                          '&:hover': { 
                            bgcolor: alpha(theme.palette.info.main, 0.04),
                            borderColor: theme.palette.info.main,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 12px -2px ${alpha(theme.palette.info.main, 0.1)}`,
                            transition: 'all 0.2s ease'
                          },
                          cursor: 'pointer'
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: client.progress > 80 
                                ? alpha(theme.palette.success.main, 0.8) 
                                : client.progress > 50
                                  ? alpha(theme.palette.info.main, 0.8)
                                  : alpha(theme.palette.warning.main, 0.8),
                              boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            {client.name.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {client.name}
                              </Typography>
                              {client.progress > 80 && (
                                <Tooltip title="מתקדם מצוין">
                                  <CheckCircleIcon 
                                    sx={{ 
                                      color: theme.palette.success.main, 
                                      ml: 1, 
                                      fontSize: 16 
                                    }} 
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', color: theme.palette.text.secondary }} />
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {client.time} - אימון אישי
                              </Typography>
                            </Box>
                          }
                          primaryTypographyProps={{ fontWeight: 600 }}
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                        <Box sx={{ minWidth: 100, mr: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, justifyContent: 'flex-end', width: '100%' }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontWeight: 600, 
                                color: client.progress > 80 
                                  ? theme.palette.success.main 
                                  : client.progress > 50
                                    ? theme.palette.info.main
                                    : theme.palette.warning.main
                              }}
                            >
                              {client.progress}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                              התקדמות
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={client.progress} 
                            sx={{ 
                              width: '100%',
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.divider, 0.3),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: client.progress > 80 
                                  ? theme.palette.success.main 
                                  : client.progress > 50
                                    ? theme.palette.info.main
                                    : theme.palette.warning.main,
                                borderRadius: 3
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
                p: 2, 
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                display: 'flex',
                justifyContent: 'space-between',
                background: alpha(theme.palette.background.default, 0.5)
              }}
            >
              <Button
                size="small"
                startIcon={<PersonIcon />}
                onClick={() => navigate('/clients/new')}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 500
                }}
              >
                הוסף מתאמן חדש
              </Button>
              <Button 
                variant="outlined" 
                color="info" 
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/clients')}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 500
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