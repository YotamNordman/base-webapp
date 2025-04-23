import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ 
      textAlign: 'center', 
      py: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh'
    }}>
      <Typography variant="h1" component="h1" sx={{ fontSize: '5rem', fontWeight: 700, mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        דף לא נמצא
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 450, mx: 'auto' }}>
        מצטערים, הדף שאתה מחפש אינו קיים או שהועבר למקום אחר.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')} size="large">
        חזרה לדף הבית
      </Button>
    </Box>
  );
};

export default NotFound;
