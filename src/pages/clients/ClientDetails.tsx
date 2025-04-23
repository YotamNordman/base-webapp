import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  Grid, 
  Avatar, 
  Chip, 
  CircularProgress, 
  Alert,
  Tabs,
  Tab,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  FitnessCenter as FitnessCenterIcon,
  Event as EventIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  MedicalInformation as MedicalIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchClientById,
  selectClientById,
  selectClientStatus,
  selectClientError
} from '../../store/slices/clientsSlice';
import { AppDispatch, RootState } from '../../store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const client = useSelector((state: RootState) => selectClientById(state, id || ''));
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);
  
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    if (id && (!client || status === 'idle')) {
      dispatch(fetchClientById(id));
    }
  }, [id, client, status, dispatch]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleBackClick = () => {
    navigate('/clients');
  };
  
  const handleEditClick = () => {
    navigate(`/clients/${id}/edit`);
  };
  
  const handleAddWorkout = () => {
    navigate(`/workouts/new?clientId=${id}`);
  };
  
  const handleScheduleAppointment = () => {
    navigate(`/calendar?clientId=${id}`);
  };
  
  // Format date to display in a friendly format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'לא הוגדר';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Get status color based on client status
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Get status label based on client status
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active':
        return 'פעיל';
      case 'inactive':
        return 'לא פעיל';
      case 'pending':
        return 'ממתין';
      default:
        return 'לא ידוע';
    }
  };
  
  if (status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          טוען פרטי מתאמן...
        </Typography>
      </Container>
    );
  }
  
  if (status === 'failed') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'לא ניתן לטעון את פרטי המתאמן'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
        >
          חזרה לרשימת המתאמנים
        </Button>
      </Container>
    );
  }
  
  if (!client) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          מתאמן לא נמצא
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
        >
          חזרה לרשימת המתאמנים
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mr: 2 }}
        >
          חזרה
        </Button>
        
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ flexGrow: 1 }}>
          פרטי מתאמן
        </Typography>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEditClick}
          sx={{ mr: 2 }}
        >
          עריכה
        </Button>
        
        <Button
          variant="contained"
          startIcon={<FitnessCenterIcon />}
          onClick={handleAddWorkout}
          sx={{ mr: 2 }}
        >
          הוספת אימון
        </Button>
        
        <Button
          variant="contained"
          color="secondary"
          startIcon={<EventIcon />}
          onClick={handleScheduleAppointment}
        >
          קביעת פגישה
        </Button>
      </Box>
      
      <Paper sx={{ mb: 4, overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar 
                src={client.profileImage} 
                alt={`${client.firstName} ${client.lastName}`}
                sx={{ width: 100, height: 100, border: '4px solid white' }}
              />
            </Grid>
            
            <Grid item xs>
              <Typography variant="h4" fontWeight="bold">
                {client.firstName} {client.lastName}
              </Typography>
              
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <Chip 
                  label={getStatusLabel(client.status)} 
                  color={getStatusColor(client.status) as 'success' | 'error' | 'warning' | 'default'}
                  sx={{ mr: 2 }}
                />
                
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ fontSize: 20, mr: 0.5 }} />
                  מתאמן מאז: {formatDate(client.startDate)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="פרטים" />
            <Tab label="אימונים" />
            <Tab label="פגישות" />
            <Tab label="התקדמות" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              פרטי קשר
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      טלפון
                    </Typography>
                    <Typography variant="body1">
                      {client.phone}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      אימייל
                    </Typography>
                    <Typography variant="body1">
                      {client.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      כתובת
                    </Typography>
                    <Typography variant="body1">
                      {client.address || 'לא הוגדר'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom fontWeight="bold">
              פרטים אישיים
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    תאריך לידה
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(client.birthDate)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    מגדר
                  </Typography>
                  <Typography variant="body1">
                    {client.gender === 'male' ? 'זכר' : 
                      client.gender === 'female' ? 'נקבה' : 
                      client.gender === 'other' ? 'אחר' : 'לא הוגדר'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    איש קשר לשעת חירום
                  </Typography>
                  <Typography variant="body1">
                    {client.emergencyContact || 'לא הוגדר'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <MedicalIcon sx={{ mr: 1 }} />
              מידע רפואי ומטרות
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    מידע רפואי
                  </Typography>
                  <Typography variant="body1">
                    {client.healthInfo || 'אין מידע רפואי רשום'}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    מטרות
                  </Typography>
                  <Typography variant="body1">
                    {client.goals || 'לא הוגדרו מטרות'}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    הערות
                  </Typography>
                  <Typography variant="body1">
                    {client.notes || 'אין הערות'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" gutterBottom>
              אימונים
            </Typography>
            <Alert severity="info">
              פה יוצגו האימונים של המתאמן כשנשלים את תכונת הקישור בין מתאמנים לאימונים.
            </Alert>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" gutterBottom>
              פגישות
            </Typography>
            <Alert severity="info">
              פה יוצגו הפגישות של המתאמן כשנשלים את תכונת הקישור בין מתאמנים לפגישות.
            </Alert>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ px: 3 }}>
            <Typography variant="h6" gutterBottom>
              התקדמות
            </Typography>
            <Alert severity="info">
              פה יוצגו נתוני ההתקדמות של המתאמן כשנשלים את מערכת המעקב אחר התקדמות.
            </Alert>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ClientDetails;
