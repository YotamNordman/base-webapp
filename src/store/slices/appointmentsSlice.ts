import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, AppointmentFilters, CalendarEvent, AppointmentStatus, AppointmentType } from '../../types/appointment';
import { appointmentService } from '../../services/appointmentService';

interface AppointmentsState {
  appointments: Appointment[];
  calendarEvents: CalendarEvent[];
  upcomingAppointments: Appointment[];
  currentAppointment: Appointment | null;
  selectedClientAppointments: Appointment[];
  loading: boolean;
  error: string | null;
  filters: AppointmentFilters;
}

const initialState: AppointmentsState = {
  appointments: [],
  calendarEvents: [],
  upcomingAppointments: [],
  currentAppointment: null,
  selectedClientAppointments: [],
  loading: false,
  error: null,
  filters: {
    searchQuery: '',
    statusFilter: 'all',
    clientFilter: '',
    typeFilter: 'all',
    dateFilter: {
      startDate: null,
      endDate: null
    }
  }
};

// Thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await appointmentService.getAppointments();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointments/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await appointmentService.getAppointmentById(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCalendarEvents = createAsyncThunk(
  'appointments/fetchCalendarEvents',
  async ({ start, end }: { start: Date, end: Date }, { rejectWithValue }) => {
    try {
      return await appointmentService.getCalendarEvents(start, end);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchClientAppointments = createAsyncThunk(
  'appointments/fetchClientAppointments',
  async (clientId: string, { rejectWithValue }) => {
    try {
      return await appointmentService.getClientAppointments(clientId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUpcomingAppointments = createAsyncThunk(
  'appointments/fetchUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      return await appointmentService.getUpcomingAppointments();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointment: Omit<Appointment, 'id'>, { rejectWithValue }) => {
    try {
      return await appointmentService.createAppointment(appointment);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async (appointment: Appointment, { rejectWithValue }) => {
    try {
      return await appointmentService.updateAppointment(appointment);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await appointmentService.deleteAppointment(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status }: { id: string, status: string }, { rejectWithValue }) => {
    try {
      return await appointmentService.updateAppointmentStatus(id, status);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const confirmAppointment = createAsyncThunk(
  'appointments/confirm',
  async (id: string, { rejectWithValue }) => {
    try {
      return await appointmentService.confirmAppointment(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | AppointmentStatus>) => {
      state.filters.statusFilter = action.payload;
    },
    setClientFilter: (state, action: PayloadAction<string>) => {
      state.filters.clientFilter = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<'all' | AppointmentType>) => {
      state.filters.typeFilter = action.payload;
    },
    setDateFilter: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.filters.dateFilter = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    // Handle fetchAppointments
    builder.addCase(fetchAppointments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAppointments.fulfilled, (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
    });
    builder.addCase(fetchAppointments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle fetchAppointmentById
    builder.addCase(fetchAppointmentById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAppointmentById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentAppointment = action.payload;
    });
    builder.addCase(fetchAppointmentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle fetchCalendarEvents
    builder.addCase(fetchCalendarEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCalendarEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.calendarEvents = action.payload;
    });
    builder.addCase(fetchCalendarEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle fetchClientAppointments
    builder.addCase(fetchClientAppointments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClientAppointments.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedClientAppointments = action.payload;
    });
    builder.addCase(fetchClientAppointments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle fetchUpcomingAppointments
    builder.addCase(fetchUpcomingAppointments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUpcomingAppointments.fulfilled, (state, action) => {
      state.loading = false;
      state.upcomingAppointments = action.payload;
    });
    builder.addCase(fetchUpcomingAppointments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle createAppointment
    builder.addCase(createAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.appointments.push(action.payload);
    });
    builder.addCase(createAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle updateAppointment
    builder.addCase(updateAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.appointments.findIndex(
        (appointment) => appointment.id === action.payload.id
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      if (state.currentAppointment?.id === action.payload.id) {
        state.currentAppointment = action.payload;
      }
    });
    builder.addCase(updateAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle deleteAppointment
    builder.addCase(deleteAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.appointments = state.appointments.filter(
        (appointment) => appointment.id !== action.payload
      );
      if (state.currentAppointment?.id === action.payload) {
        state.currentAppointment = null;
      }
    });
    builder.addCase(deleteAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle updateAppointmentStatus
    builder.addCase(updateAppointmentStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAppointmentStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.appointments.findIndex(
        (appointment) => appointment.id === action.payload.id
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      if (state.currentAppointment?.id === action.payload.id) {
        state.currentAppointment = action.payload;
      }
    });
    builder.addCase(updateAppointmentStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle confirmAppointment
    builder.addCase(confirmAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(confirmAppointment.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.appointments.findIndex(
        (appointment) => appointment.id === action.payload.id
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      if (state.currentAppointment?.id === action.payload.id) {
        state.currentAppointment = action.payload;
      }
    });
    builder.addCase(confirmAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

// Export actions and reducer
export const {
  setSearchQuery,
  setStatusFilter,
  setClientFilter,
  setTypeFilter,
  setDateFilter,
  clearFilters
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;

// Selectors
export const selectAllAppointments = (state: { appointments: AppointmentsState }) => 
  state.appointments.appointments;

export const selectCalendarEvents = (state: { appointments: AppointmentsState }) => 
  state.appointments.calendarEvents;

export const selectUpcomingAppointments = (state: { appointments: AppointmentsState }) => 
  state.appointments.upcomingAppointments;

export const selectCurrentAppointment = (state: { appointments: AppointmentsState }) => 
  state.appointments.currentAppointment;

export const selectSelectedClientAppointments = (state: { appointments: AppointmentsState }) => 
  state.appointments.selectedClientAppointments;

export const selectAppointmentsLoading = (state: { appointments: AppointmentsState }) => 
  state.appointments.loading;

export const selectAppointmentsError = (state: { appointments: AppointmentsState }) => 
  state.appointments.error;

export const selectAppointmentsFilters = (state: { appointments: AppointmentsState }) => 
  state.appointments.filters;

// Filtered appointments selector
export const selectFilteredAppointments = (state: { appointments: AppointmentsState }) => {
  const { appointments, filters } = state.appointments;
  
  return appointments.filter((appointment) => {
    // Search query filter
    if (
      filters.searchQuery &&
      !appointment.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !appointment.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !appointment.clientName?.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Status filter
    if (
      filters.statusFilter !== 'all' &&
      appointment.status !== filters.statusFilter
    ) {
      return false;
    }
    
    // Client filter
    if (
      filters.clientFilter &&
      appointment.clientId !== filters.clientFilter
    ) {
      return false;
    }
    
    // Type filter
    if (
      filters.typeFilter !== 'all' &&
      appointment.type !== filters.typeFilter
    ) {
      return false;
    }
    
    // Date filter
    if (filters.dateFilter.startDate) {
      const appointmentDate = new Date(appointment.startTime);
      const startDate = new Date(filters.dateFilter.startDate);
      if (appointmentDate < startDate) {
        return false;
      }
    }
    
    if (filters.dateFilter.endDate) {
      const appointmentDate = new Date(appointment.startTime);
      const endDate = new Date(filters.dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      if (appointmentDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
};