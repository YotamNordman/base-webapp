export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  startDate: string;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
  address?: string;
  emergencyContact?: string;
  healthInfo?: string;
  goals?: string;
  profileImage?: string;
}

export interface ClientFilter {
  status: string;
  search: string;
}
