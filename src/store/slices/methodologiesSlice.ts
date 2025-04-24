import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { 
  TrainingMethodology, 
  WorkoutType, 
  BlockType,
  MethodologyFilters
} from '../../types/methodology';
import { methodologyService } from '../../services/methodologyService';

// Define the initial state
interface MethodologiesState {
  methodologies: TrainingMethodology[];
  currentMethodology: TrainingMethodology | null;
  workoutTypes: WorkoutType[];
  blockTypes: BlockType[];
  filters: MethodologyFilters;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MethodologiesState = {
  methodologies: [],
  currentMethodology: null,
  workoutTypes: [],
  blockTypes: [],
  filters: {
    searchQuery: '',
    creatorFilter: '',
    publicFilter: 'all',
    blockTypeFilter: ''
  },
  status: 'idle',
  error: null
};

// Thunks
export const fetchMethodologies = createAsyncThunk(
  'methodologies/fetchMethodologies',
  async (_, { rejectWithValue }) => {
    try {
      return await methodologyService.getMethodologies();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchMethodologyById = createAsyncThunk(
  'methodologies/fetchMethodologyById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await methodologyService.getMethodologyById(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchWorkoutTypes = createAsyncThunk(
  'methodologies/fetchWorkoutTypes',
  async (methodologyId: string, { rejectWithValue }) => {
    try {
      return await methodologyService.getWorkoutTypes(methodologyId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchBlockTypes = createAsyncThunk(
  'methodologies/fetchBlockTypes',
  async (methodologyId: string, { rejectWithValue }) => {
    try {
      return await methodologyService.getBlockTypes(methodologyId);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createMethodology = createAsyncThunk(
  'methodologies/createMethodology',
  async (methodology: Omit<TrainingMethodology, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await methodologyService.createMethodology(methodology);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateMethodology = createAsyncThunk(
  'methodologies/updateMethodology',
  async (methodology: TrainingMethodology, { rejectWithValue }) => {
    try {
      return await methodologyService.updateMethodology(methodology);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteMethodology = createAsyncThunk(
  'methodologies/deleteMethodology',
  async (id: string, { rejectWithValue }) => {
    try {
      await methodologyService.deleteMethodology(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const methodologiesSlice = createSlice({
  name: 'methodologies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setCreatorFilter: (state, action: PayloadAction<string>) => {
      state.filters.creatorFilter = action.payload;
    },
    setPublicFilter: (state, action: PayloadAction<'all' | 'public' | 'private'>) => {
      state.filters.publicFilter = action.payload;
    },
    setBlockTypeFilter: (state, action: PayloadAction<string>) => {
      state.filters.blockTypeFilter = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentMethodology: (state) => {
      state.currentMethodology = null;
      state.workoutTypes = [];
      state.blockTypes = [];
    }
  },
  extraReducers: builder => {
    builder
      // fetchMethodologies
      .addCase(fetchMethodologies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMethodologies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.methodologies = action.payload;
        state.error = null;
      })
      .addCase(fetchMethodologies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // fetchMethodologyById
      .addCase(fetchMethodologyById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMethodologyById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentMethodology = action.payload;
        state.error = null;
      })
      .addCase(fetchMethodologyById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // fetchWorkoutTypes
      .addCase(fetchWorkoutTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkoutTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workoutTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchWorkoutTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // fetchBlockTypes
      .addCase(fetchBlockTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlockTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blockTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchBlockTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // createMethodology
      .addCase(createMethodology.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMethodology.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.methodologies.push(action.payload);
        state.error = null;
      })
      .addCase(createMethodology.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // updateMethodology
      .addCase(updateMethodology.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMethodology.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.methodologies.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.methodologies[index] = action.payload;
        }
        if (state.currentMethodology?.id === action.payload.id) {
          state.currentMethodology = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMethodology.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // deleteMethodology
      .addCase(deleteMethodology.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteMethodology.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.methodologies = state.methodologies.filter(m => m.id !== action.payload);
        if (state.currentMethodology?.id === action.payload) {
          state.currentMethodology = null;
          state.workoutTypes = [];
          state.blockTypes = [];
        }
        state.error = null;
      })
      .addCase(deleteMethodology.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { 
  setSearchQuery, 
  setCreatorFilter, 
  setPublicFilter, 
  setBlockTypeFilter, 
  clearFilters,
  clearCurrentMethodology
} = methodologiesSlice.actions;

export default methodologiesSlice.reducer;

// Selectors
export const selectAllMethodologies = (state: RootState) => state.methodologies.methodologies;
export const selectCurrentMethodology = (state: RootState) => state.methodologies.currentMethodology;
export const selectWorkoutTypes = (state: RootState) => state.methodologies.workoutTypes;
export const selectBlockTypes = (state: RootState) => state.methodologies.blockTypes;
export const selectMethodologiesStatus = (state: RootState) => state.methodologies.status;
export const selectMethodologiesError = (state: RootState) => state.methodologies.error;
export const selectMethodologiesFilters = (state: RootState) => state.methodologies.filters;

// Filtered selectors
export const selectFilteredMethodologies = (state: RootState) => {
  const { searchQuery, creatorFilter, publicFilter, blockTypeFilter } = state.methodologies.filters;
  return state.methodologies.methodologies.filter(methodology => {
    const matchesSearch = searchQuery === '' || 
      methodology.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      methodology.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCreator = creatorFilter === '' || methodology.creatorId === creatorFilter;
    
    const matchesPublic = publicFilter === 'all' || 
      (publicFilter === 'public' && methodology.isPublic) ||
      (publicFilter === 'private' && !methodology.isPublic);
    
    const matchesBlockType = blockTypeFilter === '' || 
      methodology.blockTypes.some(blockType => blockType.id === blockTypeFilter || blockType.name.toLowerCase().includes(blockTypeFilter.toLowerCase()));
    
    return matchesSearch && matchesCreator && matchesPublic && matchesBlockType;
  });
};