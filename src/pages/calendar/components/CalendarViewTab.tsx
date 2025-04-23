import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Calendar, DateRangeSelector } from '../../../components/common/calendar';
import { CalendarEvent } from '../../../types/calendar';
import { DateSelectArg } from '@fullcalendar/core';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { setDateRange } from '../../../store/slices/calendarSlice';

interface CalendarViewTabProps {
  events: CalendarEvent[];
  loading: boolean;
  onEventClick: (event: CalendarEvent) => void;
  onDateSelect: (info: DateSelectArg) => void;
}

const CalendarViewTab: React.FC<CalendarViewTabProps> = ({
  events,
  loading,
  onEventClick,
  onDateSelect
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  useEffect(() => {
    // Initialize with current month
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(start);
    setEndDate(end);
  }, []);
  
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    
    dispatch(setDateRange({
      start: start.toISOString(),
      end: end.toISOString()
    }));
  };
  
  return (
    <Box>
      <DateRangeSelector 
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
      />
      
      <Box sx={{ height: 'calc(100vh - 320px)', minHeight: '500px' }}>
        <Calendar
          events={events}
          onEventClick={onEventClick}
          onDateSelect={onDateSelect}
          isLoading={loading}
          height="100%"
        />
      </Box>
    </Box>
  );
};

export default CalendarViewTab;