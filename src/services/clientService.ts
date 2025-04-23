import { Client } from '../types/client';

// Mock data for development
const mockClients: Client[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '050-1234567',
    birthDate: '1990-05-15',
    gender: 'male',
    startDate: '2023-01-10',
    status: 'active',
    notes: 'Interested in strength training',
    address: 'Tel Aviv, Israel',
    emergencyContact: 'Jane Doe, 050-7654321',
    healthInfo: 'No major health issues',
    goals: 'Build muscle, improve endurance',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '052-1234567',
    birthDate: '1985-08-22',
    gender: 'female',
    startDate: '2023-02-15',
    status: 'active',
    notes: 'Prefers morning sessions',
    address: 'Haifa, Israel',
    emergencyContact: 'John Smith, 052-7654321',
    healthInfo: 'Mild knee issues',
    goals: 'Lose weight, tone muscles',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: '054-1234567',
    birthDate: '1992-01-30',
    gender: 'male',
    startDate: '2023-03-05',
    status: 'inactive',
    notes: 'Focusing on rehabilitation',
    address: 'Jerusalem, Israel',
    emergencyContact: 'Sarah Johnson, 054-7654321',
    healthInfo: 'Recovering from shoulder injury',
    goals: 'Rehabilitation, maintain fitness',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@example.com',
    phone: '050-2345678',
    birthDate: '1988-11-12',
    gender: 'female',
    startDate: '2023-04-20',
    status: 'active',
    notes: 'Training for marathon',
    address: 'Beer Sheva, Israel',
    emergencyContact: 'David Williams, 050-8765432',
    healthInfo: 'No health issues',
    goals: 'Improve running performance, endurance',
    profileImage: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '053-3456789',
    birthDate: '1995-07-08',
    gender: 'male',
    startDate: '2023-05-30',
    status: 'pending',
    notes: 'New client, initial assessment needed',
    address: 'Netanya, Israel',
    emergencyContact: 'Lisa Brown, 053-9876543',
    healthInfo: 'Asthma, needs monitoring during intense exercise',
    goals: 'General fitness improvement',
    profileImage: 'https://randomuser.me/api/portraits/men/5.jpg'
  }
];

// API service functions
export const clientService = {
  getClients: async (): Promise<Client[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockClients), 500);
    });
  },

  getClientById: async (id: string): Promise<Client> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const client = mockClients.find(c => c.id === id);
        if (client) {
          resolve(client);
        } else {
          reject(new Error('Client not found'));
        }
      }, 500);
    });
  },

  createClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClient = {
          ...client,
          id: Math.random().toString(36).substr(2, 9)
        };
        resolve(newClient);
      }, 500);
    });
  },

  updateClient: async (client: Client): Promise<Client> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockClients.findIndex(c => c.id === client.id);
        if (index !== -1) {
          resolve(client);
        } else {
          reject(new Error('Client not found'));
        }
      }, 500);
    });
  },

  deleteClient: async (id: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockClients.findIndex(c => c.id === id);
        if (index !== -1) {
          resolve(true);
        } else {
          reject(new Error('Client not found'));
        }
      }, 500);
    });
  }
};
