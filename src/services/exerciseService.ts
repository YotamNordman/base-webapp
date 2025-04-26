import { ExerciseCategory, ExerciseTemplate } from '../types/exercise';
import { getApiBaseUrl, getAuthHeader as configGetAuthHeader, isMockModeEnabled } from '../config';

// Get base API URL from configuration
const API_BASE_URL = getApiBaseUrl();
// Check if we should use mock data
const USE_MOCK_DATA = isMockModeEnabled();

// Use auth header from config
const getAuthHeader = configGetAuthHeader;

// Mock data for development when backend is not available
const mockCategories: ExerciseCategory[] = [
  {
    id: '1',
    name: 'כוח עליון',
    description: 'תרגילים לפלג גוף עליון',
    targetMuscleGroups: 'חזה, כתפיים, טרפז, זרועות',
  },
  {
    id: '2',
    name: 'כוח תחתון',
    description: 'תרגילים לפלג גוף תחתון',
    targetMuscleGroups: 'ירכיים, ישבן, שוקיים',
  },
  {
    id: '3',
    name: 'ליבה',
    description: 'תרגילים לשרירי הליבה',
    targetMuscleGroups: 'בטן, גב תחתון',
  },
  {
    id: '4',
    name: 'קרדיו',
    description: 'תרגילים אירוביים',
    targetMuscleGroups: 'לב, ריאות, כל הגוף',
  },
  {
    id: '5',
    name: 'גמישות',
    description: 'תרגילי מתיחה וגמישות',
    targetMuscleGroups: 'כל הגוף',
  }
];

const mockTemplates: ExerciseTemplate[] = [
  {
    id: '1',
    name: 'לחיצת חזה עם משקולות',
    description: 'תרגיל בסיסי ואפקטיבי לחיזוק שרירי החזה',
    categoryId: '1',
    targetMuscleGroups: 'חזה, כתפיים קדמיות, שלוש ראשי',
    instructions: '1. שכב על הספסל\n2. החזק את המשקולות מעל החזה\n3. הורד לאט אל החזה\n4. דחוף בחזרה למעלה',
    difficultyLevel: 'בינוני',
    equipmentNeeded: 'משקולות, ספסל',
    imageUrl: 'https://example.com/bench-press.jpg',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 40
  },
  {
    id: '2',
    name: 'סקוואט',
    description: 'תרגיל מורכב לחיזוק הרגליים',
    categoryId: '2',
    targetMuscleGroups: 'ירכיים, ישבן',
    instructions: '1. עמוד עם רגליים ברוחב הכתפיים\n2. רד למטה כאילו אתה יושב על כיסא\n3. שמור על גב ישר\n4. חזור למעלה',
    difficultyLevel: 'בינוני',
    equipmentNeeded: 'משקל גוף, אופציה למשקולות',
    imageUrl: 'https://example.com/squat.jpg',
    defaultSets: 4,
    defaultReps: 12,
    defaultWeight: 60
  },
  {
    id: '3',
    name: 'מתח',
    description: 'תרגיל למשיכת הגוף כלפי מעלה',
    categoryId: '1',
    targetMuscleGroups: 'גב, זרוע אחורית, כתפיים',
    instructions: '1. תפוס את המוט\n2. משוך את עצמך למעלה\n3. הורד בשליטה',
    difficultyLevel: 'מתקדם',
    equipmentNeeded: 'מוט מתח',
    imageUrl: 'https://example.com/pullup.jpg',
    defaultSets: 3,
    defaultReps: 8
  },
  {
    id: '4',
    name: 'פלאנק',
    description: 'תרגיל סטטי לחיזוק הליבה',
    categoryId: '3',
    targetMuscleGroups: 'בטן, גב תחתון',
    instructions: '1. תנוחת סמיכה על האמות\n2. שמור על גוף ישר\n3. החזק את התנוחה',
    difficultyLevel: 'מתחיל',
    equipmentNeeded: 'ללא ציוד',
    imageUrl: 'https://example.com/plank.jpg',
    defaultSets: 3,
    defaultDuration: 60
  },
  {
    id: '5',
    name: 'ריצה קלה',
    description: 'תרגיל קרדיו בסיסי',
    categoryId: '4',
    targetMuscleGroups: 'רגליים, לב, ריאות',
    instructions: 'רוץ בקצב נוח למשך הזמן המוגדר',
    difficultyLevel: 'משתנה',
    equipmentNeeded: 'נעלי ריצה',
    imageUrl: 'https://example.com/jogging.jpg',
    defaultDuration: 1200
  },
  {
    id: '6',
    name: 'מתיחת רגליים',
    description: 'תרגיל גמישות לרגליים',
    categoryId: '5',
    targetMuscleGroups: 'מיתרי הברך, קרסוליים',
    instructions: '1. שב עם רגליים ישרות\n2. התכופף קדימה\n3. החזק למשך 30 שניות',
    difficultyLevel: 'מתחיל',
    equipmentNeeded: 'ללא ציוד',
    imageUrl: 'https://example.com/leg-stretch.jpg',
    defaultSets: 3,
    defaultDuration: 30
  }
];

// Helper functions for mock data
const findMockCategoryById = (id: string): ExerciseCategory | undefined => {
  return mockCategories.find(category => category.id === id);
};

const findMockTemplateById = (id: string): ExerciseTemplate | undefined => {
  return mockTemplates.find(template => template.id === id);
};

const filterTemplatesByCategory = (categoryId: string): ExerciseTemplate[] => {
  return mockTemplates.filter(template => template.categoryId === categoryId);
};

export const exerciseService = {
  // Upload CSV file to backend
  uploadExerciseCsv: async (formData: FormData): Promise<{ categories: ExerciseCategory[], templates: ExerciseTemplate[] }> => {
    // If mock mode is enabled, use the mock implementation
    if (USE_MOCK_DATA) {
      try {
        // Get the file from the form data
        const file = formData.get('file') as File;
        if (!file) {
          throw new Error('No file found in form data');
        }
        
        // Read the file content
        const text = await file.text();
        
        // Split the CSV into lines
        const lines = text.split('\n');
        
        // Initialize data structures for categories and templates
        const categories: ExerciseCategory[] = [];
        const templates: ExerciseTemplate[] = [];
        
        // Get the next IDs for categories and templates
        let nextCategoryId = mockCategories.length > 0 
          ? Math.max(...mockCategories.map(c => parseInt(c.id))) + 1 
          : 1;
        let nextTemplateId = mockTemplates.length > 0 
          ? Math.max(...mockTemplates.map(t => parseInt(t.id))) + 1 
          : 1;
        
        // Track category IDs by name
        const categoryMap: Record<string, string> = {};
        
        // Extract categories from row 2 (index 1)
        if (lines.length > 1) {
          const categoryRow = lines[1];
          const categoryColumns = categoryRow.split(',');
          
          // Process each category (they appear every 3 columns starting from index 1)
          for (let i = 1; i < categoryColumns.length; i += 3) {
            const categoryName = categoryColumns[i]?.trim();
            
            if (categoryName && categoryName.length > 0) {
              // Create unique ID for the category
              const categoryId = `${nextCategoryId++}`;
              categoryMap[categoryName] = categoryId;
              
              // Create category object
              const category: ExerciseCategory = {
                id: categoryId,
                name: categoryName,
                description: `תרגילים לקבוצת שרירים: ${categoryName}`,
                targetMuscleGroups: categoryName
              };
              
              categories.push(category);
            }
          }
        }
        
        // Process exercises from row 4 (index 3) onward
        for (let i = 3; i < lines.length; i++) {
          const line = lines[i];
          if (!line.trim()) continue;
          
          const columns = line.split(',');
          
          // Process each exercise entry
          for (let j = 1; j < columns.length; j += 3) {
            const exerciseName = columns[j]?.trim();
            const videoIndicator = columns[j + 1]?.trim();
            
            if (exerciseName && exerciseName.length > 0) {
              // Determine which category this exercise belongs to
              const categoryIndex = Math.floor(j / 3);
              
              if (categoryIndex < categories.length) {
                const category = categories[categoryIndex];
                
                // Create template
                const template: ExerciseTemplate = {
                  id: `${nextTemplateId++}`,
                  name: exerciseName,
                  description: `תרגיל ${exerciseName} לקבוצת שרירים: ${category.name}`,
                  categoryId: category.id,
                  targetMuscleGroups: category.name,
                  instructions: `ביצוע תרגיל ${exerciseName}`,
                  difficultyLevel: 'בינוני', // Default values
                  equipmentNeeded: 'משקולות',
                  defaultSets: 3,
                  defaultReps: 10
                };
                
                // Add video URL if indicator present
                if (videoIndicator === '📹') {
                  template.videoUrl = '#'; // Placeholder
                }
                
                templates.push(template);
              }
            }
          }
        }
        
        // Save to mock data
        mockCategories.push(...categories);
        mockTemplates.push(...templates);
        
        return { categories, templates };
      } catch (error) {
        console.error('Failed to upload exercises CSV:', error);
        throw new Error('Failed to upload exercises CSV');
      }
    } else {
      // Use the real API
      try {
        // Get auth header and extract only the Authorization token if present
        const authHeader = getAuthHeader();
        const headersWithoutContentType: HeadersInit = {};
        
        // Extract Authorization header if present
        if ('Authorization' in authHeader && typeof authHeader.Authorization === 'string') {
          headersWithoutContentType.Authorization = authHeader.Authorization;
        }
        
        const response = await fetch(`${API_BASE_URL}/exercises/import-csv`, {
          method: 'POST',
          headers: headersWithoutContentType,
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload CSV file');
        }
        
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Failed to upload exercises CSV:', error);
        throw new Error('Failed to upload exercises CSV');
      }
    }
  },
  
  // Category endpoints
  getCategories: async (): Promise<ExerciseCategory[]> => {
    // If mock mode is enabled, return mock data directly
    if (USE_MOCK_DATA) {
      return [...mockCategories];
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch exercise categories');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock categories because API call failed:', error);
      return [...mockCategories];
    }
  },

  getCategoryById: async (id: string): Promise<ExerciseCategory> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch category with id ${id}`);
      }
      return response.json();
    } catch (error) {
      console.warn(`Using mock category because API call failed for category ${id}:`, error);
      const mockCategory = findMockCategoryById(id);
      if (mockCategory) {
        return { ...mockCategory };
      }
      throw new Error(`Category with id ${id} not found in mock data`);
    }
  },

  createCategory: async (category: Omit<ExerciseCategory, 'id'>): Promise<ExerciseCategory> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error('Failed to create exercise category');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock create because API call failed:', error);
      const newCategory: ExerciseCategory = {
        ...category,
        id: `mock-category-${Date.now()}`
      };
      mockCategories.push(newCategory);
      return newCategory;
    }
  },

  updateCategory: async (category: ExerciseCategory): Promise<ExerciseCategory> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories/${category.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error(`Failed to update category with id ${category.id}`);
      }
      return response.json();
    } catch (error) {
      console.warn(`Using mock update because API call failed for category ${category.id}:`, error);
      const index = mockCategories.findIndex(c => c.id === category.id);
      if (index !== -1) {
        mockCategories[index] = { ...category };
        return { ...category };
      }
      throw new Error(`Category with id ${category.id} not found in mock data`);
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete category with id ${id}`);
      }
    } catch (error) {
      console.warn(`Using mock delete because API call failed for category ${id}:`, error);
      const index = mockCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCategories.splice(index, 1);
        return;
      }
      throw new Error(`Category with id ${id} not found in mock data`);
    }
  },

  // Template endpoints
  getTemplates: async (categoryId?: string): Promise<ExerciseTemplate[]> => {
    try {
      const url = categoryId 
        ? `${API_BASE_URL}/exercises/templates?categoryId=${categoryId}`
        : `${API_BASE_URL}/exercises/templates`;
        
      const response = await fetch(url, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch exercise templates');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock templates because API call failed:', error);
      if (categoryId) {
        return filterTemplatesByCategory(categoryId);
      }
      return [...mockTemplates];
    }
  },

  getTemplateById: async (id: string): Promise<ExerciseTemplate> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/templates/${id}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch template with id ${id}`);
      }
      return response.json();
    } catch (error) {
      console.warn(`Using mock template because API call failed for template ${id}:`, error);
      const mockTemplate = findMockTemplateById(id);
      if (mockTemplate) {
        return { ...mockTemplate };
      }
      throw new Error(`Template with id ${id} not found in mock data`);
    }
  },

  createTemplate: async (template: Omit<ExerciseTemplate, 'id'>): Promise<ExerciseTemplate> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/templates`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(template),
      });
      if (!response.ok) {
        throw new Error('Failed to create exercise template');
      }
      return response.json();
    } catch (error) {
      console.warn('Using mock create because API call failed:', error);
      const newTemplate: ExerciseTemplate = {
        ...template,
        id: `mock-template-${Date.now()}`
      };
      mockTemplates.push(newTemplate);
      return newTemplate;
    }
  },

  updateTemplate: async (template: ExerciseTemplate): Promise<ExerciseTemplate> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/templates/${template.id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(template),
      });
      if (!response.ok) {
        throw new Error(`Failed to update template with id ${template.id}`);
      }
      return response.json();
    } catch (error) {
      console.warn(`Using mock update because API call failed for template ${template.id}:`, error);
      const index = mockTemplates.findIndex(t => t.id === template.id);
      if (index !== -1) {
        mockTemplates[index] = { ...template };
        return { ...template };
      }
      throw new Error(`Template with id ${template.id} not found in mock data`);
    }
  },

  deleteTemplate: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/templates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete template with id ${id}`);
      }
    } catch (error) {
      console.warn(`Using mock delete because API call failed for template ${id}:`, error);
      const index = mockTemplates.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTemplates.splice(index, 1);
        return;
      }
      throw new Error(`Template with id ${id} not found in mock data`);
    }
  }
};