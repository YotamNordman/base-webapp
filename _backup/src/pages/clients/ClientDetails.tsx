import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>פרטי מתאמן</Typography>
      <Typography variant="body1">פרטי מתאמן מספר: {id}</Typography>
    </Box>
  );
};

export default ClientDetails;
