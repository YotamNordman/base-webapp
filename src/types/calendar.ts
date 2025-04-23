import { Appointment, AppointmentStatus, AppointmentType } from './appointment';

// Calendar-specific event type that maps to FullCalendar's EventInput
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  color?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    clientId: string;
    clientName?: string;
    description?: string;
    location?: string;
    status: AppointmentStatus;
    type: AppointmentType;
    workoutId?: string;
    notes?: string;
    clientConfirmed: boolean;
  };
}

// Utility function to convert Appointment to CalendarEvent
export const appointmentToCalendarEvent = (appointment: Appointment): CalendarEvent => {
  const eventColor = getEventColorByType(appointment.type);
  
  return {
    id: appointment.id,
    title: appointment.title,
    start: appointment.startTime,
    end: appointment.endTime,
    color: eventColor,
    extendedProps: {
      clientId: appointment.clientId,
      clientName: appointment.clientName,
      description: appointment.description,
      location: appointment.location,
      status: appointment.status,
      type: appointment.type,
      workoutId: appointment.workoutId,
      notes: appointment.notes,
      clientConfirmed: appointment.clientConfirmed
    }
  };
};

// Get event color based on appointment type
export const getEventColorByType = (type: AppointmentType): string => {
  switch (type) {
    case AppointmentType.WorkoutSession:
      return '#4caf50'; // Green
    case AppointmentType.Consultation:
      return '#2196f3'; // Blue
    case AppointmentType.Assessment:
      return '#ff9800'; // Orange
    case AppointmentType.Other:
    default:
      return '#9e9e9e'; // Grey
  }
};