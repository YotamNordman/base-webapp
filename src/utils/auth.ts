// Simple utility for temporary login during development
export const devLogin = async (): Promise<string> => {
  try {
    // Check if we already have a valid token
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      return existingToken;
    }
    
    // If no token, login and get a new one
    const response = await fetch('http://localhost:5015/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin',
        password: 'admin',
      }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.token) {
      throw new Error('No token received from server');
    }
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user || {}));
    
    return data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Authentication failed. Please check server connection.');
  }
};