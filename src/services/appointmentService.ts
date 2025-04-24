import { Appointment, AppointmentStatus, AppointmentType, CalendarEvent } from '../types/appointment';
import { devLogin } from '../utils/auth';
import { getApiBaseUrl, getAuthHeader as configGetAuthHeader, isMockModeEnabled } from '../config';

// Get base API URL from configuration
const API_BASE_URL = getApiBaseUrl();
// Check if we should use mock data
const USE_MOCK_DATA = isMockModeEnabled();

// Helper function to get auth header
const getAuthHeader = async (): Promise<HeadersInit> => {
  const token = await devLogin();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Helper function to handle API errors
const handleApiError = (response: Response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Mock data for development when backend is not available
const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'אימון כוח שבועי',
    description: 'אימון כוח שבועי קבוע',
    coachId: 'coach-123',
    clientId: '1',
    clientName: 'John Doe',
    startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1h
    location: 'סטודיו מרכזי',
    status: AppointmentStatus.Confirmed,
    type: AppointmentType.WorkoutSession,
    workoutId: '1',
    notes: 'להביא בקבוק מים',
    clientConfirmed: true,
    reminderMinutes: 60
  },
  {
    id: '2',
    title: 'פגישת ייעוץ',
    description: 'פגישת ייעוץ תזונתי',
    coachId: 'coach-123',
    clientId: '2',
    clientName: 'Jane Smith',
    startTime: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    endTime: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 3 days from now + 30min
    location: 'זום',
    status: AppointmentStatus.Scheduled,
    type: AppointmentType.Consultation,
    notes: 'להכין יומן אכילה',
    clientConfirmed: false,
    reminderMinutes: 120
  },
  {
    id: '3',
    title: 'הערכת כושר',
    description: 'הערכת כושר ראשונית',
    coachId: 'coach-123',
    clientId: '3',
    clientName: 'Michael Johnson',
    startTime: new Date().toISOString(), // Today
    endTime: new Date(new Date().getTime() + 45 * 60 * 1000).toISOString(), // Today + 45min
    location: 'סטודיו מרכזי',
    status: AppointmentStatus.Completed,
    type: AppointmentType.Assessment,
    notes: 'בדיקות כוח ויכולת אירובית',
    clientConfirmed: true,
    reminderMinutes: 60
  },
  {
    id: '4',
    title: 'אימון ניסיון',
    description: 'אימון ניסיון ללקוח חדש',
    coachId: 'coach-123',
    clientId: '5',
    clientName: 'David Brown',
    startTime: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    endTime: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 2 days ago + 1h
    location: 'סטודיו מרכזי',
    status: AppointmentStatus.NoShow,
    type: AppointmentType.WorkoutSession,
    notes: 'לקוח לא הגיע',
    clientConfirmed: true,
    reminderMinutes: 60
  },
  {
    id: '5',
    title: 'אימון כוח',
    description: 'אימון כוח עם דגש על רגליים',
    coachId: 'coach-123',
    clientId: '1',
    clientName: 'John Doe',
    startTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    endTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 7 days from now + 1h
    location: 'סטודיו מרכזי',
    status: AppointmentStatus.Scheduled,
    type: AppointmentType.WorkoutSession,
    workoutId: '1',
    notes: '',
    clientConfirmed: false,
    reminderMinutes: 60
  }
];

// Helper function to convert appointments to calendar events
const mapAppointmentsToCalendarEvents = (appointments: Appointment[]): CalendarEvent[] => {
  return appointments.map(appointment => {
    let color = '#2196f3'; // Default blue
    
    // Set color based on status
    switch (appointment.status) {
      case AppointmentStatus.Confirmed:
        color = '#4caf50'; // Green
        break;
      case AppointmentStatus.Scheduled:
        color = '#2196f3'; // Blue
        break;
      case AppointmentStatus.Cancelled:
        color = '#f44336'; // Red
        break;
      case AppointmentStatus.Completed:
        color = '#9e9e9e'; // Grey
        break;
      case AppointmentStatus.NoShow:
        color = '#ff9800'; // Orange
        break;
    }
    
    return {
      id: appointment.id,
      title: appointment.title,
      start: appointment.startTime,
      end: appointment.endTime,
      clientId: appointment.clientId,
      clientName: appointment.clientName,
      status: appointment.status,
      type: appointment.type,
      color
    };
  });
};

// Helper function to find appointment by ID
const findMockAppointmentById = (id: string): Appointment | undefined => {
  return mockAppointments.find(appointment => appointment.id === id);
};

// Helper function to filter appointments by client ID
const filterAppointmentsByClientId = (clientId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.clientId === clientId);
};

// Helper function to get upcoming appointments (from today onwards)
const getUpcomingMockAppointments = (): Appointment[] => {
  const now = new Date();
  return mockAppointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.startTime);
      return appointmentDate >= now && appointment.status !== AppointmentStatus.Cancelled;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
};

// Helper function to filter appointments by date range
const filterAppointmentsByDateRange = (start: Date, end: Date): Appointment[] => {
  return mockAppointments.filter(appointment => {
    const appointmentStart = new Date(appointment.startTime);
    return appointmentStart >= start && appointmentStart <= end;
  });
};

export const appointmentService = {
  getAppointments: async (): Promise<Appointment[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return [...mockAppointments];
    }

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/appointments`, { headers });
      return handleApiError(response);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Return mock data on error
      return [...mockAppointments];
    }
  },
  
  getAppointmentById: async (id: string): Promise<Appointment> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      const appointment = findMockAppointmentById(id);
      if (appointment) {
        return { ...appointment };
      }
      throw new Error(`Appointment with id ${id} not found in mock data`);
    }

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, { headers });
      return handleApiError(response);
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      // Try to find appointment in mock data
      const appointment = findMockAppointmentById(id);
      if (appointment) {
        return { ...appointment };
      }
      throw error;
    }
  },
  
  getCalendarEvents: async (start: Date, end: Date): Promise<CalendarEvent[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      const filteredAppointments = filterAppointmentsByDateRange(start, end);
      return mapAppointmentsToCalendarEvents(filteredAppointments);
    }

    try {
      const startParam = start.toISOString();
      const endParam = end.toISOString();
      
      const headers = await getAuthHeader();
      const response = await fetch(
        `${API_BASE_URL}/appointments/calendar?start=${startParam}&end=${endParam}`, 
        { headers }
      );
      
      return handleApiError(response);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // If API fails, we still need to return calendar events, so convert appointments to events format
      // This ensures the calendar continues to function even during API issues
      // Filter appointments by date range
      const filteredAppointments = filterAppointmentsByDateRange(start, end);
      return mapAppointmentsToCalendarEvents(filteredAppointments);
    }
  },
  
  getClientAppointments: async (clientId: string): Promise<Appointment[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return filterAppointmentsByClientId(clientId);
    }

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/appointments/client/${clientId}`, { headers });
      return handleApiError(response);
    } catch (error) {
      console.error(`Error fetching appointments for client ${clientId}:`, error);
      // Return filtered mock data on error
      return filterAppointmentsByClientId(clientId);
    }
  },
  
  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return getUpcomingMockAppointments();
    }

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/appointments/upcoming`, { headers });
      return handleApiError(response);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      // Return mock upcoming appointments on error
      return getUpcomingMockAppointments();
    }
  },
  
  createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    // If mock mode is enabled, create in mock data
    if (USE_MOCK_DATA) {
      const newAppointment: Appointment = {
        ...appointment,
        id: `mock-appointment-${Date.now()}`
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    }

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(appointment),
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error('Error creating appointment:', error);
      // Create in mock data on error
      const newAppointment: Appointment = {
        ...appointment,
        id: `mock-appointment-${Date.now()}`
      };
      mockAppointments.push(newAppointment);
      return newAppointment;
    }
  },
  
  updateAppointment: async (appointment: Appointment): Promise<Appointment> => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/appointments/${appointment.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(appointment),
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error(`Error updating appointment ${appointment.id}:`, error);
      throw error;
    }
  },
  
  deleteAppointment: async (id: string): Promise<void> => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting appointment ${id}:`, error);
      throw error;
    }
  },
  
  updateAppointmentStatus: async (id: string, status: string): Promise<Appointment> => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status }),
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error(`Error updating status for appointment ${id}:`, error);
      throw error;
    }
  },
  
  confirmAppointment: async (id: string): Promise<Appointment> => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
        method: 'PUT',
        headers,
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error(`Error confirming appointment ${id}:`, error);
      throw error;
    }
  }
};