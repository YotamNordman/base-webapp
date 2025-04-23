import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Button, 
  Avatar, 
  Box, 
  Chip, 
  IconButton,
  Divider,
  CardActionArea,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Event as EventIcon, 
  FitnessCenter as FitnessCenterIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { Client } from '../../../../types/client';

interface ClientCardProps {
  client: Client;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddWorkout?: (id: string) => void;
  onSchedule?: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onClick,
  onEdit,
  onDelete,
  onAddWorkout,
  onSchedule
}) => {
  const theme = useTheme();

  // Get status color based on client status
  const getStatusColor = (status: string) => {
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

  // Format date to display in a friendly format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        overflow: 'visible',
        position: 'relative'
      }}
    >
      <CardActionArea onClick={() => onClick?.(client.id)} sx={{ flexGrow: 1 }}>
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            pt: 3,
            pb: 1
          }}
        >
          <Avatar
            src={client.profileImage}
            alt={`${client.firstName} ${client.lastName}`}
            sx={{ 
              width: 64, 
              height: 64,
              mr: 2,
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          />
          <Box>
            <Typography variant="h6" component="div" gutterBottom fontWeight="bold">
              {client.firstName} {client.lastName}
            </Typography>
            <Chip 
              label={client.status === 'active' ? 'פעיל' : client.status === 'inactive' ? 'לא פעיל' : 'ממתין'} 
              size="small" 
              color={getStatusColor(client.status) as 'success' | 'error' | 'warning' | 'default'}
              sx={{ mb: 1 }}
            />
          </Box>
        </Box>
        
        <Divider />
        
        <CardContent sx={{ py: 1.5, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
            <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {client.email}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
            <PhoneIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {client.phone}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
              החל ב: {formatDate(client.startDate)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      
      <Divider />
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
        <Box>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(client.id);
            }}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(client.id);
            }}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Box>
          <Button 
            size="small" 
            startIcon={<FitnessCenterIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onAddWorkout?.(client.id);
            }}
            sx={{ mr: 1 }}
          >
            אימון
          </Button>
          
          <Button 
            size="small" 
            startIcon={<EventIcon />}
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onSchedule?.(client.id);
            }}
          >
            פגישה
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ClientCard;
