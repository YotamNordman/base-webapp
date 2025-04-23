import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Chip, 
  Grid,
  Divider,
  CardActionArea,
  Checkbox,
  alpha,
  useTheme
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { ExerciseCardProps } from './types';

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  template,
  onClick,
  onEdit,
  onDelete,
  onSelect,
  selectable = false,
  selected = false
}) => {
  const theme = useTheme();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'קל':
        return 'success';
      case 'בינוני':
        return 'primary';
      case 'מתקדם':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const handleCardClick = () => {
    if (onClick) onClick(template.id);
  };
  
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect(template);
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main'
                }}
              >
                <FitnessCenterIcon sx={{ mr: 1 }} />
                {template.name}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 1 }}
              >
                {template.description}
              </Typography>
            </Box>
            
            <Chip 
              label={template.difficultyLevel} 
              color={getDifficultyColor(template.difficultyLevel) as any}
              size="small"
            />
          </Box>
          
          <Divider sx={{ my: 1.5 }} />
          
          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold">
                קבוצות שרירים:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {template.targetMuscleGroups}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold">
                ציוד נדרש:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {template.equipmentNeeded}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  mt: 1, 
                  gap: 1
                }}
              >
                {template.defaultSets && template.defaultReps && (
                  <Chip 
                    size="small" 
                    label={`${template.defaultSets} סטים × ${template.defaultReps} חזרות`}
                    variant="outlined"
                  />
                )}
                
                {template.defaultWeight && (
                  <Chip 
                    size="small" 
                    label={`${template.defaultWeight} ק"ג`}
                    variant="outlined"
                  />
                )}
                
                {template.defaultDuration && (
                  <Chip 
                    size="small" 
                    label={`${Math.floor(template.defaultDuration / 60)} דקות`}
                    variant="outlined"
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
      
      {(onEdit || onDelete) && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            p: 1,
            bgcolor: 'background.default'
          }}
        >
          {onEdit && (
            <IconButton 
              size="small" 
              color="primary" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(template.id);
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
                onDelete(template.id);
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

export default ExerciseCard;