import { ExerciseCategory, ExerciseTemplate } from '../types/exercise';

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

export const exerciseService = {
  // Category endpoints
  getCategories: async (): Promise<ExerciseCategory[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch exercise categories');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching exercise categories:', error);
      throw error;
    }
  },

  getCategoryById: async (id: string): Promise<ExerciseCategory> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch category with id ${id}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  createCategory: async (category: Omit<ExerciseCategory, 'id'>): Promise<ExerciseCategory> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error('Failed to create exercise category');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating exercise category:', error);
      throw error;
    }
  },

  updateCategory: async (category: ExerciseCategory): Promise<ExerciseCategory> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories/${category.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error(`Failed to update category with id ${category.id}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating category ${category.id}:`, error);
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete category with id ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  // Template endpoints
  getTemplates: async (categoryId?: string): Promise<ExerciseTemplate[]> => {
    try {
      const url = categoryId 
        ? `${API_BASE_URL}/exercises/templates?categoryId=${categoryId}`
        : `${API_BASE_URL}/exercises/templates`;
        
      const response = await fetch(url, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch exercise templates');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching exercise templates:', error);
      throw error;
    }
  },

  getTemplateById: async (id: string): Promise<ExerciseTemplate> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/templates/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch template with id ${id}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      throw error;
    }
  },

  createTemplate: async (template: Omit<ExerciseTemplate, 'id'>): Promise<ExerciseTemplate> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/templates`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(template),
      });
      if (!response.ok) {
        throw new Error('Failed to create exercise template');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating exercise template:', error);
      throw error;
    }
  },

  updateTemplate: async (template: ExerciseTemplate): Promise<ExerciseTemplate> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/templates/${template.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(template),
      });
      if (!response.ok) {
        throw new Error(`Failed to update template with id ${template.id}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating template ${template.id}:`, error);
      throw error;
    }
  },

  deleteTemplate: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/templates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete template with id ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      throw error;
    }
  }
};