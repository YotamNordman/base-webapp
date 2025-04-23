import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Alert, 
  Tabs, 
  Tab,
  Button,
  Fab,
  useTheme,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import { AppointmentForm } from '../../components/common/calendar';
import { useCalendar } from '../../hooks/useCalendar';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { setDateRange, deleteAppointmentEvent } from '../../store/slices/calendarSlice';
import { devLogin } from '../../utils/auth';

import { 
  CalendarViewTab, 
  AppointmentListTab, 
  ClientAppointmentsTab, 
  UpcomingAppointmentsTab 
} from './components';

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
      id={`calendar-tabpanel-${index}`}
      aria-labelledby={`calendar-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const CalendarPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Try to log in with developer credentials
  useEffect(() => {
    const login = async () => {
      try {
        setLoginLoading(true);
        const success = await devLogin();
        if (!success) {
          setLoginError('Failed to log in. Using mock data without authentication.');
        }
      } catch (err) {
        console.error('Login error:', err);
        setLoginError('Error during login. Using mock data without authentication.');
      } finally {
        setLoginLoading(false);
      }
    };
    
    login();
  }, []);
  
  const {
    events,
    selectedEvent,
    loading,
    error,
    isEventFormOpen,
    handleEventClick,
    handleDateSelect,
    closeEventForm
  } = useCalendar();
  
  // Initialize the date range on component mount
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    dispatch(setDateRange({
      start: start.toISOString(),
      end: end.toISOString()
    }));
  }, [dispatch]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleOpenCreateForm = () => {
    setIsCreateFormOpen(true);
  };
  
  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };
  
  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      dispatch(deleteAppointmentEvent(id));
    }
  };
  
  if (loginLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Setting up the application...
        </Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Calendar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your appointments and schedule with clients
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateForm}
          >
            New Appointment
          </Button>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<CalendarMonthIcon />} label="Calendar" />
          <Tab icon={<ListAltIcon />} label="Appointments" />
          <Tab icon={<PeopleIcon />} label="By Client" />
          <Tab icon={<UpcomingIcon />} label="Upcoming" />
        </Tabs>
      </Paper>
      
      {loginError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {loginError}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <TabPanel value={tabValue} index={0}>
        <CalendarViewTab 
          events={events}
          loading={loading}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <AppointmentListTab 
          events={events}
          loading={loading}
          onEditAppointment={handleEventClick}
          onDeleteAppointment={handleDeleteAppointment}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <ClientAppointmentsTab 
          events={events}
          loading={loading}
          onEventClick={handleEventClick}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <UpcomingAppointmentsTab 
          events={events}
          loading={loading}
          onEventClick={handleEventClick}
        />
      </TabPanel>
      
      {/* Floating action button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
          display: { sm: 'none' }
        }}
        onClick={handleOpenCreateForm}
      >
        <AddIcon />
      </Fab>
      
      {/* Appointment Form Dialog (for editing) */}
      <AppointmentForm
        open={isEventFormOpen}
        onClose={closeEventForm}
        event={selectedEvent}
      />
      
      {/* Appointment Form Dialog (for creating) */}
      <AppointmentForm
        open={isCreateFormOpen}
        onClose={handleCloseCreateForm}
        event={null}
      />
    </Container>
  );
};

export default CalendarPage;