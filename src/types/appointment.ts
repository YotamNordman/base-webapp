export interface Appointment {
  id: string;
  title: string;
  description?: string;
  coachId: string;
  clientId: string;
  clientName?: string;
  startTime: string;
  endTime: string;
  location?: string;
  status: AppointmentStatus;
  type: AppointmentType;
  workoutId?: string;
  notes?: string;
  clientConfirmed: boolean;
  reminderMinutes: number;
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
  NoShow = 'NoShow'
}

export enum AppointmentType {
  WorkoutSession = 'WorkoutSession',
  Assessment = 'Assessment',
  Consultation = 'Consultation',
  Other = 'Other'
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  clientId: string;
  clientName?: string;
  status: string;
  type: string;
  color: string;
}

export interface AppointmentFilters {
  searchQuery: string;
  statusFilter: 'all' | AppointmentStatus;
  clientFilter: string;
  typeFilter: 'all' | AppointmentType;
  dateFilter: {
    startDate: string | null;
    endDate: string | null;
  };
}