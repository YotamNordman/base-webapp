import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button,
  CircularProgress, 
  Alert,
  TextField,
  InputAdornment,
  Card,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  CardHeader,
  useTheme,
  alpha,
  Tab,
  Tabs,
  Paper,
  Menu,
  MenuItem,
  Stack,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Mock client data
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  programType: string;
  startDate: string;
  lastActive: string;
  workoutCount: number;
  avatarUrl?: string;
}

const ClientsPage: React.FC = () => {
  const theme = useTheme();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [viewType, setViewType] = useState<'list' | 'grid' | 'table'>('table');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const navigate = useNavigate();
  
  // Handle menu open/close
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle view type change
  const handleViewTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewType: 'list' | 'grid' | 'table' | null,
  ) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from the API
        // const response = await axios.get('/api/clients');
        // setClients(response.data);
        
        // For now, we'll use mock data
        const mockClients: Client[] = [
          {
            id: '2',
            name: 'רונית כהן',
            email: 'ronit@example.com',
            phone: '052-1234567',
            status: 'active',
            programType: 'אימון כוח',
            startDate: new Date(2024, 9, 15).toISOString(), // Oct 15, 2024
            lastActive: new Date(2025, 3, 21).toISOString(), // April 21, 2025
            workoutCount: 42,
          },
          {
            id: '3',
            name: 'אלון לוי',
            email: 'alon@example.com',
            phone: '052-2345678',
            status: 'pending',
            programType: 'אימון קרדיו',
            startDate: new Date(2025, 2, 10).toISOString(), // March 10, 2025
            lastActive: new Date(2025, 3, 15).toISOString(), // April 15, 2025
            workoutCount: 16,
          },
          {
            id: '4',
            name: 'שירה דוד',
            email: 'shira@example.com',
            phone: '052-3456789',
            status: 'active',
            programType: 'גמישות ויציבה',
            startDate: new Date(2024, 11, 20).toISOString(), // Dec 20, 2024
            lastActive: new Date(2025, 3, 18).toISOString(), // April 18, 2025
            workoutCount: 35,
          },
          {
            id: '5',
            name: 'יוסי מזרחי',
            email: 'yossi@example.com',
            phone: '052-4567890',
            status: 'inactive',
            programType: 'אימון כוח',
            startDate: new Date(2024, 8, 5).toISOString(), // Sept 5, 2024
            lastActive: new Date(2025, 2, 1).toISOString(), // March 1, 2025
            workoutCount: 20,
          },
          {
            id: '6',
            name: 'מיכל אברהם',
            email: 'michal@example.com',
            phone: '052-5678901',
            status: 'active',
            programType: 'חיטוב וכוח',
            startDate: new Date(2025, 0, 2).toISOString(), // Jan 2, 2025
            lastActive: new Date(2025, 3, 20).toISOString(), // April 20, 2025
            workoutCount: 28,
          }
        ];
        
        setClients(mockClients);
        setFilteredClients(mockClients);
      } catch (err) {
        // Log error and set error message
        setError('אירעה שגיאה בטעינת רשימת המתאמנים. נא לנסות שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search and status filter
  useEffect(() => {
    let filtered = [...clients];
    
    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(client => client.status === filter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.includes(searchTerm) ||
        client.programType.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredClients(filtered);
  }, [clients, searchTerm, filter]);

  const handleViewClient = (id: string) => {
    navigate(`/clients/${id}`);
  };

  const handleEditClient = (id: string) => {
    navigate(`/clients/${id}/edit`);
  };

  const handleAddClient = () => {
    navigate('/clients/new');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  const getStatusChip = (status: 'active' | 'pending' | 'inactive') => {
    let color: 'success' | 'warning' | 'error' | 'default' = 'default';
    let label = '';
    
    switch (status) {
      case 'active':
        color = 'success';
        label = 'פעיל';
        break;
      case 'pending':
        color = 'warning';
        label = 'ממתין';
        break;
      case 'inactive':
        color = 'error';
        label = 'לא פעיל';
        break;
    }
    
    return (
      <Chip 
        size="small" 
        color={color} 
        label={label} 
        sx={{
          fontWeight: 500,
          height: 24,
          '& .MuiChip-label': { 
            px: 1.5
          }
        }}
      />
    );
  };

  const getActivityIndicator = (lastActive: string) => {
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActiveDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      return (
        <Chip 
          size="small" 
          label={`פעיל לפני ${diffDays} ימים`} 
          color="success" 
          icon={<AccessTimeIcon fontSize="small" />}
          sx={{ height: 24, fontWeight: 500 }}
        />
      );
    } else if (diffDays <= 7) {
      return (
        <Chip 
          size="small" 
          label={`פעיל לפני ${diffDays} ימים`} 
          color="warning" 
          icon={<AccessTimeIcon fontSize="small" />}
          sx={{ height: 24, fontWeight: 500 }}
        />
      );
    } else {
      return (
        <Chip 
          size="small" 
          label={`לא פעיל ${diffDays} ימים`} 
          color="error" 
          icon={<AccessTimeIcon fontSize="small" />}
          sx={{ height: 24, fontWeight: 500 }}
        />
      );
    }
  };
  
  // Render Grid View
  const renderGridView = () => {
    return (
      <Grid container spacing={2} component="div">
        {filteredClients
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((client) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={client.id} component="div">
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.customShadows.card
                  }
                }}
                onClick={() => handleViewClient(client.id)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar 
                      alt={client.name} 
                      src={client.avatarUrl}
                      sx={{ 
                        width: 60, 
                        height: 60,
                        bgcolor: theme.palette.primary.main,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {client.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ textAlign: 'right' }}>
                      {getStatusChip(client.status)}
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        ID: {client.id}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {client.name}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MailOutlineIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{client.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WhatsAppIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                      <Typography variant="body2">{client.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FitnessCenterIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">{client.programType}</Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {getActivityIndicator(client.lastActive)}
                    <Box>
                      <Tooltip title="עריכה">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClient(client.id);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="אפשרויות נוספות">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add menu handling here
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    );
  };

  // Render List View
  const renderListView = () => {
    return (
      <Card>
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {filteredClients
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((client, index) => (
            <React.Fragment key={client.id}>
              {index > 0 && <Divider />}
              <ListItem
                alignItems="flex-start"
                sx={{ 
                  py: 2, 
                  px: 3,
                  transition: 'background-color 0.2s',
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.lighter, 0.3),
                    cursor: 'pointer' 
                  }
                }}
                onClick={() => handleViewClient(client.id)}
                secondaryAction={
                  <Box>
                    <Tooltip title="צפייה">
                      <IconButton 
                        edge="end" 
                        aria-label="view" 
                        onClick={(e) => { 
                          e.stopPropagation();
                          handleViewClient(client.id);
                        }}
                        sx={{ mr: 0.5 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="עריכה">
                      <IconButton 
                        edge="end" 
                        aria-label="edit" 
                        onClick={(e) => { 
                          e.stopPropagation();
                          handleEditClient(client.id);
                        }}
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="אפשרויות נוספות">
                      <IconButton edge="end" aria-label="more">
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar 
                    alt={client.name} 
                    src={client.avatarUrl}
                    sx={{ 
                      width: 50, 
                      height: 50,
                      bgcolor: theme.palette.primary.main,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {client.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography component="span" variant="subtitle1" fontWeight={600}>
                        {client.name}
                      </Typography>
                      {getStatusChip(client.status)}
                    </Box>
                  }
                  secondary={
                    <Grid container spacing={2} component="div">
                      <Grid item xs={12} md={4} component="div">
                        <Box sx={{ mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MailOutlineIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" component="span">
                              {client.email}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WhatsAppIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
                            <Typography variant="body2" component="span">
                              {client.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4} component="div">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FitnessCenterIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                          <Typography variant="body2" component="span">
                            {client.programType} ({client.workoutCount} אימונים)
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4} component="div">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                          <Typography variant="body2" component="span" color="text.secondary">
                            הצטרפות: {formatDate(client.startDate)}
                          </Typography>
                          {getActivityIndicator(client.lastActive)}
                        </Box>
                      </Grid>
                    </Grid>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="שורות בעמוד:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
        />
      </Card>
    );
  };

  // Render Table View
  const renderTableView = () => {
    return (
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>מתאמן</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell>פרטי קשר</TableCell>
                <TableCell>תוכנית אימונים</TableCell>
                <TableCell>תאריך הצטרפות</TableCell>
                <TableCell>פעילות אחרונה</TableCell>
                <TableCell align="center">פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow 
                    key={client.id}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.lighter, 0.3) }
                    }}
                    onClick={() => handleViewClient(client.id)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          alt={client.name} 
                          src={client.avatarUrl}
                          sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                        >
                          {client.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {client.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(client.status)}</TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <MailOutlineIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">{client.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WhatsAppIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
                          <Typography variant="body2">{client.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FitnessCenterIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {client.programType}
                          <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                            ({client.workoutCount} אימונים)
                          </Typography>
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(client.startDate)}</Typography>
                    </TableCell>
                    <TableCell>{getActivityIndicator(client.lastActive)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="צפייה">
                          <IconButton 
                            size="small" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleViewClient(client.id); 
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="עריכה">
                          <IconButton 
                            size="small" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleEditClient(client.id); 
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="אפשרויות נוספות">
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add menu handling here
                            }}
                          >
                            <MoreHorizIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="שורות בעמוד:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
        />
      </Card>
    );
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                מתאמנים
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {filteredClients.length} מתאמנים סה"כ | {clients.filter(c => c.status === 'active').length} פעילים
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleAddClient}
                sx={{ 
                  px: 3, 
                  py: 1.2,
                  boxShadow: '0 4px 8px 0 rgba(58, 110, 165, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 12px 0 rgba(58, 110, 165, 0.3)',
                  }
                }}
              >
                מתאמן חדש
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        {/* Search, Filters and View Options */}
        <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 14px 0 rgba(32, 40, 45, 0.08)' }}>
          <Grid container spacing={2} alignItems="center" component="div">
            <Grid item xs={12} md={5} component="div">
              <TextField
                fullWidth
                placeholder="חיפוש מתאמנים לפי שם, אימייל, טלפון או תוכנית..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={7} component="div">
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems="center" 
                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                sx={{ width: '100%' }}
              >
                <Box>
                  <Button
                    startIcon={<FilterListIcon />}
                    variant="outlined"
                    size="medium"
                    onClick={handleMenuOpen}
                    sx={{ 
                      borderRadius: '8px',
                      '& .MuiButton-startIcon': { marginLeft: 0.5 }
                    }}
                  >
                    סינון
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        borderRadius: '10px',
                        minWidth: 180,
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => { setFilter('all'); handleMenuClose(); }}>
                      <Typography variant="body2" fontWeight={filter === 'all' ? 600 : 400}>
                        הכל
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { setFilter('active'); handleMenuClose(); }}>
                      <Typography variant="body2" fontWeight={filter === 'active' ? 600 : 400} color={filter === 'active' ? 'success.main' : 'inherit'}>
                        פעילים
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { setFilter('pending'); handleMenuClose(); }}>
                      <Typography variant="body2" fontWeight={filter === 'pending' ? 600 : 400} color={filter === 'pending' ? 'warning.main' : 'inherit'}>
                        ממתינים
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { setFilter('inactive'); handleMenuClose(); }}>
                      <Typography variant="body2" fontWeight={filter === 'inactive' ? 600 : 400} color={filter === 'inactive' ? 'error.main' : 'inherit'}>
                        לא פעילים
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Box>
                
                <Divider orientation="vertical" flexItem />
                
                <ToggleButtonGroup
                  value={viewType}
                  exclusive
                  onChange={handleViewTypeChange}
                  aria-label="view type"
                  size="small"
                >
                  <ToggleButton value="list" aria-label="list view">
                    <Tooltip title="תצוגת רשימה">
                      <ViewListIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="grid" aria-label="grid view">
                    <Tooltip title="תצוגת גריד">
                      <GridViewIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="table" aria-label="table view">
                    <Tooltip title="תצוגת טבלה">
                      <TableRowsIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
                
                <Tooltip title="ייצא לקובץ Excel">
                  <IconButton color="primary">
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Card>
        
        {/* Status Chips - Quick Filter */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={`הכל (${clients.length})`}
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'filled' : 'outlined'}
            color="primary"
            sx={{ fontWeight: 500 }}
          />
          <Chip 
            label={`פעילים (${clients.filter(c => c.status === 'active').length})`}
            onClick={() => setFilter('active')}
            variant={filter === 'active' ? 'filled' : 'outlined'}
            color="success"
            sx={{ fontWeight: 500 }}
          />
          <Chip 
            label={`ממתינים (${clients.filter(c => c.status === 'pending').length})`}
            onClick={() => setFilter('pending')}
            variant={filter === 'pending' ? 'filled' : 'outlined'}
            color="warning"
            sx={{ fontWeight: 500 }}
          />
          <Chip 
            label={`לא פעילים (${clients.filter(c => c.status === 'inactive').length})`}
            onClick={() => setFilter('inactive')}
            variant={filter === 'inactive' ? 'filled' : 'outlined'}
            color="error"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        {/* Clients Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2, 
              '& .MuiAlert-icon': { alignItems: 'center' } 
            }}
          >
            {error}
          </Alert>
        ) : filteredClients.length === 0 ? (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.lighter, 0.5),
              border: `1px dashed ${theme.palette.primary.main}`
            }}
          >
            <Typography variant="h6" gutterBottom color="text.primary">
              לא נמצאו מתאמנים
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              נסה לשנות את פרמטרי החיפוש או הוסף מתאמן חדש
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddClient}
            >
              הוסף מתאמן חדש
            </Button>
          </Paper>
        ) : (
          <>
            {viewType === 'table' && renderTableView()}
            {viewType === 'list' && renderListView()}
            {viewType === 'grid' && renderGridView()}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default ClientsPage;
