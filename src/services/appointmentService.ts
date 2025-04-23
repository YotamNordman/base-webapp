import { Appointment, CalendarEvent } from '../types/appointment';

// Base API URL - would be configured from environment variables in a real app
const API_BASE_URL = 'http://localhost:5015/api';

// Helper function to get auth header
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const appointmentService = {
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },
  
  getAppointmentById: async (id: string): Promise<Appointment> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch appointment with id ${id}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  },
  
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
      
      return response.json();
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },
  
  getClientAppointments: async (clientId: string): Promise<Appointment[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/client/${clientId}`, {
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch appointments for client ${clientId}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error fetching client appointments:`, error);
      throw error;
    }
  },
  
  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/upcoming`, {
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming appointments');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  },
  
  createAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(appointment),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  updateAppointment: async (appointment: Appointment): Promise<Appointment> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(appointment),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update appointment with id ${appointment.id}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error updating appointment ${appointment.id}:`, error);
      throw error;
    }
  },
  
  deleteAppointment: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete appointment with id ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting appointment ${id}:`, error);
      throw error;
    }
  },
  
  updateAppointmentStatus: async (id: string, status: string): Promise<Appointment> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status for appointment ${id}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error updating appointment status:`, error);
      throw error;
    }
  },
  
  confirmAppointment: async (id: string): Promise<Appointment> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
        method: 'PUT',
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to confirm appointment ${id}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error confirming appointment:`, error);
      throw error;
    }
  }
};