import React from 'react';
import { Box, Paper, Typography, Avatar, useTheme, alpha } from '@mui/material';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const theme = useTheme();
  const cardColor = color || theme.palette.primary.main;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: alpha(cardColor, 0.04),
        border: `1px solid ${alpha(cardColor, 0.1)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: alpha(cardColor, 0.1),
            color: cardColor,
            mr: 1.5
          }}
        >
          {icon}
        </Avatar>
        <Typography color="text.secondary" variant="subtitle2">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
        {value}
      </Typography>
    </Paper>
  );
};

export default StatsCard;