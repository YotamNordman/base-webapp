import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TrainingBlock, TrainingBlockFilters } from '../../types/trainingBlock';
import { trainingBlockService } from '../../services/trainingBlockService';

// Define the state interface
interface TrainingBlocksState {
  blocks: TrainingBlock[];
  selectedBlock: TrainingBlock | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: TrainingBlockFilters;
}

// Initial state
const initialState: TrainingBlocksState = {
  blocks: [],
  selectedBlock: null,
  status: 'idle',
  error: null,
  filter: {
    searchQuery: '',
    clientFilter: '',
    templateFilter: 'all',
    goalFilter: '',
    dateFilter: {
      startDate: null,
      endDate: null,
    },
  },
};

// Async thunks
export const fetchBlocks = createAsyncThunk(
  'trainingBlocks/fetchBlocks',
  async () => {
    return await trainingBlockService.getBlocks();
  }
);

export const fetchTemplates = createAsyncThunk(
  'trainingBlocks/fetchTemplates',
  async () => {
    return await trainingBlockService.getTemplates();
  }
);

export const fetchBlockById = createAsyncThunk(
  'trainingBlocks/fetchBlockById',
  async (id: string) => {
    return await trainingBlockService.getBlockById(id);
  }
);

export const createBlock = createAsyncThunk(
  'trainingBlocks/createBlock',
  async (block: Omit<TrainingBlock, 'id' | 'createdAt'>) => {
    return await trainingBlockService.createBlock(block);
  }
);

export const updateBlock = createAsyncThunk(
  'trainingBlocks/updateBlock',
  async (block: TrainingBlock) => {
    return await trainingBlockService.updateBlock(block);
  }
);

export const deleteBlock = createAsyncThunk(
  'trainingBlocks/deleteBlock',
  async (id: string) => {
    await trainingBlockService.deleteBlock(id);
    return id;
  }
);

export const assignBlockToClient = createAsyncThunk(
  'trainingBlocks/assignBlockToClient',
  async ({ blockId, clientId }: { blockId: string; clientId: string }) => {
    return await trainingBlockService.assignBlockToClient(blockId, clientId);
  }
);

// Create the slice
const trainingBlocksSlice = createSlice({
  name: 'trainingBlocks',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },
    setClientFilter: (state, action: PayloadAction<string>) => {
      state.filter.clientFilter = action.payload;
    },
    setTemplateFilter: (state, action: PayloadAction<'all' | 'templates' | 'assigned'>) => {
      state.filter.templateFilter = action.payload;
    },
    setGoalFilter: (state, action: PayloadAction<string>) => {
      state.filter.goalFilter = action.payload;
    },
    setDateFilter: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.filter.dateFilter = action.payload;
    },
    clearSelectedBlock: (state) => {
      state.selectedBlock = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all blocks
      .addCase(fetchBlocks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlocks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blocks = action.payload;
      })
      .addCase(fetchBlocks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch training blocks';
      })
      
      // Fetch templates
      .addCase(fetchTemplates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blocks = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch training block templates';
      })
      
      // Fetch block by ID
      .addCase(fetchBlockById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlockById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedBlock = action.payload;
      })
      .addCase(fetchBlockById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch training block';
      })
      
      // Create a new block
      .addCase(createBlock.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBlock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blocks.push(action.payload);
      })
      .addCase(createBlock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create training block';
      })
      
      // Update an existing block
      .addCase(updateBlock.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBlock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.blocks.findIndex(block => block.id === action.payload.id);
        if (index !== -1) {
          state.blocks[index] = action.payload;
        }
        if (state.selectedBlock?.id === action.payload.id) {
          state.selectedBlock = action.payload;
        }
      })
      .addCase(updateBlock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update training block';
      })
      
      // Delete a block
      .addCase(deleteBlock.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBlock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blocks = state.blocks.filter(block => block.id !== action.payload);
        if (state.selectedBlock?.id === action.payload) {
          state.selectedBlock = null;
        }
      })
      .addCase(deleteBlock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete training block';
      })
      
      // Assign block to client
      .addCase(assignBlockToClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(assignBlockToClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blocks.push(action.payload);
      })
      .addCase(assignBlockToClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to assign training block to client';
      });
  },
});

// Export actions and reducer
export const { 
  setSearchQuery, 
  setClientFilter, 
  setTemplateFilter, 
  setGoalFilter,
  setDateFilter, 
  clearSelectedBlock 
} = trainingBlocksSlice.actions;

export default trainingBlocksSlice.reducer;

// Selectors
export const selectAllBlocks = (state: { trainingBlocks: TrainingBlocksState }) => state.trainingBlocks.blocks;
export const selectBlockById = (state: { trainingBlocks: TrainingBlocksState }, blockId: string) => 
  state.trainingBlocks.blocks.find(block => block.id === blockId);
export const selectSelectedBlock = (state: { trainingBlocks: TrainingBlocksState }) => state.trainingBlocks.selectedBlock;
export const selectBlockStatus = (state: { trainingBlocks: TrainingBlocksState }) => state.trainingBlocks.status;
export const selectBlockError = (state: { trainingBlocks: TrainingBlocksState }) => state.trainingBlocks.error;
export const selectBlockFilters = (state: { trainingBlocks: TrainingBlocksState }) => state.trainingBlocks.filter;

export const selectFilteredBlocks = (state: { trainingBlocks: TrainingBlocksState }) => {
  const { blocks, filter } = state.trainingBlocks;
  const { searchQuery, clientFilter, templateFilter, goalFilter, dateFilter } = filter;
  
  return blocks.filter(block => {
    // Filter by template/assigned
    if (templateFilter !== 'all') {
      const isTemplate = block.isTemplate;
      if (templateFilter === 'templates' && !isTemplate) return false;
      if (templateFilter === 'assigned' && isTemplate) return false;
    }
    
    // Filter by client
    if (clientFilter && block.clientId !== clientFilter) {
      return false;
    }
    
    // Filter by goal
    if (goalFilter && !block.goal?.toLowerCase().includes(goalFilter.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (dateFilter.startDate || dateFilter.endDate) {
      const blockStartDate = new Date(block.startDate).getTime();
      const blockEndDate = new Date(block.endDate).getTime();
      
      if (dateFilter.startDate) {
        const filterStartDate = new Date(dateFilter.startDate).getTime();
        if (blockEndDate < filterStartDate) return false;
      }
      
      if (dateFilter.endDate) {
        const filterEndDate = new Date(dateFilter.endDate).getTime();
        if (blockStartDate > filterEndDate) return false;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        block.title.toLowerCase().includes(query) ||
        (block.description?.toLowerCase().includes(query) || false) ||
        (block.goal?.toLowerCase().includes(query) || false) ||
        (block.clientName?.toLowerCase().includes(query) || false)
      );
    }
    
    return true;
  });
};