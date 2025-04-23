import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Chip,
  Grid,
  CircularProgress
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { fetchClientCalendarEvents } from '../../../store/slices/calendarSlice';
import { CalendarEvent } from '../../../types/calendar';
import { format } from 'date-fns';

interface ClientAppointmentsTabProps {
  events: CalendarEvent[];
  loading: boolean;
  onEventClick: (event: CalendarEvent) => void;
}

const ClientAppointmentsTab: React.FC<ClientAppointmentsTabProps> = ({
  events,
  loading,
  onEventClick
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clients, setClients] = useState<{ id: string, name: string }[]>([]);

  // Extract unique clients from events
  useEffect(() => {
    const uniqueClients = new Map<string, string>();
    
    events.forEach(event => {
      if (event.extendedProps.clientId && event.extendedProps.clientName) {
        uniqueClients.set(event.extendedProps.clientId, event.extendedProps.clientName);
      }
    });
    
    const clientsList = Array.from(uniqueClients.entries()).map(([id, name]) => ({
      id,
      name
    }));
    
    setClients(clientsList);
    
    // Set the first client as selected if there's no selection yet
    if (clientsList.length > 0 && !selectedClientId) {
      setSelectedClientId(clientsList[0].id);
    }
  }, [events, selectedClientId]);

  // Handle client selection change
  const handleClientChange = (event: SelectChangeEvent<string>) => {
    const clientId = event.target.value;
    setSelectedClientId(clientId);
    
    // Fetch appointments for the selected client
    if (clientId) {
      dispatch(fetchClientCalendarEvents(clientId));
    }
  };

  // Filter events for the selected client
  const clientEvents = events.filter(
    event => event.extendedProps.clientId === selectedClientId
  ).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClientId}
                label="Client"
                onChange={handleClientChange}
                disabled={loading || clients.length === 0}
              >
                {clients.map(client => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {selectedClientId && clients.find(c => c.id === selectedClientId) && (
              <Typography variant="h6">
                Appointments for {clients.find(c => c.id === selectedClientId)?.name}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography variant="body2" display="inline">
                    Loading appointments...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : clientEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography>
                    {selectedClientId 
                      ? "No appointments found for this client" 
                      : "Please select a client"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              clientEvents.map(event => (
                <TableRow 
                  key={event.id}
                  hover
                  onClick={() => onEventClick(event)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{formatDate(event.start)}</TableCell>
                  <TableCell>{event.extendedProps.type}</TableCell>
                  <TableCell>
                    <Chip 
                      label={event.extendedProps.status} 
                      color={
                        event.extendedProps.status === 'Completed' ? 'success' :
                        event.extendedProps.status === 'Cancelled' ? 'error' :
                        event.extendedProps.status === 'Confirmed' ? 'primary' :
                        'default'
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{event.extendedProps.location || 'N/A'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClientAppointmentsTab;