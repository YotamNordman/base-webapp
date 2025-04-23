import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Stack,
  Avatar,
  AvatarGroup
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { CalendarEvent } from '../../../types/calendar';
import { AppointmentStatus, AppointmentType } from '../../../types/appointment';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

interface UpcomingAppointmentsTabProps {
  events: CalendarEvent[];
  loading: boolean;
  onEventClick: (event: CalendarEvent) => void;
}

const UpcomingAppointmentsTab: React.FC<UpcomingAppointmentsTabProps> = ({
  events,
  loading,
  onEventClick
}) => {
  // Filter for upcoming appointments (not completed or cancelled) and sort by date
  const upcomingEvents = events
    .filter(event => 
      event.extendedProps.status !== AppointmentStatus.Completed && 
      event.extendedProps.status !== AppointmentStatus.Cancelled
    )
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Group events by day (today, tomorrow, this week, later)
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  const todayEvents = upcomingEvents.filter(event => isToday(new Date(event.start)));
  const tomorrowEvents = upcomingEvents.filter(event => isTomorrow(new Date(event.start)));
  const thisWeekEvents = upcomingEvents.filter(event => {
    const eventDate = new Date(event.start);
    return !isToday(eventDate) && 
           !isTomorrow(eventDate) && 
           eventDate < nextWeek;
  });
  const laterEvents = upcomingEvents.filter(event => 
    new Date(event.start) >= nextWeek
  );

  // Format time
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  // Format date with relative labels
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isToday(date)) {
        return 'Today';
      } else if (isTomorrow(date)) {
        return 'Tomorrow';
      } else {
        return format(date, 'EEEE, MMMM d');
      }
    } catch (error) {
      return dateString;
    }
  };

  // Get color for appointment type
  const getTypeColor = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.WorkoutSession:
        return 'success';
      case AppointmentType.Consultation:
        return 'primary';
      case AppointmentType.Assessment:
        return 'warning';
      case AppointmentType.Other:
      default:
        return 'default';
    }
  };

  // Appointment card component
  const AppointmentCard = ({ event }: { event: CalendarEvent }) => (
    <Card
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={() => onEventClick(event)}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="div">
                {event.title}
              </Typography>
              <Chip 
                label={event.extendedProps.type.replace('WorkoutSession', 'Workout')} 
                color={getTypeColor(event.extendedProps.type) as any}
                size="small"
              />
            </Stack>
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EventIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {formatDate(event.start)}
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {formatTime(event.start)} - {formatTime(event.end)}
                </Typography>
              </Stack>
              
              {event.extendedProps.location && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {event.extendedProps.location}
                  </Typography>
                </Stack>
              )}
              
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {event.extendedProps.clientName || 'No client assigned'}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Chip 
                label={event.extendedProps.status} 
                size="small"
                color={
                  event.extendedProps.status === AppointmentStatus.Confirmed ? 'success' :
                  event.extendedProps.status === AppointmentStatus.Scheduled ? 'primary' :
                  'default'
                }
              />
              <Button size="small" variant="outlined">
                View Details
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  // Section component for a group of appointments
  const AppointmentSection = ({ 
    title, 
    events, 
    showDivider = true 
  }: { 
    title: string, 
    events: CalendarEvent[], 
    showDivider?: boolean 
  }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title} {events.length > 0 && `(${events.length})`}
      </Typography>
      
      {events.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No upcoming appointments
        </Typography>
      ) : (
        events.map(event => <AppointmentCard key={event.id} event={event} />)
      )}
      
      {showDivider && <Divider sx={{ mt: 2 }} />}
    </Box>
  );

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : upcomingEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No upcoming appointments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Schedule a new appointment to get started
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Today</Typography>
                  <Typography variant="h3">{todayEvents.length}</Typography>
                  <Typography variant="body2" color="text.secondary">appointments</Typography>
                  {todayEvents.length > 0 && (
                    <AvatarGroup max={3} sx={{ mt: 2, justifyContent: 'flex-start' }}>
                      {todayEvents.map(event => (
                        <Avatar key={event.id} alt={event.extendedProps.clientName}>
                          {event.extendedProps.clientName?.charAt(0) || '?'}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Tomorrow</Typography>
                  <Typography variant="h3">{tomorrowEvents.length}</Typography>
                  <Typography variant="body2" color="text.secondary">appointments</Typography>
                  {tomorrowEvents.length > 0 && (
                    <AvatarGroup max={3} sx={{ mt: 2, justifyContent: 'flex-start' }}>
                      {tomorrowEvents.map(event => (
                        <Avatar key={event.id} alt={event.extendedProps.clientName}>
                          {event.extendedProps.clientName?.charAt(0) || '?'}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>This Week</Typography>
                  <Typography variant="h3">{thisWeekEvents.length}</Typography>
                  <Typography variant="body2" color="text.secondary">appointments</Typography>
                  {thisWeekEvents.length > 0 && (
                    <AvatarGroup max={3} sx={{ mt: 2, justifyContent: 'flex-start' }}>
                      {thisWeekEvents.map(event => (
                        <Avatar key={event.id} alt={event.extendedProps.clientName}>
                          {event.extendedProps.clientName?.charAt(0) || '?'}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Total Upcoming</Typography>
                  <Typography variant="h3">{upcomingEvents.length}</Typography>
                  <Typography variant="body2" color="text.secondary">appointments</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <AppointmentSection title="Today" events={todayEvents} />
          <AppointmentSection title="Tomorrow" events={tomorrowEvents} />
          <AppointmentSection title="This Week" events={thisWeekEvents} />
          <AppointmentSection title="Later" events={laterEvents} showDivider={false} />
        </>
      )}
    </Box>
  );
};

export default UpcomingAppointmentsTab;