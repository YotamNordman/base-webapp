import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  TextField,
  Grid,
  Typography
} from '@mui/material';
import { addDays, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from 'date-fns';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (start: Date, end: Date) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onDateRangeChange
}) => {

  const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(event.target.value);
    if (!isNaN(newStart.getTime())) {
      onDateRangeChange(newStart, endDate);
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(event.target.value);
    if (!isNaN(newEnd.getTime())) {
      onDateRangeChange(startDate, newEnd);
    }
  };

  const handleToday = () => {
    const today = new Date();
    onDateRangeChange(today, today);
  };

  const handleThisWeek = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
    const end = endOfWeek(today, { weekStartsOn: 1 });
    onDateRangeChange(start, end);
  };

  const handleThisMonth = () => {
    const today = new Date();
    onDateRangeChange(startOfMonth(today), endOfMonth(today));
  };

  const handleNextMonth = () => {
    const today = new Date();
    const nextMonth = addMonths(today, 1);
    onDateRangeChange(startOfMonth(nextMonth), endOfMonth(nextMonth));
  };

  const handleNext7Days = () => {
    const today = new Date();
    onDateRangeChange(today, addDays(today, 6));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Date Range
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <ButtonGroup variant="outlined" size="small">
            <Button onClick={handleToday}>Today</Button>
            <Button onClick={handleThisWeek}>This Week</Button>
            <Button onClick={handleThisMonth}>This Month</Button>
            <Button onClick={handleNextMonth}>Next Month</Button>
            <Button onClick={handleNext7Days}>Next 7 Days</Button>
          </ButtonGroup>
        </Grid>
        
        <Grid item xs={12} sm={12} md="auto">
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6} md="auto">
              <TextField
                label="Start Date"
                type="date"
                value={formatDate(startDate)}
                onChange={handleStartDateChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md="auto">
              <TextField
                label="End Date"
                type="date"
                value={formatDate(endDate)}
                onChange={handleEndDateChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DateRangeSelector;