import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button,
  Alert,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createClient,
  selectClientStatus,
  selectClientError
} from '../../store/slices/clientsSlice';
import ClientForm from '../../components/common/forms/client-form';
import { Client } from '../../types/client';
import { AppDispatch } from '../../store';

const ClientCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);
  
  const handleBackClick = () => {
    navigate('/clients');
  };
  
  const handleSubmit = async (data: Omit<Client, 'id'>) => {
    try {
      const resultAction = await dispatch(createClient(data));
      if (createClient.fulfilled.match(resultAction)) {
        // Navigate to the client details page
        navigate(`/clients/${resultAction.payload.id}`);
      }
    } catch (err) {
      console.error('Failed to create client:', err);
    }
  };
  
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
          הוספת מתאמן חדש
        </Typography>
      </Box>
      
      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'שגיאה ביצירת מתאמן חדש'}
        </Alert>
      )}
      
      <ClientForm
        onSubmit={handleSubmit}
        isLoading={status === 'loading'}
        error={status === 'failed' ? error : null}
      />
    </Container>
  );
};

export default ClientCreatePage;
