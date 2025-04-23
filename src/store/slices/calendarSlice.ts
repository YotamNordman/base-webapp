import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent, appointmentToCalendarEvent } from '../../types/calendar';
import { calendarService } from '../../services/calendarService';
import { RootState } from '..';
import { Appointment } from '../../types/appointment';

interface CalendarState {
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  selectedDate: string | null;
  loading: boolean;
  error: string | null;
  view: 'month' | 'week' | 'day';
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

const initialState: CalendarState = {
  events: [],
  selectedEvent: null,
  selectedDate: null,
  loading: false,
  error: null,
  view: 'month',
  dateRange: {
    start: null,
    end: null
  }
};

// Thunks
export const fetchCalendarEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async ({ start, end }: { start: Date; end: Date }, { rejectWithValue }) => {
    try {
      return await calendarService.getCalendarEvents(start, end);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchClientCalendarEvents = createAsyncThunk(
  'calendar/fetchClientEvents',
  async (clientId: string, { rejectWithValue }) => {
    try {
      return await calendarService.getClientCalendarEvents(clientId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createAppointmentEvent = createAsyncThunk(
  'calendar/createEvent',
  async (appointment: Omit<Appointment, 'id'>, { rejectWithValue }) => {
    try {
      const newAppointment = await calendarService.createAppointment(appointment);
      // Return the calendar event format
      return newAppointment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAppointmentEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, appointment }: { id: string; appointment: Partial<Appointment> }, { rejectWithValue }) => {
    try {
      const updatedAppointment = await calendarService.updateAppointment(id, appointment);
      // Return the calendar event format
      return updatedAppointment;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteAppointmentEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      await calendarService.deleteAppointment(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<CalendarEvent | null>) => {
      state.selectedEvent = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },
    setView: (state, action: PayloadAction<'month' | 'week' | 'day'>) => {
      state.view = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch calendar events
    builder.addCase(fetchCalendarEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCalendarEvents.fulfilled, (state, action) => {
      state.events = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchCalendarEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Fetch client calendar events
    builder.addCase(fetchClientCalendarEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClientCalendarEvents.fulfilled, (state, action) => {
      state.events = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchClientCalendarEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Create appointment event
    builder.addCase(createAppointmentEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createAppointmentEvent.fulfilled, (state, action) => {
      // Add the new appointment to the events array
      const newEvent = appointmentToCalendarEvent(action.payload);
      state.events.push(newEvent);
      state.loading = false;
    });
    builder.addCase(createAppointmentEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Update appointment event
    builder.addCase(updateAppointmentEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAppointmentEvent.fulfilled, (state, action) => {
      // Update the event in the events array
      const updatedEvent = appointmentToCalendarEvent(action.payload);
      const index = state.events.findIndex(event => event.id === updatedEvent.id);
      if (index !== -1) {
        state.events[index] = updatedEvent;
      }
      state.loading = false;
      
      // If the updated event is the selected event, update it
      if (state.selectedEvent && state.selectedEvent.id === updatedEvent.id) {
        state.selectedEvent = updatedEvent;
      }
    });
    builder.addCase(updateAppointmentEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Delete appointment event
    builder.addCase(deleteAppointmentEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAppointmentEvent.fulfilled, (state, action) => {
      // Remove the event from the events array
      state.events = state.events.filter(event => event.id !== action.payload);
      state.loading = false;
      
      // If the deleted event is the selected event, clear it
      if (state.selectedEvent && state.selectedEvent.id === action.payload) {
        state.selectedEvent = null;
      }
    });
    builder.addCase(deleteAppointmentEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

// Export actions and reducer
export const { setSelectedEvent, setSelectedDate, setView, setDateRange, clearError } = calendarSlice.actions;

export default calendarSlice.reducer;

// Selectors
export const selectCalendarEvents = (state: RootState) => state.calendar.events;
export const selectSelectedEvent = (state: RootState) => state.calendar.selectedEvent;
export const selectSelectedDate = (state: RootState) => state.calendar.selectedDate;
export const selectCalendarLoading = (state: RootState) => state.calendar.loading;
export const selectCalendarError = (state: RootState) => state.calendar.error;
export const selectCalendarView = (state: RootState) => state.calendar.view;
export const selectCalendarDateRange = (state: RootState) => state.calendar.dateRange;