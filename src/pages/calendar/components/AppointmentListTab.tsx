import React, { useState } from 'react';
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
  Chip,
  IconButton,
  TablePagination,
  TextField,
  MenuItem,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { CalendarEvent } from '../../../types/calendar';
import { AppointmentStatus, AppointmentType } from '../../../types/appointment';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { DateRangeSelector } from '../../../components/common/calendar';

interface AppointmentListTabProps {
  events: CalendarEvent[];
  loading: boolean;
  onEditAppointment: (event: CalendarEvent) => void;
  onDeleteAppointment: (eventId: string) => void;
}

const AppointmentListTab: React.FC<AppointmentListTabProps> = ({
  events,
  loading,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | AppointmentType>('all');
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filters
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value as 'all' | AppointmentStatus);
    setPage(0);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent<string>) => {
    setTypeFilter(event.target.value as 'all' | AppointmentType);
    setPage(0);
  };

  // Handle date range change
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setPage(0);  // Reset to first page when date range changes
  };
  
  // Filter and sort events
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.extendedProps.clientName && 
       event.extendedProps.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || event.extendedProps.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.extendedProps.type === typeFilter;
    const matchesDateRange = eventDate >= startDate && eventDate <= endDate;
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Paginate events
  const paginatedEvents = filteredEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Map status to chip color
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Scheduled:
        return 'primary';
      case AppointmentStatus.Confirmed:
        return 'success';
      case AppointmentStatus.Completed:
        return 'info';
      case AppointmentStatus.Cancelled:
        return 'error';
      case AppointmentStatus.NoShow:
        return 'warning';
      default:
        return 'default';
    }
  };

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
      {/* Date Range Selector */}
      <DateRangeSelector 
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
      />
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value={AppointmentStatus.Scheduled}>Scheduled</MenuItem>
                <MenuItem value={AppointmentStatus.Confirmed}>Confirmed</MenuItem>
                <MenuItem value={AppointmentStatus.Completed}>Completed</MenuItem>
                <MenuItem value={AppointmentStatus.Cancelled}>Cancelled</MenuItem>
                <MenuItem value={AppointmentStatus.NoShow}>No Show</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={handleTypeFilterChange}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value={AppointmentType.WorkoutSession}>Workout</MenuItem>
                <MenuItem value={AppointmentType.Consultation}>Consultation</MenuItem>
                <MenuItem value={AppointmentType.Assessment}>Assessment</MenuItem>
                <MenuItem value={AppointmentType.Other}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Table */}
      <TableContainer component={Paper}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
          <Typography variant="h6" component="div">
            {filteredEvents.length} Appointments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {paginatedEvents.length > 0
              ? `Showing ${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredEvents.length)} of ${filteredEvents.length}`
              : 'No appointments found'}
          </Typography>
        </Box>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography variant="body2" component="span">
                    Loading appointments...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No appointments found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEvents.map((event) => (
                <TableRow 
                  key={event.id}
                  hover
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer' 
                    } 
                  }}
                  onClick={() => onEditAppointment(event)}
                >
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.extendedProps.clientName || 'N/A'}</TableCell>
                  <TableCell>{formatDate(event.start)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={event.extendedProps.type.replace('WorkoutSession', 'Workout')} 
                      size="small"
                      color={
                        event.extendedProps.type === AppointmentType.WorkoutSession ? 'success' :
                        event.extendedProps.type === AppointmentType.Consultation ? 'primary' :
                        event.extendedProps.type === AppointmentType.Assessment ? 'warning' :
                        'default'
                      }
                      sx={{ minWidth: '90px' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={event.extendedProps.status} 
                      color={getStatusColor(event.extendedProps.status) as any}
                      size="small"
                      sx={{ minWidth: '90px' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAppointment(event);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAppointment(event.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEvents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default AppointmentListTab;