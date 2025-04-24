/**
 * API configuration
 * 
 * This file contains all API-related configuration. It uses environment variables
 * when available, otherwise falls back to default values for local development.
 */

// Default API URL (local development)
const DEFAULT_API_URL = 'http://localhost:5000/api';

/**
 * Get the base API URL based on environment variables
 * Uses process.env.REACT_APP_API_URL when available (from .env file or environment)
 * Otherwise falls back to the default URL for local development
 * 
 * @returns The API base URL or 'mock' to use mock data
 */
export const getApiBaseUrl = (): string => {
  return process.env.REACT_APP_API_URL || DEFAULT_API_URL;
};

/**
 * Check if we should use mock data instead of real API calls
 * This is useful for development without a backend
 * 
 * @returns True if mock mode is enabled
 */
export const isMockModeEnabled = (): boolean => {
  return process.env.REACT_APP_API_URL === 'mock';
};

/**
 * Get auth headers for API requests
 * @returns Headers with authorization token
 */
export const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

/**
 * Configuration object for API timeouts 
 */
export const API_TIMEOUTS = {
  DEFAULT: 10000,  // 10 seconds
  LONG: 30000,     // 30 seconds for larger operations
};

const apiConfig = {
  getApiBaseUrl,
  getAuthHeader,
  isMockModeEnabled,
  API_TIMEOUTS
};

export default apiConfig;