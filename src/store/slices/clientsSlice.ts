import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { clientService } from '../../services/clientService';
import { Client, ClientFilter } from '../../types/client';
import { RootState } from '../index';

interface ClientsState {
  clients: Client[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: ClientFilter;
}

const initialState: ClientsState = {
  clients: [],
  status: 'idle',
  error: null,
  filters: {
    status: '',
    search: ''
  }
};

// Async thunks
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async () => {
    const response = await clientService.getClients();
    return response;
  }
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id: string) => {
    const response = await clientService.getClientById(id);
    return response;
  }
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (client: Omit<Client, 'id'>) => {
    const response = await clientService.createClient(client);
    return response;
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async (client: Client) => {
    const response = await clientService.updateClient(client);
    return response;
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id: string) => {
    await clientService.deleteClient(id);
    return id;
  }
);

// Create slice
const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch clients';
      })
      // fetchClientById - not changing the array of clients
      .addCase(fetchClientById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientById.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch client';
      })
      // createClient
      .addCase(createClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients.push(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create client';
      })
      // updateClient
      .addCase(updateClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.clients.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update client';
      })
      // deleteClient
      .addCase(deleteClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = state.clients.filter(client => client.id !== action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete client';
      });
  }
});

// Export actions
export const { setStatusFilter, setSearchQuery, clearFilters } = clientsSlice.actions;

// Export selectors
export const selectAllClients = (state: RootState) => state.clients.clients;
export const selectClientById = (state: RootState, id: string) => state.clients.clients.find(client => client.id === id);
export const selectClientStatus = (state: RootState) => state.clients.status;
export const selectClientError = (state: RootState) => state.clients.error;
export const selectClientFilters = (state: RootState) => state.clients.filters;

export const selectFilteredClients = (state: RootState) => {
  const { clients } = state.clients;
  const { status, search } = state.clients.filters;
  
  return clients.filter(client => {
    // Filter by status
    const statusMatch = status === '' || client.status === status;
    
    // Filter by search query
    const searchLower = search.toLowerCase();
    const searchMatch = search === '' || 
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(search);
    
    return statusMatch && searchMatch;
  });
};

export default clientsSlice.reducer;
