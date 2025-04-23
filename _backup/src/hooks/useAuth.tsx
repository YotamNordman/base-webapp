import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Define User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Auth context interface
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {}
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Check for admin token
        if (token === 'mock-jwt-token-for-admin-user') {
          // Set admin user
          setUser({
            id: 'admin',
            name: 'מנהל מערכת',
            email: 'admin',
            role: 'coach'
          });
          setLoading(false);
          return;
        }
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user info from the API
        const response = await axios.get('/api/auth/me');
        
        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add admin/admin hardcoded credentials
      if (email === 'admin' && password === 'admin') {
        // Mock user and token for admin
        const mockUser = {
          id: 'admin',
          name: 'מנהל מערכת',
          email: 'admin',
          role: 'coach'
        };
        const mockToken = 'mock-jwt-token-for-admin-user';
        
        // Save token and set auth header
        localStorage.setItem('token', mockToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        setUser(mockUser);
        setLoading(false);
        return;
      }
      
      // Regular API authentication
      const response = await axios.post('/api/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // Save token and set auth header
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'התחברות נכשלה. נא לנסות שוב.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
