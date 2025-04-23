import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Avatar,
  Chip,
  Stack,
  IconButton,
  CardHeader,
  Divider,
  LinearProgress,
  useTheme,
  alpha,
  Paper,
  Tab,
  Tabs,
  List,
  ListItem
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

// Custom stat card component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: number;
  trendLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color = 'primary',
  trend,
  trendLabel
}) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 18px 0 rgba(32, 40, 45, 0.12)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          background: `linear-gradient(45deg, transparent 40%, ${alpha(theme.palette[color].main, 0.1)})`,
          zIndex: 0,
        }}
      />
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 42,
              height: 42,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette[color].main, 0.12),
              color: theme.palette[color].main,
            }}
          >
            {icon}
          </Box>
          {trend !== undefined && (
            <Chip 
              size="small" 
              label={`${trend > 0 ? '+' : ''}${trend}% ${trendLabel || ''}`}
              color={trend > 0 ? 'success' : 'error'}
              icon={<TrendingUpIcon style={{ transform: trend > 0 ? 'none' : 'rotate(180deg)' }} />}
              sx={{ height: 24, fontSize: '0.75rem' }}
            />
          )}
        </Box>
        <Typography variant="h3" component="div" sx={{ mb: 0.5, fontWeight: 700, color: 'text.primary' }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Interface for activity items
interface ActivityItem {
  id: number;
  client: string;
  action: string;
  time: string;
  avatar?: string;
  type: 'workout' | 'message' | 'progress' | 'subscription';
}

// ActivityItem component
const ActivityItemComponent: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
  const theme = useTheme();
  
  // Get appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <FitnessCenterIcon fontSize="small" color="primary" />;
      case 'message':
        return <WhatsAppIcon fontSize="small" color="success" />;
      case 'progress':
        return <TrendingUpIcon fontSize="small" color="info" />;
      case 'subscription':
        return <PeopleIcon fontSize="small" color="secondary" />;
      default:
        return <NotificationsNoneIcon fontSize="small" color="action" />;
    }
  };
  
  // Style based on activity type
  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'workout':
        return theme.palette.primary.main;
      case 'message':
        return theme.palette.success.main;
      case 'progress':
        return theme.palette.info.main;
      case 'subscription':
        return theme.palette.secondary.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  return (
    <ListItem 
      sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          cursor: 'pointer',
        },
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <Avatar
        sx={{ 
          mr: 2,
          bgcolor: alpha(getActivityColor(activity.type), 0.1),
          color: getActivityColor(activity.type),
          width: 40,
          height: 40
        }}
      >
        {getActivityIcon(activity.type)}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" fontWeight="medium">
            {activity.client}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {activity.time}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {activity.action}
        </Typography>
      </Box>
    </ListItem>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for recent activities
  const recentActivities: ActivityItem[] = [
    {
      id: 1,
      client: 'Ë’‡ŸÍ €‘ﬂ',
      action: '‘È‹Ÿﬁ‘ –Ÿﬁ’ﬂ €’◊',
      time: '‹‰‡Ÿ 3 È‚’Í',
      type: 'workout',
    },
    {
      id: 2,
      client: 'Ÿ’·Ÿ ﬁ÷Ë◊Ÿ',
      action: 'È‹◊ ‘’”‚‘ ◊”È‘',
      time: '‹‰‡Ÿ 5 È‚’Í',
      type: 'message',
    },
    {
      id: 3,
      client: 'ﬁŸ€‹ –—Ë‘›',
      action: '‚”€‡‘ ‡Í’‡Ÿ ‘ÍÁ”ﬁ’Í',
      time: '‹‰‡Ÿ 7 È‚’Í',
      type: 'progress',
    },
    {
      id: 4,
      client: '–‹’ﬂ ‹’Ÿ',
      action: '◊Ÿ”È ﬁ‡’Ÿ ◊’”ÈŸ',
      time: '‹‰‡Ÿ 12 È‚’Í',
      type: 'subscription',
    },
  ];

  // Mock data for upcoming sessions
  const upcomingSessions = [
    { id: 1, client: 'ÈŸË‘ ”’”', time: '10:00', type: '–Ÿﬁ’ﬂ €’◊', duration: '60 ”Á’Í' },
    { id: 2, client: 'Ë’‡ŸÍ €‘ﬂ', time: '12:30', type: '–Ÿﬁ’ﬂ ÁË”Ÿ’', duration: '45 ”Á’Í' },
    { id: 3, client: '–‹’ﬂ ‹’Ÿ', time: '14:00', type: '‰“ŸÈÍ Ÿ‚’Â', duration: '30 ”Á’Í' },
  ];

  // Date formatting
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('he-IL', dateOptions);

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                È‹’›, ﬁ–ﬁﬂ!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {formattedDate} | ﬁ—ÿ ﬁ‘ŸË ‚‹ ‘‰‚Ÿ‹’Í ‘–◊Ë’‡‘ ’‚‹ ﬁ‘ ÈﬁÍ’€‡ﬂ ‹‘Ÿ’›
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button 
                variant="contained" 
                onClick={() => navigate('/workouts/new')}
                sx={{ 
                  px: 3, 
                  py: 1.2,
                  boxShadow: theme.customShadows.button,
                  '&:hover': {
                    boxShadow: '0 6px 12px 0 rgba(58, 110, 165, 0.3)',
                  }
                }}
              >
                Ê’Ë –Ÿﬁ’ﬂ ◊”È
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} component="div">
          <Grid item xs={12} sm={6} md={3} component="div">
            <StatCard 
              icon={<PeopleIcon fontSize="small" />} 
              title="ﬁÍ–ﬁ‡Ÿ› ‰‚Ÿ‹Ÿ›" 
              value="24" 
              trend={8}
              trendLabel="‘◊’”È"
              color="primary"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} component="div">
            <StatCard 
              icon={<FitnessCenterIcon fontSize="small" />} 
              title="–Ÿﬁ’‡Ÿ› ‘È—’‚" 
              value="56"
              trend={12}
              trendLabel="ﬁÈ—’‚ È‚—Ë"
              color="info"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} component="div">
            <StatCard 
              icon={<CalendarTodayIcon fontSize="small" />} 
              title="‰“ŸÈ’Í ‘Ÿ’›" 
              value="8"
              subtitle="3 –Ÿﬁ’‡Ÿ› –ŸÈŸŸ›, 5 ÈŸ◊’Í Ÿ‚’Â"
              color="warning"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} component="div">
            <StatCard 
              icon={<BarChartIcon fontSize="small" />} 
              title="—ŸÊ’‚ –Ÿﬁ’‡Ÿ›" 
              value="92%"
              trend={4}
              trendLabel="ﬁ‘◊’”È ‘Á’”›"
              color="success"
            />
          </Grid>
        </Grid>

        {/* Chart & Activity Section */}
        <Grid container spacing={3} sx={{ mt: 1 }} component="div">
          {/* Left Column: Charts & Activities */}
          <Grid item xs={12} lg={8} component="div">
            <Card sx={{ mb: 3, overflow: 'visible' }}>
              <CardHeader 
                title="·ÁŸËÍ —ŸÊ’‚Ÿ›" 
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                sx={{ pb: 0 }}
              />
              <Box sx={{ px: 3, pt: 1 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  textColor="primary"
                  indicatorColor="primary"
                  aria-label="performance tabs"
                  sx={{ 
                    '& .MuiTab-root': { 
                      minWidth: 'auto', 
                      px: 2,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                    },
                  }}
                >
                  <Tab label="È—’‚Ÿ" />
                  <Tab label="◊’”ÈŸ" />
                  <Tab label="È‡ÍŸ" />
                </Tabs>
              </Box>
              <Divider sx={{ mt: 1 }} />
              <CardContent>
                <Box sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 2, mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    ·Ÿ€’› ‰‚Ÿ‹’Í - È—’‚ –◊Ë’ﬂ
                  </Typography>
                  <Grid container spacing={2} component="div">
                    <Grid item xs={6} sm={3} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">24</Typography>
                        <Typography variant="caption" color="text.secondary">ﬁÍ–ﬁ‡Ÿ› ‰‚Ÿ‹Ÿ›</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">56</Typography>
                        <Typography variant="caption" color="text.secondary">–Ÿﬁ’‡Ÿ›</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">92%</Typography>
                        <Typography variant="caption" color="text.secondary">—ŸÊ’‚</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">12</Typography>
                        <Typography variant="caption" color="text.secondary">È‚’Í –Ÿﬁ’ﬂ</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Áÿ“’ËŸ’Í –Ÿﬁ’‡Ÿ›
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">–Ÿﬁ’‡Ÿ €’◊</Typography>
                    <Typography variant="body2" color="primary.main" fontWeight="medium">42%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={42} 
                    sx={{ 
                      mb: 2, 
                      height: 8, 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.primary.main
                      }
                    }} 
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">–Ÿﬁ’‡Ÿ ÁË”Ÿ’</Typography>
                    <Typography variant="body2" color="info.main" fontWeight="medium">28%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={28} 
                    sx={{ 
                      mb: 2, 
                      height: 8, 
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.info.main
                      }
                    }} 
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">“ﬁŸÈ’Í ’ŸÊŸ—‘</Typography>
                    <Typography variant="body2" color="success.main" fontWeight="medium">18%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={18} 
                    sx={{ 
                      mb: 2, 
                      height: 8, 
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.success.main
                      }
                    }} 
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">–◊Ë</Typography>
                    <Typography variant="body2" color="warning.main" fontWeight="medium">12%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={12} 
                    sx={{ 
                      height: 8, 
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.warning.main
                      }
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
            
            {/* Recent Activities Card */}
            <Card>
              <CardHeader 
                title="‰‚Ÿ‹’Í –◊Ë’‡‘" 
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                action={
                  <Button 
                    size="small" 
                    color="primary" 
                    sx={{ fontWeight: 500 }}
                    onClick={() => navigate('/activities')}
                  >
                    ‘Ê“ ‘€‹
                  </Button>
                }
              />
              <Divider />
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity) => (
                  <ActivityItemComponent key={activity.id} activity={activity} />
                ))}
              </List>
            </Card>
          </Grid>
          
          {/* Right Column: Upcoming Sessions */}
          <Grid item xs={12} lg={4} component="div">
            <Card sx={{ height: '100%' }}>
              <CardHeader 
                title="‰“ŸÈ’Í ‹‘Ÿ’›" 
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                action={
                  <Button 
                    size="small" 
                    color="primary" 
                    sx={{ fontWeight: 500 }}
                    onClick={() => navigate('/calendar')}
                  >
                    Ÿ’ﬁﬂ ﬁ‹–
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                {upcomingSessions.map((session) => (
                  <Box 
                    key={session.id} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.05)',
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => navigate(`/calendar/${session.id}`)}
                  >
                    <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', width: 42, height: 42, mr: 2 }}>
                      {session.client.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {session.client}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={session.time} 
                          sx={{ 
                            height: 24, 
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: 'primary.main',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }} 
                          icon={<AccessTimeIcon fontSize="small" />}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {session.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {session.duration}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/calendar/new')}
                >
                  ‘’·„ ‰“ŸÈ‘ ◊”È‘
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Dashboard;