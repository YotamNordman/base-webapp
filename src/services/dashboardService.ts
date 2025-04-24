import { getApiBaseUrl, getAuthHeader as configGetAuthHeader, isMockModeEnabled } from '../config';

// Get base API URL from configuration
const API_BASE_URL = getApiBaseUrl();
// Check if we should use mock data
const USE_MOCK_DATA = isMockModeEnabled();

// Use auth header from config
const getAuthHeader = configGetAuthHeader;

// Types for dashboard data
export interface DashboardStat {
  title: string;
  value: number | string;
  icon: string;
  color: string;
}

export interface DashboardExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface DashboardWorkout {
  id: string;
  title: string;
  description: string;
  duration: number;
  date: string;
  scheduledFor: string;
  clientId: string;
  clientName: string;
  exercises: DashboardExercise[];
}

export interface DashboardClient {
  id: string;
  name: string;
  time: string;
  progress: number;
}

export interface DashboardData {
  stats: DashboardStat[];
  todaysWorkouts: DashboardWorkout[];
  upcomingClients: DashboardClient[];
}

// Mock data for development
const mockStats: DashboardStat[] = [
  {
    title: 'מתאמנים פעילים',
    value: '24',
    icon: 'PeopleIcon',
    color: 'primary'
  },
  {
    title: 'אימונים השבוע',
    value: '18',
    icon: 'FitnessCenterIcon',
    color: 'info'
  },
  {
    title: 'הכנסה חודשית',
    value: '₪ 12,500',
    icon: 'TrendingUpIcon',
    color: 'success'
  },
  {
    title: 'יעדים שהושגו',
    value: '85%',
    icon: 'CheckCircleIcon',
    color: 'warning'
  }
];

const mockTodaysWorkouts: DashboardWorkout[] = [
  {
    id: '1',
    title: 'אימון כוח מלא',
    description: 'אימון כוח לכל הגוף עם דגש על קבוצות שרירים גדולות',
    duration: 60,
    date: '2025-04-23T10:00:00',
    scheduledFor: '2025-04-23T10:00:00',
    clientId: '1',
    clientName: 'מיכל לוי',
    exercises: [
      { name: 'סקוואט', sets: 4, reps: 10, weight: 45 },
      { name: 'לחיצת חזה', sets: 3, reps: 12, weight: 30 },
      { name: 'מתח', sets: 3, reps: 8 }
    ]
  },
  {
    id: '2',
    title: 'אימון קרדיו',
    description: 'אימון בעצימות גבוהה לשיפור סיבולת לב-ריאה',
    duration: 45,
    date: '2025-04-23T14:30:00',
    scheduledFor: '2025-04-23T14:30:00',
    clientId: '2',
    clientName: 'דני כהן',
    exercises: [
      { name: 'ריצת אינטרוולים', sets: 5, reps: 1 },
      { name: 'קפיצות', sets: 3, reps: 20 },
      { name: 'אופניים', sets: 1, reps: 1 }
    ]
  }
];

const mockUpcomingClients: DashboardClient[] = [
  {
    id: '1',
    name: 'מיכל לוי',
    time: '10:00',
    progress: 85
  },
  {
    id: '2',
    name: 'דני כהן',
    time: '14:30',
    progress: 65
  },
  {
    id: '3',
    name: 'יעל גולן',
    time: '16:00',
    progress: 92
  },
  {
    id: '4',
    name: 'אלון רוט',
    time: '18:15',
    progress: 40
  }
];

export const dashboardService = {
  // Get full dashboard data in one request
  getDashboardData: async (): Promise<DashboardData> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return {
        stats: mockStats,
        todaysWorkouts: mockTodaysWorkouts,
        upcomingClients: mockUpcomingClients
      };
    }
    
    try {
      // Try to fetch from API first
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: getAuthHeader(),
      });
      
      if (response.ok) {
        return response.json();
      }
      
      // If API fails, return mock data
      console.warn('Using mock dashboard data because API call failed');
      return {
        stats: mockStats,
        todaysWorkouts: mockTodaysWorkouts,
        upcomingClients: mockUpcomingClients
      };
    } catch (error) {
      console.warn('Using mock dashboard data because API call failed:', error);
      // Return mock data on error
      return {
        stats: mockStats,
        todaysWorkouts: mockTodaysWorkouts,
        upcomingClients: mockUpcomingClients
      };
    }
  },

  // Get dashboard statistics
  getStats: async (): Promise<DashboardStat[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return mockStats;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: getAuthHeader(),
      });
      
      if (response.ok) {
        return response.json();
      }
      
      // Return mock data if API fails
      return mockStats;
    } catch (error) {
      console.warn('Using mock stats data because API call failed:', error);
      return mockStats;
    }
  },

  // Get today's workouts
  getTodaysWorkouts: async (): Promise<DashboardWorkout[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return mockTodaysWorkouts;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/todays-workouts`, {
        headers: getAuthHeader(),
      });
      
      if (response.ok) {
        return response.json();
      }
      
      // Return mock data if API fails
      return mockTodaysWorkouts;
    } catch (error) {
      console.warn('Using mock workouts data because API call failed:', error);
      return mockTodaysWorkouts;
    }
  },

  // Get upcoming clients
  getUpcomingClients: async (): Promise<DashboardClient[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return mockUpcomingClients;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/upcoming-clients`, {
        headers: getAuthHeader(),
      });
      
      if (response.ok) {
        return response.json();
      }
      
      // Return mock data if API fails
      return mockUpcomingClients;
    } catch (error) {
      console.warn('Using mock clients data because API call failed:', error);
      return mockUpcomingClients;
    }
  }
};