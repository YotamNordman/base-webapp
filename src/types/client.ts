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
  id: string | number; // Allow both string and number for compatibility
  title: string;
}

export interface Client {
  id: string | number; // Allow both string and number for compatibility
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

// Pagination params for API requests
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Metadata for paginated responses
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Standard API response format
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  errors: ApiError[] | null;
  meta: any | null;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}