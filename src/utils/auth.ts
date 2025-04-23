// Simple utility for temporary login during development
export const devLogin = async (): Promise<boolean> => {
  try {
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
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};