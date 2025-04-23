import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  TextField,
  InputAdornment,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchClients, 
  selectFilteredClients, 
  selectClientStatus, 
  selectClientError,
  setStatusFilter,
  setSearchQuery,
  deleteClient,
  selectClientFilters
} from '../../store/slices/clientsSlice';
import ClientCard from '../../components/common/cards/client-card';
import { AppDispatch } from '../../store';

const ClientListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const clients = useSelector(selectFilteredClients);
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);
  const { status: statusFilter, search } = useSelector(selectClientFilters);
  
  // Local state for debounced search
  const [localSearchQuery, setLocalSearchQuery] = useState(search);
  
  useEffect(() => {
    // Load clients when the component mounts
    if (status === 'idle') {
      dispatch(fetchClients());
    }
  }, [status, dispatch]);
  
  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [localSearchQuery, dispatch]);
  
  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setStatusFilter(event.target.value));
  };
  
  const handleClientClick = (id: string) => {
    navigate(`/clients/${id}`);
  };
  
  const handleCreateClient = () => {
    navigate('/clients/new');
  };
  
  const handleEditClient = (id: string) => {
    navigate(`/clients/${id}/edit`);
  };
  
  const handleDeleteClient = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מתאמן זה?')) {
      dispatch(deleteClient(id))
        .unwrap()
        .then(() => {
          // Show success message or toast
          console.log('Client deleted successfully');
        })
        .catch((err) => {
          // Show error message
          console.error('Failed to delete client:', err);
        });
    }
  };
  
  const handleAddWorkout = (id: string) => {
    navigate(`/workouts/new?clientId=${id}`);
  };
  
  const handleScheduleAppointment = (id: string) => {
    navigate(`/calendar?clientId=${id}`);
  };
  
  const handleRefresh = () => {
    dispatch(fetchClients());
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <PeopleIcon sx={{ mr: 2, fontSize: 32 }} />
          מתאמנים
        </Typography>
        
        <Box display="flex" alignItems="center">
          <IconButton 
            onClick={handleRefresh} 
            sx={{ mr: 1 }}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateClient}
            sx={{ ml: 2 }}
          >
            מתאמן חדש
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="חיפוש לפי שם, אימייל או טלפון"
              variant="outlined"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-filter-label">סטטוס</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="סטטוס"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">הכל</MenuItem>
                <MenuItem value="active">פעיל</MenuItem>
                <MenuItem value="inactive">לא פעיל</MenuItem>
                <MenuItem value="pending">ממתין</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {status === 'loading' && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      
      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'טעינת המתאמנים נכשלה'}
        </Alert>
      )}
      
      {status === 'succeeded' && clients.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          לא נמצאו מתאמנים. נסה לשנות את החיפוש או הסינון, או הוסף מתאמן חדש.
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {clients.map(client => (
          <Grid item xs={12} sm={6} md={4} key={client.id}>
            <ClientCard
              client={client}
              onClick={handleClientClick}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
              onAddWorkout={handleAddWorkout}
              onSchedule={handleScheduleAppointment}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ClientListPage;