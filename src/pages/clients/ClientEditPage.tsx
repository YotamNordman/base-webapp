import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchClientById,
  updateClient,
  selectClientById,
  selectClientStatus,
  selectClientError
} from '../../store/slices/clientsSlice';
import ClientForm from '../../components/common/forms/client-form';
import { Client } from '../../types/client';
import { AppDispatch, RootState } from '../../store';

const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const client = useSelector((state: RootState) => selectClientById(state, id || ''));
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);
  
  useEffect(() => {
    if (id && (!client || status === 'idle')) {
      dispatch(fetchClientById(id));
    }
  }, [id, client, status, dispatch]);
  
  const handleBackClick = () => {
    navigate(`/clients/${id}`);
  };
  
  const handleSubmit = async (data: Omit<Client, 'id'>) => {
    if (!id) return;
    
    try {
      const clientWithId = { ...data, id: Number(id) };
      const resultAction = await dispatch(updateClient(clientWithId));
      if (updateClient.fulfilled.match(resultAction)) {
        // Navigate back to the client details page
        navigate(`/clients/${id}`);
      }
    } catch (err) {
      console.error('Failed to update client:', err);
    }
  };
  
  if (status === 'loading' && !client) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          טוען פרטי מתאמן...
        </Typography>
      </Container>
    );
  }
  
  if (status === 'failed' && !client) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'לא ניתן לטעון את פרטי המתאמן'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/clients')}
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
          onClick={() => navigate('/clients')}
        >
          חזרה לרשימת המתאמנים
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mr: 2 }}
        >
          חזרה
        </Button>
        
        <Typography variant="h4" component="h1" fontWeight="bold">
          עריכת מתאמן
        </Typography>
      </Box>
      
      <ClientForm
        initialData={client}
        onSubmit={handleSubmit}
        isLoading={status === 'loading'}
        error={status === 'failed' ? error : null}
      />
    </Container>
  );
};

export default ClientEditPage;
