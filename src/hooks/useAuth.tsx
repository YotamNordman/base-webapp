import React from 'react';
import { logger } from '../utils';

// Define user type to match backend
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Create a context for authentication
const AuthContext = React.createContext<{
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}>({
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  login: async () => {},
  logout: () => {}
});

// Base API URL - must match other services
const API_BASE_URL = 'http://localhost:5015/api';

// Real authentication provider communicating with backend
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Check localStorage for existing token on initial load
  React.useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      logger.info('Attempting login with:', { email });
      
      // Match backend model - uses Email, not email
      const payload = {
        Email: email,
        Password: password
      };
      
      logger.info('Sending auth payload');
      
      // Improved request with proper CORS handling
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      
      logger.info('Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Login failed response:', errorText);
        let errorMessage = 'התחברות נכשלה';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If can't parse as JSON, use the error text
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      logger.info('Login successful, user:', data.user);
      
      if (!data.token) {
        throw new Error('No authentication token received from server');
      }
      
      setUser(data.user);
      setToken(data.token);
      
      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err: any) {
      logger.error('Login error:', err);
      setError(err.message || 'התחברות נכשלה. נא לנסות שוב.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      loading, 
      isAuthenticated: !!token,
      error,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  return React.useContext(AuthContext);
};
