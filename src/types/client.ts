export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface HealthInfo {
  height?: number;
  weight?: number;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
}

export interface MembershipDetails {
  startDate: string;
  endDate?: string;
  type?: string;
  paymentMethod?: string;
}

export interface ClientWorkout {
  id: string;
  title: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergencyContact?: EmergencyContact;
  healthInfo?: HealthInfo;
  goals?: string;
  notes?: string;
  membershipDetails?: MembershipDetails;
  profileImage?: string;
  workouts?: ClientWorkout[];
  status: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientFilter {
  status: string;
  search: string;
}