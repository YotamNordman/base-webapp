import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
// import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AppointmentStatus, 
  AppointmentType,
  Appointment
} from '../../../types/appointment';
import { CalendarEvent } from '../../../types/calendar';
import { 
  createAppointmentEvent, 
  updateAppointmentEvent,
  deleteAppointmentEvent
} from '../../../store/slices/calendarSlice';
import { AppDispatch } from '../../../store';

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  initialDate?: string | null;
  clientId?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  open,
  onClose,
  event,
  initialDate,
  clientId
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Form state
  const [form, setForm] = useState<{
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    status: AppointmentStatus;
    type: AppointmentType;
    workoutId: string;
    notes: string;
    clientId: string;
    clientConfirmed: boolean;
    reminderMinutes: number;
  }>({
    title: '',
    description: '',
    startTime: initialDate || new Date().toISOString().slice(0, 16),
    endTime: initialDate 
      ? new Date(new Date(initialDate).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
      : new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
    location: '',
    status: AppointmentStatus.Scheduled,
    type: AppointmentType.WorkoutSession,
    workoutId: '',
    notes: '',
    clientId: clientId || '',
    clientConfirmed: false,
    reminderMinutes: 30
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form when event changes
  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      setForm({
        title: event.title,
        description: event.extendedProps.description || '',
        startTime: startDate.toISOString().slice(0, 16),
        endTime: endDate.toISOString().slice(0, 16),
        location: event.extendedProps.location || '',
        status: event.extendedProps.status,
        type: event.extendedProps.type,
        workoutId: event.extendedProps.workoutId || '',
        notes: event.extendedProps.notes || '',
        clientId: event.extendedProps.clientId,
        clientConfirmed: event.extendedProps.clientConfirmed,
        reminderMinutes: 30 // Default value, should be retrieved from the event if available
      });
    } else if (initialDate) {
      const startDate = new Date(initialDate);
      const endDate = new Date(new Date(initialDate).getTime() + 60 * 60 * 1000);
      
      setForm(prev => ({
        ...prev,
        startTime: startDate.toISOString().slice(0, 16),
        endTime: endDate.toISOString().slice(0, 16),
        clientId: clientId || prev.clientId
      }));
    }
  }, [event, initialDate, clientId]);
  
  // Form change handler for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error for this field when it's changed
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  // Form change handler for select inputs
  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    
    if (name) {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error for this field when it's changed
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  // Switch change handler
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!form.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!form.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (new Date(form.startTime) >= new Date(form.endTime)) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    if (!form.clientId) {
      newErrors.clientId = 'Client is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setFormError(null);
    
    try {
      // Prepare the appointment data
      const appointmentData: Omit<Appointment, 'id'> = {
        title: form.title,
        description: form.description,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        status: form.status,
        type: form.type,
        workoutId: form.workoutId || undefined,
        notes: form.notes,
        clientId: form.clientId,
        coachId: 'current-user-id', // This should come from auth context
        clientConfirmed: form.clientConfirmed,
        reminderMinutes: form.reminderMinutes
      };
      
      if (event) {
        // Update existing appointment
        await dispatch(updateAppointmentEvent({ 
          id: event.id,
          appointment: appointmentData
        })).unwrap();
      } else {
        // Create new appointment
        await dispatch(createAppointmentEvent(appointmentData)).unwrap();
      }
      
      onClose();
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!event) return;
    
    setLoading(true);
    setFormError(null);
    
    try {
      await dispatch(deleteAppointmentEvent(event.id)).unwrap();
      onClose();
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {event ? 'Edit Appointment' : 'Create New Appointment'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                value={form.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={form.description}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Start Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="startTime"
                label="Start Time"
                type="datetime-local"
                fullWidth
                value={form.startTime}
                onChange={handleChange}
                error={!!errors.startTime}
                helperText={errors.startTime}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            {/* End Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="endTime"
                label="End Time"
                type="datetime-local"
                fullWidth
                value={form.endTime}
                onChange={handleChange}
                error={!!errors.endTime}
                helperText={errors.endTime}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            {/* Client ID - In a real app, this would be a client selector */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="clientId"
                label="Client ID"
                fullWidth
                value={form.clientId}
                onChange={handleChange}
                error={!!errors.clientId}
                helperText={errors.clientId}
                disabled={!!clientId}
                required
              />
            </Grid>
            
            {/* Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={form.location}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  <MenuItem value={AppointmentStatus.Scheduled}>Scheduled</MenuItem>
                  <MenuItem value={AppointmentStatus.Confirmed}>Confirmed</MenuItem>
                  <MenuItem value={AppointmentStatus.Completed}>Completed</MenuItem>
                  <MenuItem value={AppointmentStatus.Cancelled}>Cancelled</MenuItem>
                  <MenuItem value={AppointmentStatus.NoShow}>No Show</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={form.type}
                  onChange={handleSelectChange}
                  label="Type"
                >
                  <MenuItem value={AppointmentType.WorkoutSession}>Workout</MenuItem>
                  <MenuItem value={AppointmentType.Consultation}>Consultation</MenuItem>
                  <MenuItem value={AppointmentType.Assessment}>Assessment</MenuItem>
                  <MenuItem value={AppointmentType.Other}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Workout ID - Only shown for workout type */}
            {form.type === AppointmentType.WorkoutSession && (
              <Grid item xs={12} sm={6}>
                <TextField
                  name="workoutId"
                  label="Workout ID"
                  fullWidth
                  value={form.workoutId}
                  onChange={handleChange}
                />
              </Grid>
            )}
            
            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                fullWidth
                multiline
                rows={3}
                value={form.notes}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Client Confirmed */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="clientConfirmed"
                    checked={form.clientConfirmed}
                    onChange={handleSwitchChange}
                  />
                }
                label="Client Confirmed"
              />
            </Grid>
            
            {/* Reminder Minutes */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="reminderMinutes"
                label="Reminder (minutes before)"
                type="number"
                fullWidth
                value={form.reminderMinutes}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            {/* Error message */}
            {formError && (
              <Grid item xs={12}>
                <FormHelperText error>{formError}</FormHelperText>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions>
          {event && (
            <Button 
              onClick={handleDelete} 
              color="error"
              disabled={loading}
            >
              Delete
            </Button>
          )}
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Loading...' : (event ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AppointmentForm;