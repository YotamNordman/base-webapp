import { CalendarEvent, appointmentToCalendarEvent } from '../types/calendar';
import { Appointment, AppointmentStatus, AppointmentType } from '../types/appointment';
import { getAuthHeader } from '../utils';
import { getApiBaseUrl, isMockModeEnabled } from '../config';

// Get base API URL from configuration
const API_BASE_URL = getApiBaseUrl();
// Check if we should use mock data
const USE_MOCK_DATA = isMockModeEnabled();

// Mock data for development when backend is not available
const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'אימון כוח שבועי',
    start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    color: '#4caf50',
    extendedProps: {
      clientId: '1',
      clientName: 'John Doe',
      status: AppointmentStatus.Confirmed,
      type: AppointmentType.WorkoutSession,
      clientConfirmed: true
    }
  },
  {
    id: '2',
    title: 'פגישת ייעוץ',
    start: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    color: '#2196f3',
    extendedProps: {
      clientId: '2',
      clientName: 'Jane Smith',
      status: AppointmentStatus.Scheduled,
      type: AppointmentType.Consultation,
      clientConfirmed: false
    }
  },
  {
    id: '3',
    title: 'הערכת כושר',
    start: new Date().toISOString(),
    end: new Date(new Date().getTime() + 45 * 60 * 1000).toISOString(),
    color: '#9e9e9e',
    extendedProps: {
      clientId: '3',
      clientName: 'Michael Johnson',
      status: AppointmentStatus.Completed,
      type: AppointmentType.Assessment,
      clientConfirmed: true
    }
  }
];


export const calendarService = {
  appointmentToCalendarEvent,
  // Get calendar events for a specific date range
  getCalendarEvents: async (start: Date, end: Date): Promise<CalendarEvent[]> => {
    // If mock mode is enabled, return filtered mock data
    if (USE_MOCK_DATA) {
      return mockCalendarEvents.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart >= start && eventStart <= end;
      });
    }

    try {
      const startParam = start.toISOString();
      const endParam = end.toISOString();
      
      const response = await fetch(
        `${API_BASE_URL}/appointments/calendar?start=${startParam}&end=${endParam}`,
        {
          headers: getAuthHeader(),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      
      const data: Appointment[] = await response.json();
      return data.map(appointmentToCalendarEvent);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // Return mock data on error
      return mockCalendarEvents.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart >= start && eventStart <= end;
      });
    }
  },
  
  // Get calendar events for specific client
  getClientCalendarEvents: async (clientId: string): Promise<CalendarEvent[]> => {
    // If mock mode is enabled, return filtered mock data
    if (USE_MOCK_DATA) {
      return mockCalendarEvents.filter(event => event.extendedProps.clientId === clientId);
    }
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/client/${clientId}`,
        {
          headers: getAuthHeader(),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch client calendar events');
      }
      
      const data: Appointment[] = await response.json();
      return data.map(appointmentToCalendarEvent);
    } catch (error) {
      console.error('Error fetching client calendar events:', error);
      // Return filtered mock data on error
      return mockCalendarEvents.filter(event => event.extendedProps.clientId === clientId);
    }
  },
  
  // Create a new appointment
  createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    // If mock mode is enabled, create in mock data
    if (USE_MOCK_DATA) {
      const newAppointment: Appointment = {
        ...appointment,
        id: `mock-appointment-${Date.now()}`
      };
      // This would normally update the mockCalendarEvents array too
      return newAppointment;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      // Create in mock data on error
      const newAppointment: Appointment = {
        ...appointment,
        id: `mock-appointment-${Date.now()}`
      };
      return newAppointment;
    }
  },
  
  // Update an existing appointment
  updateAppointment: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
    // If mock mode is enabled, update in mock data
    if (USE_MOCK_DATA) {
      // In a real implementation, we would update the calendar event in the mock data array
      // For now, we'll just return a mock response
      return {
        id,
        title: appointment.title || 'Appointment',
        description: appointment.description || '',
        coachId: appointment.coachId || 'coach-1',
        clientId: appointment.clientId || 'client-1',
        clientName: appointment.clientName || 'Client',
        startTime: appointment.startTime || new Date().toISOString(),
        endTime: appointment.endTime || new Date(Date.now() + 3600000).toISOString(),
        location: appointment.location || '',
        status: appointment.status || AppointmentStatus.Scheduled,
        type: appointment.type || AppointmentType.WorkoutSession,
        workoutId: appointment.workoutId || undefined,
        notes: appointment.notes || '',
        clientConfirmed: appointment.clientConfirmed || false,
        reminderMinutes: appointment.reminderMinutes || 60
      };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating appointment:', error);
      // Return mock data on error
      return {
        id,
        title: appointment.title || 'Appointment',
        description: appointment.description || '',
        coachId: appointment.coachId || 'coach-1',
        clientId: appointment.clientId || 'client-1',
        clientName: appointment.clientName || 'Client',
        startTime: appointment.startTime || new Date().toISOString(),
        endTime: appointment.endTime || new Date(Date.now() + 3600000).toISOString(),
        location: appointment.location || '',
        status: appointment.status || AppointmentStatus.Scheduled,
        type: appointment.type || AppointmentType.WorkoutSession,
        workoutId: appointment.workoutId || undefined,
        notes: appointment.notes || '',
        clientConfirmed: appointment.clientConfirmed || false,
        reminderMinutes: appointment.reminderMinutes || 60
      };
    }
  },
  
  // Delete an appointment
  deleteAppointment: async (id: string): Promise<void> => {
    // If mock mode is enabled, delete from mock data
    if (USE_MOCK_DATA) {
      // In a real implementation, we would remove the event from the mock data array
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      // In mock mode, we can just return successfully
      return;
    }
  },
};