import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  InputAdornment, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  CircularProgress, 
  Alert,
  Paper,
  Tabs,
  Tab,
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Refresh as RefreshIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchBlocks, 
  fetchTemplates,
  selectFilteredBlocks, 
  selectBlockStatus, 
  selectBlockError, 
  setSearchQuery, 
  setTemplateFilter,
  setClientFilter,
  selectBlockFilters,
  deleteBlock
} from '../../store/slices/trainingBlocksSlice';
import TrainingBlockCard from '../../components/common/cards/training-block-card';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store';

// Client options for dropdown (should come from API in a real implementation)
const clientOptions = [
  { id: '', name: 'כל המתאמנים' },
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Michael Johnson' },
  { id: '4', name: 'Emily Williams' },
  { id: '5', name: 'David Brown' }
];

const TrainingBlockListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const blocks = useSelector(selectFilteredBlocks);
  const status = useSelector(selectBlockStatus);
  const error = useSelector(selectBlockError);
  const { searchQuery, clientFilter, templateFilter } = useSelector(selectBlockFilters);
  
  const [currentTab, setCurrentTab] = useState<number>(0); // 0 = All, 1 = Templates, 2 = Assigned
  
  // Local debounced state for search query
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  useEffect(() => {
    // Load blocks when the component mounts
    if (status === 'idle') {
      dispatch(fetchBlocks());
    }
  }, [status, dispatch]);
  
  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [localSearchQuery, dispatch]);
  
  // Handle tab changes
  useEffect(() => {
    if (currentTab === 0) {
      dispatch(setTemplateFilter('all'));
    } else if (currentTab === 1) {
      dispatch(setTemplateFilter('templates'));
    } else if (currentTab === 2) {
      dispatch(setTemplateFilter('assigned'));
    }
  }, [currentTab, dispatch]);
  
  const handleAddBlock = () => {
    navigate('/training/blocks/new');
  };
  
  const handleBlockClick = (id: string) => {
    navigate(`/training/blocks/${id}`);
  };
  
  const handleEditBlock = (id: string) => {
    navigate(`/training/blocks/${id}/edit`);
  };
  
  const handleDeleteBlock = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תוכנית אימון זו?')) {
      dispatch(deleteBlock(id));
    }
  };
  
  const handleAssignBlock = (id: string) => {
    navigate(`/training/blocks/${id}/assign`);
  };
  
  const handleClientFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setClientFilter(event.target.value));
  };
  
  const handleRefresh = () => {
    dispatch(fetchBlocks());
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarIcon sx={{ mr: 2, fontSize: 32 }} />
          תוכניות אימונים
        </Typography>
        
        <Box display="flex" alignItems="center">
          <IconButton 
            onClick={handleRefresh} 
            sx={{ mr: 1 }}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddBlock}
            sx={{ ml: 2 }}
          >
            תוכנית חדשה
          </Button>
        </Box>
      </Box>
      
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="הכל" />
        <Tab label="תבניות" />
        <Tab label="תוכניות מוקצות" />
      </Tabs>
      
      <Box mb={4}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="חיפוש תוכניות אימון לפי שם, תיאור או מטרה"
                variant="outlined"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="client-filter-label">מתאמן</InputLabel>
                <Select
                  labelId="client-filter-label"
                  id="client-filter"
                  value={clientFilter}
                  label="מתאמן"
                  onChange={handleClientFilterChange}
                >
                  {clientOptions.map(client => (
                    <MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {status === 'loading' && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
      
      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'טעינת תוכניות האימון נכשלה'}
        </Alert>
      )}
      
      {status === 'succeeded' && blocks.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          לא נמצאו תוכניות אימון. נסה לשנות את החיפוש או הסינון, או צור תוכנית חדשה.
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {blocks.map(block => (
          <Grid item xs={12} md={6} key={block.id}>
            <TrainingBlockCard 
              block={block}
              onClick={handleBlockClick}
              onEdit={handleEditBlock}
              onDelete={handleDeleteBlock}
              onAssign={handleAssignBlock}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TrainingBlockListPage;