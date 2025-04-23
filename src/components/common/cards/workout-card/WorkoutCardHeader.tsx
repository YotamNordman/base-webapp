import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

interface WorkoutCardHeaderProps {
  title: string;
  description?: string;
  clientName: string;
  formattedDate: string;
  completed: boolean;
}

export const WorkoutCardHeader: React.FC<WorkoutCardHeaderProps> = ({
  title,
  description,
  clientName,
  formattedDate,
  completed
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Box>
        <Typography variant="h6" component="h2" align="right" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" align="right" sx={{ mb: 1 }}>
            {description}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" align="right">
          <strong>מתאמן:</strong> {clientName}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="right">
          <strong>מועד:</strong> {formattedDate}
        </Typography>
      </Box>
      <Box>
        <Chip 
          icon={completed ? <CheckCircleIcon /> : <PendingIcon />} 
          label={completed ? "הושלם" : "ממתין"} 
          color={completed ? "success" : "warning"}
          sx={{ mb: 1 }}
        />
      </Box>
    </Box>
  );
};

export default WorkoutCardHeader;
