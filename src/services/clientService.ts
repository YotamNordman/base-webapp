import { Client } from '../types/client';
import { devLogin } from '../utils/auth';
import { getApiBaseUrl, isMockModeEnabled } from '../config';

// Get base API URL from configuration
const API_BASE_URL = getApiBaseUrl();
// Check if we should use mock data
const USE_MOCK_DATA = isMockModeEnabled();

// Mock data for development when backend is not available
const mockClients: Client[] = [
  {
    id: '1',
    firstName: 'ג\'ון',
    lastName: 'דו',
    email: 'john.doe@example.com',
    phone: '050-1234567',
    birthDate: new Date('1990-01-15').toISOString(),
    gender: 'male',
    address: 'רחוב הרצל 15, תל אביב',
    emergencyContact: {
      name: 'ג\'יין דו',
      phone: '052-7654321',
      relation: 'אישה'
    },
    healthInfo: {
      height: 180,
      weight: 75,
      medicalConditions: 'אין',
      allergies: 'אין',
      medications: 'אין'
    },
    goals: 'הגדלת מסת שריר, חיזוק הגב',
    notes: 'מתאמן 3 פעמים בשבוע',
    membershipDetails: {
      startDate: new Date('2023-01-10').toISOString(),
      endDate: new Date('2023-12-31').toISOString(),
      type: 'פרימיום',
      paymentMethod: 'כרטיס אשראי'
    },
    profileImage: 'https://example.com/profiles/john.jpg',
    workouts: [
      { id: '1', title: 'אימון כוח שבועי' },
      { id: '2', title: 'אימון גב וכתפיים' }
    ],
    status: "active",
    createdAt: new Date('2023-01-10').toISOString(),
    updatedAt: new Date('2023-05-22').toISOString()
  },
  {
    id: '2',
    firstName: 'ג\'יין',
    lastName: 'סמית',
    email: 'jane.smith@example.com',
    phone: '054-9876543',
    birthDate: new Date('1992-07-22').toISOString(),
    gender: "female",
    address: 'רחוב אלנבי 45, תל אביב',
    emergencyContact: {
      name: 'מייק סמית',
      phone: '050-1122334',
      relation: 'אח'
    },
    healthInfo: {
      height: 165,
      weight: 62,
      medicalConditions: 'אסטמה קלה',
      allergies: 'אבק',
      medications: 'משאף לפי הצורך'
    },
    goals: 'שיפור סיבולת, הפחתת אחוזי שומן',
    notes: 'מעדיפה אימוני בוקר',
    membershipDetails: {
      startDate: new Date('2023-02-15').toISOString(),
      endDate: new Date('2023-08-15').toISOString(),
      type: 'בסיסי',
      paymentMethod: 'הוראת קבע'
    },
    profileImage: 'https://example.com/profiles/jane.jpg',
    workouts: [
      { id: '3', title: 'אימון אירובי' },
      { id: '4', title: 'אימון היט' }
    ],
    status: "active",
    createdAt: new Date('2023-02-15').toISOString(),
    updatedAt: new Date('2023-06-01').toISOString()
  },
  {
    id: '3',
    firstName: 'מייקל',
    lastName: 'ג\'ונסון',
    email: 'michael.johnson@example.com',
    phone: '053-5566778',
    birthDate: new Date('1985-03-10').toISOString(),
    gender: "male",
    address: 'רחוב דיזנגוף 120, תל אביב',
    emergencyContact: {
      name: 'שרה ג\'ונסון',
      phone: '053-6677889',
      relation: 'אחות'
    },
    healthInfo: {
      height: 190,
      weight: 88,
      medicalConditions: 'כאבי גב תחתון',
      allergies: 'אין',
      medications: 'אין'
    },
    goals: 'שיקום גב, בניית כוח כללי',
    notes: 'לשים לב לתרגילים עם עומס על הגב',
    membershipDetails: {
      startDate: new Date('2022-11-01').toISOString(),
      endDate: new Date('2023-11-01').toISOString(),
      type: 'פרימיום',
      paymentMethod: 'כרטיס אשראי'
    },
    profileImage: 'https://example.com/profiles/michael.jpg',
    workouts: [
      { id: '5', title: 'אימון שיקומי' },
      { id: '6', title: 'אימון ליבה' }
    ],
    status: "active",
    createdAt: new Date('2022-11-01').toISOString(),
    updatedAt: new Date('2023-04-15').toISOString()
  }
];

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
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return [...mockClients];
    }

    try {
      const token = await devLogin();
      const response = await fetch(`${API_BASE_URL}/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error('Error fetching clients:', error);
      // Return mock data on error
      return [...mockClients];
    }
  },

  getClientById: async (id: string): Promise<Client> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      const client = mockClients.find(client => client.id === id);
      if (client) {
        return { ...client };
      }
      throw new Error(`Client with id ${id} not found in mock data`);
    }

    try {
      const token = await devLogin();
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return handleApiError(response);
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      // Try to find client in mock data
      const client = mockClients.find(client => client.id === id);
      if (client) {
        return { ...client };
      }
      throw error;
    }
  },

  createClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
    // If mock mode is enabled, create in mock data
    if (USE_MOCK_DATA) {
      const newClient: Client = {
        ...client,
        id: `mock-client-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockClients.push(newClient);
      return newClient;
    }

    try {
      const token = await devLogin();
      const response = await fetch(`${API_BASE_URL}/clients`, {
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
      // Create in mock data on error
      const newClient: Client = {
        ...client,
        id: `mock-client-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockClients.push(newClient);
      return newClient;
    }
  },

  updateClient: async (client: Client): Promise<Client> => {
    // If mock mode is enabled, update in mock data
    if (USE_MOCK_DATA) {
      const index = mockClients.findIndex(c => c.id === client.id);
      if (index !== -1) {
        const updatedClient = {
          ...client,
          updatedAt: new Date().toISOString()
        };
        mockClients[index] = updatedClient;
        return updatedClient;
      }
      throw new Error(`Client with id ${client.id} not found in mock data`);
    }

    try {
      const token = await devLogin();
      const response = await fetch(`${API_BASE_URL}/clients/${client.id}`, {
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
      // Update in mock data on error
      const index = mockClients.findIndex(c => c.id === client.id);
      if (index !== -1) {
        const updatedClient = {
          ...client,
          updatedAt: new Date().toISOString()
        };
        mockClients[index] = updatedClient;
        return updatedClient;
      }
      throw error;
    }
  },

  deleteClient: async (id: string): Promise<boolean> => {
    // If mock mode is enabled, delete from mock data
    if (USE_MOCK_DATA) {
      const index = mockClients.findIndex(c => c.id === id);
      if (index !== -1) {
        mockClients.splice(index, 1);
        return true;
      }
      throw new Error(`Client with id ${id} not found in mock data`);
    }

    try {
      const token = await devLogin();
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
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
      // Delete from mock data on error
      const index = mockClients.findIndex(c => c.id === id);
      if (index !== -1) {
        mockClients.splice(index, 1);
        return true;
      }
      throw error;
    }
  }
};
