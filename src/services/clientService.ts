import { Client } from '../types/client';
import { devLogin } from '../utils/auth';

const API_URL = 'http://localhost:5015/api';

// Helper function to handle API errors
const handleApiError = (response: Response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// API service functions
export const clientService = {
  getClients: async (): Promise<Client[]> => {
    try {
      const token = await devLogin();
      const response = await fetch(`${API_URL}/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  getClientById: async (id: string): Promise<Client> => {
    try {
      const token = await devLogin();
      const response = await fetch(`${API_URL}/clients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  },

  createClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
    try {
      const token = await devLogin();
      const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(client)
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  updateClient: async (client: Client): Promise<Client> => {
    try {
      const token = await devLogin();
      const response = await fetch(`${API_URL}/clients/${client.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(client)
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error(`Error updating client ${client.id}:`, error);
      throw error;
    }
  },

  deleteClient: async (id: string): Promise<boolean> => {
    try {
      const token = await devLogin();
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  }
};
