import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExerciseCategory, ExerciseTemplate, ExerciseFilters } from '../../types/exercise';
import { exerciseService } from '../../services/exerciseService';

// Define the state interface
interface ExercisesState {
  categories: ExerciseCategory[];
  templates: ExerciseTemplate[];
  selectedCategory: ExerciseCategory | null;
  selectedTemplate: ExerciseTemplate | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: ExerciseFilters;
}

// Initial state
const initialState: ExercisesState = {
  categories: [],
  templates: [],
  selectedCategory: null,
  selectedTemplate: null,
  status: 'idle',
  error: null,
  filter: {
    searchQuery: '',
    categoryFilter: '',
    difficultyFilter: '',
    equipmentFilter: '',
  },
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'exercises/fetchCategories',
  async () => {
    return await exerciseService.getCategories();
  }
);

export const fetchCategoryById = createAsyncThunk(
  'exercises/fetchCategoryById',
  async (id: string) => {
    return await exerciseService.getCategoryById(id);
  }
);

export const createCategory = createAsyncThunk(
  'exercises/createCategory',
  async (category: Omit<ExerciseCategory, 'id'>) => {
    return await exerciseService.createCategory(category);
  }
);

export const updateCategory = createAsyncThunk(
  'exercises/updateCategory',
  async (category: ExerciseCategory) => {
    return await exerciseService.updateCategory(category);
  }
);

export const deleteCategory = createAsyncThunk(
  'exercises/deleteCategory',
  async (id: string) => {
    await exerciseService.deleteCategory(id);
    return id;
  }
);

export const fetchTemplates = createAsyncThunk(
  'exercises/fetchTemplates',
  async (categoryId?: string) => {
    return await exerciseService.getTemplates(categoryId);
  }
);

export const fetchTemplateById = createAsyncThunk(
  'exercises/fetchTemplateById',
  async (id: string) => {
    return await exerciseService.getTemplateById(id);
  }
);

export const createTemplate = createAsyncThunk(
  'exercises/createTemplate',
  async (template: Omit<ExerciseTemplate, 'id'>) => {
    return await exerciseService.createTemplate(template);
  }
);

export const updateTemplate = createAsyncThunk(
  'exercises/updateTemplate',
  async (template: ExerciseTemplate) => {
    return await exerciseService.updateTemplate(template);
  }
);

export const deleteTemplate = createAsyncThunk(
  'exercises/deleteTemplate',
  async (id: string) => {
    await exerciseService.deleteTemplate(id);
    return id;
  }
);

// Create the slice
const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filter.categoryFilter = action.payload;
    },
    setDifficultyFilter: (state, action: PayloadAction<string>) => {
      state.filter.difficultyFilter = action.payload;
    },
    setEquipmentFilter: (state, action: PayloadAction<string>) => {
      state.filter.equipmentFilter = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    clearSelectedTemplate: (state) => {
      state.selectedTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })
      
      // Fetch category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch category';
      })
      
      // Create a new category
      .addCase(createCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create category';
      })
      
      // Update an existing category
      .addCase(updateCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update category';
      })
      
      // Delete a category
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = state.categories.filter(category => category.id !== action.payload);
        if (state.selectedCategory?.id === action.payload) {
          state.selectedCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete category';
      })
      
      // Fetch all templates
      .addCase(fetchTemplates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch templates';
      })
      
      // Fetch template by ID
      .addCase(fetchTemplateById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedTemplate = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch template';
      })
      
      // Create a new template
      .addCase(createTemplate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.templates.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create template';
      })
      
      // Update an existing template
      .addCase(updateTemplate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.templates.findIndex(template => template.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
        if (state.selectedTemplate?.id === action.payload.id) {
          state.selectedTemplate = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update template';
      })
      
      // Delete a template
      .addCase(deleteTemplate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.templates = state.templates.filter(template => template.id !== action.payload);
        if (state.selectedTemplate?.id === action.payload) {
          state.selectedTemplate = null;
        }
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete template';
      });
  },
});

// Export actions and reducer
export const { 
  setSearchQuery, 
  setCategoryFilter, 
  setDifficultyFilter, 
  setEquipmentFilter,
  clearSelectedCategory,
  clearSelectedTemplate 
} = exercisesSlice.actions;

export default exercisesSlice.reducer;

// Selectors
export const selectAllCategories = (state: { exercises: ExercisesState }) => state.exercises.categories;
export const selectCategoryById = (state: { exercises: ExercisesState }, categoryId: string) => 
  state.exercises.categories.find(category => category.id === categoryId);
export const selectSelectedCategory = (state: { exercises: ExercisesState }) => state.exercises.selectedCategory;

export const selectAllTemplates = (state: { exercises: ExercisesState }) => state.exercises.templates;
export const selectTemplateById = (state: { exercises: ExercisesState }, templateId: string) => 
  state.exercises.templates.find(template => template.id === templateId);
export const selectSelectedTemplate = (state: { exercises: ExercisesState }) => state.exercises.selectedTemplate;

export const selectExerciseStatus = (state: { exercises: ExercisesState }) => state.exercises.status;
export const selectExerciseError = (state: { exercises: ExercisesState }) => state.exercises.error;
export const selectExerciseFilters = (state: { exercises: ExercisesState }) => state.exercises.filter;

export const selectFilteredTemplates = (state: { exercises: ExercisesState }) => {
  const { templates, filter } = state.exercises;
  const { searchQuery, categoryFilter, difficultyFilter, equipmentFilter } = filter;
  
  return templates.filter(template => {
    // Filter by category
    if (categoryFilter && template.categoryId !== categoryFilter) {
      return false;
    }
    
    // Filter by difficulty
    if (difficultyFilter && template.difficultyLevel !== difficultyFilter) {
      return false;
    }
    
    // Filter by equipment
    if (equipmentFilter && !template.equipmentNeeded?.includes(equipmentFilter)) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.targetMuscleGroups.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
};