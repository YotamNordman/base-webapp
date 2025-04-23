import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateSelectArg } from '@fullcalendar/core';
import {
  fetchCalendarEvents,
  fetchClientCalendarEvents,
  setSelectedEvent,
  setSelectedDate,
  setView,
  setDateRange,
  selectCalendarEvents,
  selectSelectedEvent,
  selectCalendarLoading,
  selectCalendarError,
  selectCalendarView,
  selectCalendarDateRange
} from '../store/slices/calendarSlice';
import { CalendarEvent } from '../types/calendar';
import { AppDispatch } from '../store';

export const useCalendar = (clientId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector(selectCalendarEvents);
  const selectedEvent = useSelector(selectSelectedEvent);
  const loading = useSelector(selectCalendarLoading);
  const error = useSelector(selectCalendarError);
  const view = useSelector(selectCalendarView);
  const dateRange = useSelector(selectCalendarDateRange);
  
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  
  // Load events when date range changes
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      
      if (clientId) {
        dispatch(fetchClientCalendarEvents(clientId));
      } else {
        dispatch(fetchCalendarEvents({ start, end }));
      }
    }
  }, [dispatch, dateRange.start, dateRange.end, clientId]);
  
  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    dispatch(setSelectedEvent(event));
    setIsEventFormOpen(true);
  };
  
  // Handle date select
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    dispatch(setSelectedDate(selectInfo.startStr));
    setIsEventFormOpen(true);
  };
  
  // Handle view change
  const handleViewChange = (newView: 'month' | 'week' | 'day') => {
    dispatch(setView(newView));
  };
  
  // Handle date range change
  const handleDateRangeChange = (start: Date, end: Date) => {
    dispatch(setDateRange({ 
      start: start.toISOString(), 
      end: end.toISOString() 
    }));
  };
  
  // Close event form
  const closeEventForm = () => {
    setIsEventFormOpen(false);
    dispatch(setSelectedEvent(null));
    dispatch(setSelectedDate(null));
  };
  
  return {
    events,
    selectedEvent,
    loading,
    error,
    view,
    dateRange,
    isEventFormOpen,
    handleEventClick,
    handleDateSelect,
    handleViewChange,
    handleDateRangeChange,
    closeEventForm
  };
};