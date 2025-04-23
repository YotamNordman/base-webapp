import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Paper, useTheme } from '@mui/material';
import { CalendarEvent } from '../../../types/calendar';
import { EventClickArg, DateSelectArg, EventInput } from '@fullcalendar/core';

interface CalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (info: DateSelectArg) => void;
  isLoading?: boolean;
  height?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onEventClick,
  onDateSelect,
  isLoading = false,
  height = 'auto'
}) => {
  const theme = useTheme();
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');

  // Convert our CalendarEvent[] to EventInput[] for FullCalendar
  const formattedEvents: EventInput[] = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    color: event.color,
    textColor: event.textColor,
    backgroundColor: event.backgroundColor,
    borderColor: event.borderColor,
    extendedProps: event.extendedProps
  }));

  const handleEventClick = (info: EventClickArg) => {
    if (onEventClick) {
      const clickedEvent = events.find(e => e.id === info.event.id);
      if (clickedEvent) {
        onEventClick(clickedEvent);
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height }}>
      <Box
        sx={{
          '& .fc': {
            fontFamily: theme.typography.fontFamily,
          },
          '& .fc-toolbar-title': {
            fontSize: theme.typography.h5.fontSize,
            fontWeight: theme.typography.fontWeightMedium,
          },
          '& .fc-event': {
            cursor: 'pointer',
            borderRadius: theme.shape.borderRadius,
          },
          '& .fc-day-today': {
            backgroundColor: `${theme.palette.primary.light}20`,
          },
          '& .fc-button-primary': {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              borderColor: theme.palette.primary.dark,
            },
            '&:disabled': {
              backgroundColor: theme.palette.action.disabledBackground,
              borderColor: theme.palette.action.disabledBackground,
            },
          },
          '& .fc-button-primary:not(:disabled).fc-button-active': {
            backgroundColor: theme.palette.primary.dark,
            borderColor: theme.palette.primary.dark,
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView={view}
          editable={false}
          selectable={!!onDateSelect}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={formattedEvents}
          eventClick={handleEventClick}
          select={onDateSelect}
          datesSet={(dateInfo) => {
            // Update view state when user changes the view
            setView(dateInfo.view.type as any);
          }}
          loading={(isLoading) => {
            // You can add loading indicator logic here
          }}
          height="100%"
        />
      </Box>
    </Paper>
  );
};

export default Calendar;