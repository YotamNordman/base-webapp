import { CalendarEvent, appointmentToCalendarEvent } from '../types/calendar';
import { Appointment } from '../types/appointment';
import { getAuthHeader } from '../utils';

const API_BASE_URL = 'http://localhost:5015/api';

export const calendarService = {
  appointmentToCalendarEvent,
  // Get calendar events for a specific date range
  getCalendarEvents: async (start: Date, end: Date): Promise<CalendarEvent[]> => {
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
      throw error;
    }
  },
  
  // Get calendar events for specific client
  getClientCalendarEvents: async (clientId: string): Promise<CalendarEvent[]> => {
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
      throw error;
    }
  },
  
  // Create a new appointment
  createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
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
      throw error;
    }
  },
  
  // Update an existing appointment
  updateAppointment: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
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
      throw error;
    }
  },
  
  // Delete an appointment
  deleteAppointment: async (id: string): Promise<void> => {
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
      throw error;
    }
  },
};