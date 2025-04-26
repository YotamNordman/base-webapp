import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  Grid, 
  TextField, 
  Typography,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MeasurementFormData } from '../../../../types/measurement';
import { uploadMeasurementPhoto } from '../../../../services/measurementService';

interface MeasurementFormProps {
  initialData?: Partial<MeasurementFormData>;
  clientId: number;
  onSubmit: (formData: MeasurementFormData) => void;
  isSubmitting?: boolean;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({
  initialData,
  clientId,
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<MeasurementFormData>({
    date: new Date().toISOString(),
    weight: 0,
    chest: null,
    waist: null,
    hips: null,
    thigh: null,
    arm: null,
    neck: null,
    frontPhoto: null,
    backPhoto: null,
    sidePhoto: null,
    notes: ''
  });
  
  const [photoUploading, setPhotoUploading] = useState<{
    front: boolean;
    back: boolean;
    side: boolean;
  }>({
    front: false,
    back: false,
    side: false
  });
  
  const [errors, setErrors] = useState<{
    weight?: string;
  }>({});
  
  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (['weight', 'chest', 'waist', 'hips', 'thigh', 'arm', 'neck'].includes(name)) {
      const numericValue = value === '' ? null : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      
      // Validate weight field
      if (name === 'weight') {
        if (!numericValue || numericValue <= 0) {
          setErrors(prev => ({ ...prev, weight: 'Weight is required and must be greater than zero' }));
        } else {
          setErrors(prev => ({ ...prev, weight: undefined }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle date change
  const handleDateChange = (value: unknown, keyboardInputValue?: string) => {
    if (value instanceof Date) {
      setFormData(prev => ({ ...prev, date: value.toISOString() }));
    }
  };
  
  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'frontPhoto' | 'backPhoto' | 'sidePhoto') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Map photo type to loading state key
    const loadingKey = type === 'frontPhoto' ? 'front' : type === 'backPhoto' ? 'back' : 'side';
    
    try {
      setPhotoUploading(prev => ({ ...prev, [loadingKey]: true }));
      
      // In a real app, this would upload to server and get back a URL
      // For this demo, we convert to base64 and store locally
      const base64 = await uploadMeasurementPhoto(file);
      
      setFormData(prev => ({ ...prev, [type]: base64 }));
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    } finally {
      setPhotoUploading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: {weight?: string} = {};
    
    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Weight is required and must be greater than zero';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };
  
  // Display image preview if available
  const renderPhotoPreview = (photoData: string | null, label: string) => {
    if (!photoData) return null;
    
    return (
      <Box mt={1} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="caption" color="textSecondary">
          {label} Preview
        </Typography>
        <Box
          component="img"
          src={photoData}
          alt={`${label} preview`}
          sx={{
            width: '100%',
            maxWidth: 200,
            height: 'auto',
            borderRadius: 1,
            border: '1px solid #ddd'
          }}
        />
      </Box>
    );
  };
  
  return (
    <Card>
      <CardHeader title="Measurement Record" />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Date */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Measurement Date"
                  value={formData.date ? new Date(formData.date) : null}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            {/* Weight */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight || ''}
                onChange={handleChange}
                variant="outlined"
                required
                error={!!errors.weight}
                helperText={errors.weight}
                inputProps={{ step: '0.1' }}
              />
            </Grid>
            
            {/* Chest */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Chest (cm)"
                name="chest"
                type="number"
                value={formData.chest || ''}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ step: '0.1' }}
              />
            </Grid>
            
            {/* Waist */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Waist (cm)"
                name="waist"
                type="number"
                value={formData.waist || ''}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ step: '0.1' }}
              />
            </Grid>
            
            {/* Hips */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hips (cm)"
                name="hips"
                type="number"
                value={formData.hips || ''}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ step: '0.1' }}
              />
            </Grid>
            
            {/* Thigh */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Thigh (cm)"
                name="thigh"
                type="number"
                value={formData.thigh || ''}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ step: '0.1' }}
              />
            </Grid>
            
            {/* Arm */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Arm (cm)"
                name="arm"
                type="number"
                value={formData.arm || ''}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ step: '0.1' }}
              />
            </Grid>
            
            {/* Neck */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Neck (cm)"
                name="neck"
                type="number"
                value={formData.neck || ''}
                onChange={handleChange}
                variant="outlined"
                inputProps={{ step: '0.1' }}
              />
            </Grid>
            
            {/* Photo Uploads */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Progress Photos
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Upload photos to track visual progress. For best results, use consistent lighting and poses.
              </Typography>
            </Grid>
            
            {/* Front Photo */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="front-photo-upload"
                  type="file"
                  onChange={(e) => handlePhotoUpload(e, 'frontPhoto')}
                />
                <label htmlFor="front-photo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    disabled={photoUploading.front}
                  >
                    {photoUploading.front ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Upload Front Photo'
                    )}
                  </Button>
                </label>
                {renderPhotoPreview(formData.frontPhoto as string, 'Front')}
              </Box>
            </Grid>
            
            {/* Back Photo */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="back-photo-upload"
                  type="file"
                  onChange={(e) => handlePhotoUpload(e, 'backPhoto')}
                />
                <label htmlFor="back-photo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    disabled={photoUploading.back}
                  >
                    {photoUploading.back ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Upload Back Photo'
                    )}
                  </Button>
                </label>
                {renderPhotoPreview(formData.backPhoto as string, 'Back')}
              </Box>
            </Grid>
            
            {/* Side Photo */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="side-photo-upload"
                  type="file"
                  onChange={(e) => handlePhotoUpload(e, 'sidePhoto')}
                />
                <label htmlFor="side-photo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    disabled={photoUploading.side}
                  >
                    {photoUploading.side ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Upload Side Photo'
                    )}
                  </Button>
                </label>
                {renderPhotoPreview(formData.sidePhoto as string, 'Side')}
              </Box>
            </Grid>
            
            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={formData.notes || ''}
                onChange={handleChange}
                variant="outlined"
                placeholder="Record any additional details such as time of day, diet changes, or how you felt"
              />
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Save Measurement'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default MeasurementForm;
