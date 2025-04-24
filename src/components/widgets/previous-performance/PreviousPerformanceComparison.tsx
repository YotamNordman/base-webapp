import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';
import { PreviousWorkoutPerformance } from '../../../types/workout';
import { format } from 'date-fns';

export interface PreviousPerformanceComparisonProps {
  previousPerformance: PreviousWorkoutPerformance | null;
  currentVolume?: number | null;
  loading?: boolean;
  error?: string | null;
}

/**
 * Component to display comparison between current workout and previous performance
 */
const PreviousPerformanceComparison: React.FC<PreviousPerformanceComparisonProps> = ({
  previousPerformance,
  currentVolume,
  loading = false,
  error = null
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" py={2}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2">Loading previous performance data...</Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
        <Typography variant="body2" color="error">
          Error loading previous performance: {error}
        </Typography>
      </Paper>
    );
  }

  if (!previousPerformance) {
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No previous performance data available for comparison.
        </Typography>
      </Paper>
    );
  }

  // Calculate volume comparison if both values are available
  const volumeComparison = currentVolume && previousPerformance.volume 
    ? ((currentVolume - previousPerformance.volume) / previousPerformance.volume) * 100
    : null;

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" component="h3">
          <Box display="flex" alignItems="center">
            <HistoryIcon sx={{ mr: 1 }} />
            Previous Performance
          </Box>
        </Typography>
        <IconButton onClick={toggleExpand} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      <Box display="flex" alignItems="center" mb={1}>
        <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2">
          {previousPerformance.completedAt 
            ? format(new Date(previousPerformance.completedAt), 'PP')
            : 'Date not available'}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Volume comparison */}
      <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
        <Typography variant="body1">Total Volume:</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" fontWeight="bold" mr={1}>
            {previousPerformance.volume?.toLocaleString() || 'N/A'}
          </Typography>
          
          {volumeComparison !== null && (
            <Chip
              icon={volumeComparison >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${volumeComparison >= 0 ? '+' : ''}${volumeComparison.toFixed(1)}%`}
              color={volumeComparison >= 0 ? 'success' : 'error'}
              size="small"
            />
          )}
        </Box>
      </Box>
      
      <Collapse in={expanded}>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Exercise Details:
        </Typography>
        
        <List dense disablePadding>
          {previousPerformance.exercises.map((exercise) => (
            <React.Fragment key={exercise.id}>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemText 
                  primary={exercise.name}
                  secondary={
                    <Box component="span">
                      {exercise.sets.map((set, i) => (
                        <Typography variant="caption" component="div" key={i}>
                          Set {set.setNumber}: {set.actualReps || '?'} reps @ {set.actualWeight || '?'} kg 
                          {set.actualRir !== undefined ? ` (RIR: ${set.actualRir})` : ''}
                        </Typography>
                      ))}
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

export default PreviousPerformanceComparison;