import { TrainingBlock } from '../types/trainingBlock';

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

export const trainingBlockService = {
  getBlocks: async (): Promise<TrainingBlock[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch training blocks');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching training blocks:', error);
      throw error;
    }
  },

  getTemplates: async (): Promise<TrainingBlock[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/templates`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch training block templates');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching training block templates:', error);
      throw error;
    }
  },

  getBlockById: async (id: string): Promise<TrainingBlock> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch training block with id ${id}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching training block ${id}:`, error);
      throw error;
    }
  },

  createBlock: async (block: Omit<TrainingBlock, 'id' | 'createdAt'>): Promise<TrainingBlock> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(block),
      });
      if (!response.ok) {
        throw new Error('Failed to create training block');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating training block:', error);
      throw error;
    }
  },

  updateBlock: async (block: TrainingBlock): Promise<TrainingBlock> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/${block.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(block),
      });
      if (!response.ok) {
        throw new Error(`Failed to update training block with id ${block.id}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating training block ${block.id}:`, error);
      throw error;
    }
  },

  deleteBlock: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete training block with id ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting training block ${id}:`, error);
      throw error;
    }
  },

  assignBlockToClient: async (blockId: string, clientId: string): Promise<TrainingBlock> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/${blockId}/assign/${clientId}`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to assign training block to client`);
      }
      return response.json();
    } catch (error) {
      console.error('Error assigning training block:', error);
      throw error;
    }
  }
};