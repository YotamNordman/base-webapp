import { TrainingBlock, TrainingWeek } from '../types/trainingBlock';

// Base API URL - would be configured from environment variables in a real app
const API_BASE_URL = 'http://localhost:5015/api';

// Helper function to get auth header
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Mock data for development when backend is not available
const mockTrainingBlocks: TrainingBlock[] = [
  {
    id: '1',
    title: 'תוכנית בניית מסה',
    description: 'תוכנית 6 שבועות לבניית מסת שריר',
    coachId: 'coach-123',
    clientId: '1',
    clientName: 'John Doe',
    createdAt: new Date('2023-09-01').toISOString(),
    startDate: new Date('2023-09-10').toISOString(),
    endDate: new Date('2023-10-22').toISOString(),
    goal: 'הגדלת מסת שריר והגברת כוח כללי',
    notes: 'להקפיד על תזונה עשירה בחלבון ומנוחה מספקת',
    isTemplate: false,
    weeks: [
      {
        id: 'week-1',
        title: 'שבוע הסתגלות',
        description: 'אימונים קלים יותר להסתגלות',
        blockId: '1',
        weekNumber: 1,
        notes: 'להתמקד בטכניקה ולא במשקלים כבדים',
        workouts: [
          {
            id: 'w1-1',
            title: 'אימון רגליים',
            description: 'דגש על פיתוח רגליים וישבן',
            coachId: 'coach-123',
            clientId: '1',
            clientName: 'John Doe',
            createdAt: new Date('2023-09-10').toISOString(),
            scheduledFor: new Date('2023-09-11').toISOString(),
            completed: true,
            exercises: [
              {
                id: 'ex1',
                name: 'סקוואט',
                sets: 3,
                reps: 10,
                weight: 50,
                restTime: 90,
                notes: 'חימום עם 30 ק"ג'
              },
              {
                id: 'ex2',
                name: 'לאנג׳',
                sets: 3,
                reps: 10,
                weight: 20,
                restTime: 60
              }
            ],
            duration: 45
          },
          {
            id: 'w1-2',
            title: 'אימון חזה וכתפיים',
            description: 'פיתוח פלג גוף עליון',
            coachId: 'coach-123',
            clientId: '1',
            clientName: 'John Doe',
            createdAt: new Date('2023-09-10').toISOString(),
            scheduledFor: new Date('2023-09-13').toISOString(),
            completed: true,
            exercises: [
              {
                id: 'ex3',
                name: 'לחיצת חזה',
                sets: 3,
                reps: 10,
                weight: 60,
                restTime: 90
              },
              {
                id: 'ex4',
                name: 'פרפר',
                sets: 3,
                reps: 12,
                weight: 15,
                restTime: 60
              }
            ],
            duration: 50
          }
        ]
      },
      {
        id: 'week-2',
        title: 'שבוע העלאת עצימות',
        description: 'הגדלת עומסים והוספת תרגילים',
        blockId: '1',
        weekNumber: 2,
        notes: 'להתחיל להעלות משקלים בהדרגה',
        workouts: [
          {
            id: 'w2-1',
            title: 'אימון רגליים מתקדם',
            description: 'תרגילים מורכבים לרגליים',
            coachId: 'coach-123',
            clientId: '1',
            clientName: 'John Doe',
            createdAt: new Date('2023-09-17').toISOString(),
            scheduledFor: new Date('2023-09-18').toISOString(),
            completed: true,
            exercises: [
              {
                id: 'ex5',
                name: 'סקוואט',
                sets: 4,
                reps: 8,
                weight: 60,
                restTime: 120,
                notes: 'להקפיד על טכניקה'
              },
              {
                id: 'ex6',
                name: 'דדליפט',
                sets: 3,
                reps: 8,
                weight: 80,
                restTime: 120
              }
            ],
            duration: 60
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'חיטוב ושריפת שומן',
    description: 'תוכנית 8 שבועות לחיטוב והורדת אחוזי שומן',
    coachId: 'coach-123',
    clientId: '2',
    clientName: 'Jane Smith',
    createdAt: new Date('2023-08-15').toISOString(),
    startDate: new Date('2023-08-20').toISOString(),
    endDate: new Date('2023-10-15').toISOString(),
    goal: 'הורדת אחוזי שומן וחיטוב שרירים',
    notes: 'לשלב אימוני קרדיו ולהקפיד על דיאטה מאוזנת',
    isTemplate: false,
    weeks: [
      {
        id: 'week-3',
        title: 'שבוע היכרות',
        description: 'אימונים מגוונים להיכרות',
        blockId: '2',
        weekNumber: 1,
        notes: 'להתמקד בהרגלים נכונים ודופק גבוה',
        workouts: [
          {
            id: 'w3-1',
            title: 'אימון היט',
            description: 'אימון אינטרוולים בעצימות גבוהה',
            coachId: 'coach-123',
            clientId: '2',
            clientName: 'Jane Smith',
            createdAt: new Date('2023-08-20').toISOString(),
            scheduledFor: new Date('2023-08-21').toISOString(),
            completed: true,
            exercises: [
              {
                id: 'ex7',
                name: 'ריצה במקום',
                sets: 5,
                reps: 0,
                weight: 0,
                restTime: 30,
                notes: '30 שניות עבודה, 30 שניות מנוחה',
                duration: 30
              },
              {
                id: 'ex8',
                name: 'ברפי',
                sets: 5,
                reps: 10,
                weight: 0,
                restTime: 30
              }
            ],
            duration: 30
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'תוכנית כוח בסיסית',
    description: 'תוכנית כללית לבניית כוח בסיסי',
    coachId: 'coach-123',
    createdAt: new Date('2023-07-10').toISOString(),
    startDate: new Date('2023-07-15').toISOString(),
    endDate: new Date('2023-09-15').toISOString(),
    goal: 'בניית בסיס כוח לאימונים מתקדמים',
    notes: 'מתאים למתאמנים בכל הרמות',
    isTemplate: true,
    weeks: [
      {
        id: 'week-4',
        title: 'שבוע בסיסי',
        description: 'אימונים בסיסיים לכל הגוף',
        blockId: '3',
        weekNumber: 1,
        notes: 'להתמקד בתרגילים בסיסיים',
        workouts: [
          {
            id: 'w4-1',
            title: 'אימון גוף מלא',
            description: 'תרגילים לכל הגוף',
            coachId: 'coach-123',
            clientId: 'template-client', // Adding missing required field
            createdAt: new Date('2023-07-10').toISOString(),
            scheduledFor: new Date('2023-07-15').toISOString(),
            completed: false,
            exercises: [
              {
                id: 'ex9',
                name: 'סקוואט',
                sets: 3,
                reps: 12,
                weight: 0,
                restTime: 60,
                notes: 'משקל גוף'
              },
              {
                id: 'ex10',
                name: 'שכיבות שמיכה',
                sets: 3,
                reps: 10,
                weight: 0,
                restTime: 60
              }
            ],
            duration: 45
          }
        ]
      }
    ]
  }
];

// Helper functions for mock data
const findMockBlockById = (id: string): TrainingBlock | undefined => {
  return mockTrainingBlocks.find(block => block.id === id);
};

const getMockTemplates = (): TrainingBlock[] => {
  return mockTrainingBlocks.filter(block => block.isTemplate);
};

const getMockAssignedBlocks = (): TrainingBlock[] => {
  return mockTrainingBlocks.filter(block => !block.isTemplate);
};

export const trainingBlockService = {
  getBlocks: async (): Promise<TrainingBlock[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch training blocks');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock training blocks because API call failed:', error);
      return getMockAssignedBlocks();
    }
  },

  getTemplates: async (): Promise<TrainingBlock[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/templates`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch training block templates');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock training block templates because API call failed:', error);
      return getMockTemplates();
    }
  },

  getBlockById: async (id: string): Promise<TrainingBlock> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch training block with id ${id}`);
      }
      return response.json();
    } catch (error) {
      console.warn(`Using mock training block because API call failed for block ${id}:`, error);
      const mockBlock = findMockBlockById(id);
      if (mockBlock) {
        return { ...mockBlock };
      }
      throw new Error(`Training block with id ${id} not found in mock data`);
    }
  },

  createBlock: async (block: Omit<TrainingBlock, 'id' | 'createdAt'>): Promise<TrainingBlock> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(block),
      });
      if (!response.ok) {
        throw new Error('Failed to create training block');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock create because API call failed:', error);
      const newBlock: TrainingBlock = {
        ...block,
        id: `mock-block-${Date.now()}`,
        createdAt: new Date().toISOString(),
        weeks: block.weeks?.map((week, index) => ({
          ...week,
          id: `mock-week-${Date.now()}-${index}`,
          blockId: `mock-block-${Date.now()}`
        })) || []
      };
      mockTrainingBlocks.push(newBlock);
      return newBlock;
    }
  },

  updateBlock: async (block: TrainingBlock): Promise<TrainingBlock> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/${block.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(block),
      });
      if (!response.ok) {
        throw new Error(`Failed to update training block with id ${block.id}`);
      }
      return response.json();
    } catch (error) {
      console.warn(`Using mock update because API call failed for block ${block.id}:`, error);
      const index = mockTrainingBlocks.findIndex(b => b.id === block.id);
      if (index !== -1) {
        mockTrainingBlocks[index] = { ...block };
        return { ...block };
      }
      throw new Error(`Training block with id ${block.id} not found in mock data`);
    }
  },

  deleteBlock: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete training block with id ${id}`);
      }
    } catch (error) {
      console.warn(`Using mock delete because API call failed for block ${id}:`, error);
      const index = mockTrainingBlocks.findIndex(b => b.id === id);
      if (index !== -1) {
        mockTrainingBlocks.splice(index, 1);
        return;
      }
      throw new Error(`Training block with id ${id} not found in mock data`);
    }
  },

  assignBlockToClient: async (blockId: string, clientId: string): Promise<TrainingBlock> => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainingblocks/${blockId}/assign/${clientId}`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to assign training block to client`);
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock assign because API call failed:', error);
      // Find the template block and create a copy assigned to the client
      const templateBlock = findMockBlockById(blockId);
      
      if (!templateBlock) {
        throw new Error(`Training block template with id ${blockId} not found in mock data`);
      }
      
      // Get a mock client name based on client ID
      let clientName = 'Unknown Client';
      if (clientId === '1') clientName = 'John Doe';
      else if (clientId === '2') clientName = 'Jane Smith';
      else if (clientId === '3') clientName = 'Michael Johnson';
      
      const assignedBlock: TrainingBlock = {
        ...templateBlock,
        id: `assigned-${Date.now()}`,
        clientId: clientId,
        clientName: clientName,
        isTemplate: false,
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000).toISOString(), // 8 weeks from now
        weeks: templateBlock.weeks.map((week, index) => ({
          ...week,
          id: `assigned-week-${Date.now()}-${index}`,
          blockId: `assigned-${Date.now()}`
        }))
      };
      
      mockTrainingBlocks.push(assignedBlock);
      return assignedBlock;
    }
  }
};