export { default as rtlPlugin } from './rtlPlugin';
export { logger } from './logger';
export { markAsUnused, isPresent } from './codeUtils';

// Get auth header for API requests
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};
