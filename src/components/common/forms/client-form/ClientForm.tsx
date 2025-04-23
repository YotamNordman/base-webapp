import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  FormHelperText,
  Paper,
  Typography,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import { Client } from '../../../../types/client';
import { PhotoCamera } from '@mui/icons-material';

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: Omit<Client, 'id'>) => void;
  isLoading?: boolean;
  error?: string | null;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle date input changes
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.firstName) newErrors.firstName = 'שם פרטי הוא שדה חובה';
    if (!formData.lastName) newErrors.lastName = 'שם משפחה הוא שדה חובה';
    if (!formData.email) newErrors.email = 'אימייל הוא שדה חובה';
    if (!formData.phone) newErrors.phone = 'טלפון הוא שדה חובה';
    if (!formData.startDate) newErrors.startDate = 'תאריך התחלה הוא שדה חובה';
    
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    
    // Phone validation - simple check for now
    if (formData.phone && !/^[0-9-+\s()]*$/.test(formData.phone)) {
      newErrors.phone = 'מספר טלפון לא תקין';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Type assertion to ensure all required fields are present
      const clientData = formData as Omit<Client, 'id'>;
      onSubmit(clientData);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload the file to a server and get a URL back
      // For now, we'll use a placeholder
      setFormData(prev => ({
        ...prev,
        profileImage: URL.createObjectURL(e.target.files![0])
      }));
    }
  };
  
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="h6" gutterBottom>
          פרטים אישיים
        </Typography>
        
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="firstName"
              name="firstName"
              label="שם פרטי"
              value={formData.firstName || ''}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              name="lastName"
              label="שם משפחה"
              value={formData.lastName || ''}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="אימייל"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="phone"
              name="phone"
              label="טלפון"
              value={formData.phone || ''}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="birthDate"
              name="birthDate"
              label="תאריך לידה"
              type="date"
              value={formData.birthDate || ''}
              onChange={handleDateInputChange}
              error={!!errors.birthDate}
              helperText={errors.birthDate || 'DD/MM/YYYY'}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">מגדר</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={formData.gender || ''}
                label="מגדר"
                onChange={handleChange}
              >
                <MenuItem value="male">זכר</MenuItem>
                <MenuItem value="female">נקבה</MenuItem>
                <MenuItem value="other">אחר</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="startDate"
              name="startDate"
              label="תאריך התחלה"
              type="date"
              value={formData.startDate || ''}
              onChange={handleDateInputChange}
              error={!!errors.startDate}
              helperText={errors.startDate || 'DD/MM/YYYY'}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">סטטוס</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status || 'active'}
                label="סטטוס"
                onChange={handleChange}
              >
                <MenuItem value="active">פעיל</MenuItem>
                <MenuItem value="inactive">לא פעיל</MenuItem>
                <MenuItem value="pending">ממתין</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="address"
              name="address"
              label="כתובת"
              value={formData.address || ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          פרטים נוספים
        </Typography>
        
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="emergencyContact"
              name="emergencyContact"
              label="איש קשר לשעת חירום"
              placeholder="שם ומספר טלפון"
              value={formData.emergencyContact || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="healthInfo"
              name="healthInfo"
              label="מידע רפואי"
              multiline
              rows={3}
              placeholder="מידע על בעיות רפואיות, מגבלות, אלרגיות וכו'"
              value={formData.healthInfo || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="goals"
              name="goals"
              label="מטרות"
              multiline
              rows={3}
              placeholder="מטרות האימון, יעדים, שאיפות"
              value={formData.goals || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="notes"
              name="notes"
              label="הערות"
              multiline
              rows={3}
              placeholder="הערות נוספות, העדפות אימון, מידע רלוונטי"
              value={formData.notes || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
              >
                העלאת תמונת פרופיל
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              
              {formData.profileImage && (
                <Box ml={2} display="flex" alignItems="center">
                  <Typography variant="body2" color="text.secondary" mr={1}>
                    תמונה נבחרה
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        
        <Box display="flex" justifyContent="flex-end">
          <Button
            type="button"
            variant="outlined"
            sx={{ ml: 2 }}
            disabled={isLoading}
          >
            ביטול
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'טוען...' : initialData.id ? 'עדכון מתאמן' : 'הוספת מתאמן'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ClientForm;
