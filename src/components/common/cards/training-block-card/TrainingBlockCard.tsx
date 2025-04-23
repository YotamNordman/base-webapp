import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Divider, 
  IconButton, 
  CardActionArea,
  Checkbox,
  Grid,
  Button,
  alpha,
  useTheme
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  FlagOutlined as FlagIcon,
  SportsGymnastics as SportsIcon
} from '@mui/icons-material';
import { TrainingBlockCardProps } from './types';

const TrainingBlockCard: React.FC<TrainingBlockCardProps> = ({
  block,
  onClick,
  onEdit,
  onDelete,
  onAssign,
  selectable = false,
  selected = false,
  onSelect
}) => {
  const theme = useTheme();
  
  // Format dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate total workouts across all weeks
  const totalWorkouts = block.weeks.reduce((total, week) => total + week.workouts.length, 0);
  
  const handleCardClick = () => {
    if (onClick) onClick(block.id);
  };
  
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect(block);
  };
  
  return (
    <Card 
      sx={{ 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
        border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
        position: 'relative'
      }}
    >
      {selectable && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            left: 8, 
            zIndex: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            borderRadius: '50%'
          }}
          onClick={handleSelectClick}
        >
          <Checkbox checked={selected} color="primary" />
        </Box>
      )}
      
      <CardActionArea 
        onClick={handleCardClick}
        disabled={!onClick && !onSelect}
        sx={{ 
          display: 'block',
          cursor: (onClick || onSelect) ? 'pointer' : 'default'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ mb: 1, color: 'primary.main' }}
              >
                {block.title}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                {block.description}
              </Typography>
            </Box>
            
            <Chip 
              label={block.isTemplate ? "תבנית" : "מוקצה"} 
              color={block.isTemplate ? "primary" : "success"}
              size="small"
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>תאריכים:</strong> {formatDate(block.startDate)} - {formatDate(block.endDate)}
                </Typography>
              </Box>
              
              {block.clientName && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>מתאמן:</strong> {block.clientName}
                  </Typography>
                </Box>
              )}
              
              {block.goal && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FlagIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>מטרה:</strong> {block.goal}
                  </Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SportsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>שבועות:</strong> {block.weeks.length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SportsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>אימונים:</strong> {totalWorkouts}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
      
      {(onEdit || onDelete || onAssign) && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            p: 2,
            bgcolor: 'background.default',
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          {onAssign && block.isTemplate && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<AssignmentIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onAssign(block.id);
              }}
              sx={{ mr: 1 }}
            >
              שייך למתאמן
            </Button>
          )}
          
          {onEdit && (
            <IconButton 
              size="small" 
              color="primary" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(block.id);
              }}
              sx={{ ml: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          
          {onDelete && (
            <IconButton 
              size="small" 
              color="error" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Card>
  );
};

export default TrainingBlockCard;