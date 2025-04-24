import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton, 
  Alert,
  Container
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { logger } from '../../utils';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  
  // Display auth errors
  React.useEffect(() => {
    if (authError) {
      setLoginError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      logger.error('Login form error:', error);
      setLoginError(error.message || 'התחברות נכשלה. אנא בדוק את שם המשתמש והסיסמה');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: 450, boxShadow: 3 }}>
        <CardContent sx={{ padding: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Base
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              מערכת ניהול מאמנים ומתאמנים
            </Typography>
          </Box>
          
          {loginError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {loginError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="שם משתמש או אימייל"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              inputProps={{ dir: 'ltr' }}
              placeholder="הכנס אימייל"
            />
            
            <TextField
              label="סיסמה"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputProps={{ dir: 'ltr' }}
              placeholder="הכנס סיסמה"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ mt: 3 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                disabled={loading}
              >
                {loading ? 'מתחבר...' : 'התחבר'}
              </Button>
            </Box>
            
            <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center' }}>
              שם משתמש: admin | סיסמה: admin
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;