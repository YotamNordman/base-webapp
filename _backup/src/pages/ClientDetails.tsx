import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button,
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Paper,
  List,
  ListItem,
  Chip,
  TextField,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ScaleIcon from '@mui/icons-material/Scale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatIcon from '@mui/icons-material/Chat';
import { useParams, useNavigate } from 'react-router-dom';

// Mock client data interface
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
  height?: number;
  weight?: number;
  bodyFat?: number;
  goals?: string;
  medicalNotes?: string;
  birthDate?: string;
  address?: string;
}

// Mock workout data interface
interface Workout {
  id: number;
  title: string;
  date: string;
  completed: boolean;
  exercises: number;
}

// Mock measurement data interface
interface Measurement {
  id: number;
  date: string;
  weight: number;
  bodyFat?: number;
  notes?: string;
}

// Mock message data interface
interface Message {
  id: number;
  date: string;
  content: string;
  sender: 'client' | 'coach';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Mock data for other tabs
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Form state for editing
  const [formData, setFormData] = useState<Client | null>(null);

  // Fetch client data on component mount
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from the API
        // API call would be implemented here
        
        // For now, we'll use mock data
        const mockClient: Client = {
          id: id || '2',
          name: 'רונית כהן',
          email: 'ronit@example.com',
          phone: '052-1234567',
          status: 'active',
          programType: 'אימון כוח',
          startDate: new Date(2024, 9, 15).toISOString(),
          lastActive: new Date(2025, 3, 21).toISOString(),
          workoutCount: 42,
          height: 168,
          weight: 65,
          bodyFat: 24,
          goals: 'חיזוק שרירים, שיפור סיבולת, ירידה באחוזי שומן',
          medicalNotes: 'כאבי גב קלים, יש להימנע ממשקל כבד בכפיפות',
          birthDate: new Date(1988, 5, 15).toISOString(),
          address: 'רחוב הרצל 42, תל אביב'
        };
        
        setClient(mockClient);
        setFormData(mockClient);
        
        // Mock workouts
        const mockWorkouts: Workout[] = [
          {
            id: 1,
            title: 'אימון כוח מלא',
            date: new Date(2025, 3, 21).toISOString(),
            completed: true,
            exercises: 8
          },
          {
            id: 2,
            title: 'אימון רגליים וליבה',
            date: new Date(2025, 3, 18).toISOString(),
            completed: true,
            exercises: 6
          },
          {
            id: 3,
            title: 'אימון עליון',
            date: new Date(2025, 3, 15).toISOString(),
            completed: true,
            exercises: 7
          },
          {
            id: 4,
            title: 'אימון קרדיו וכוח',
            date: new Date(2025, 3, 24).toISOString(),
            completed: false,
            exercises: 9
          }
        ];
        setWorkouts(mockWorkouts);
        
        // Mock measurements
        const mockMeasurements: Measurement[] = [
          {
            id: 1,
            date: new Date(2025, 3, 21).toISOString(),
            weight: 65,
            bodyFat: 24,
            notes: 'ירידה של 0.5 ק"ג מהשבוע שעבר'
          },
          {
            id: 2,
            date: new Date(2025, 3, 14).toISOString(),
            weight: 65.5,
            bodyFat: 24.2,
            notes: 'המשך מגמת ירידה'
          },
          {
            id: 3,
            date: new Date(2025, 3, 7).toISOString(),
            weight: 66,
            bodyFat: 24.5,
            notes: 'ירידה קלה במשקל ובאחוז שומן'
          },
          {
            id: 4,
            date: new Date(2025, 2, 31).toISOString(),
            weight: 67,
            bodyFat: 25,
            notes: 'משקל התחלתי לחודש אפריל'
          }
        ];
        setMeasurements(mockMeasurements);
        
        // Mock messages
        const mockMessages: Message[] = [
          {
            id: 1,
            date: new Date(2025, 3, 21, 10, 15).toISOString(),
            content: 'השלמתי את האימון של היום, הרגשתי ממש טוב!',
            sender: 'client'
          },
          {
            id: 2,
            date: new Date(2025, 3, 21, 10, 30).toISOString(),
            content: 'מעולה! מזכיר לך להקפיד על שתייה מרובה אחרי האימון ולהקפיד על התזונה שדיברנו עליה.',
            sender: 'coach'
          },
          {
            id: 3,
            date: new Date(2025, 3, 20, 18, 0).toISOString(),
            content: 'אני צריכה לדחות את האימון של מחר בשעה, אפשרי?',
            sender: 'client'
          },
          {
            id: 4,
            date: new Date(2025, 3, 20, 19, 45).toISOString(),
            content: 'בוודאי, נדחה לשעה 19:00 במקום 18:00. אשלח לך הזמנה מעודכנת ליומן.',
            sender: 'coach'
          }
        ];
        setMessages(mockMessages);
      } catch (err) {
        // Log error and set error message
        setError('אירעה שגיאה בטעינת פרטי המתאמן. נא לנסות שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBackToClients = () => {
    navigate('/clients');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset form data
      setFormData(client);
    }
    setIsEditing(!isEditing);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    try {
      // In a real app, we would send to the API
      // API call would be implemented here
      
      // For now, just update the local state
      setClient(formData);
      setIsEditing(false);
    } catch (err) {
      // Log error and set error message
      setError('אירעה שגיאה בשמירת פרטי המתאמן. נא לנסות שוב מאוחר יותר.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('he-IL');
  };

  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return null;
    
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getStatusColor = (status: 'active' | 'pending' | 'inactive'): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'success';
    }
  };

  const getStatusText = (status: 'active' | 'pending' | 'inactive'): string => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'pending': return 'ממתין';
      case 'inactive': return 'לא פעיל';
      default: return '';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!client) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          לא נמצאו פרטי מתאמן
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToClients}
        >
          חזרה למתאמנים
        </Button>
        
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />} 
              onClick={handleSave}
            >
              שמור שינויים
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<CancelIcon />} 
              onClick={handleEditToggle}
            >
              בטל
            </Button>
          </Box>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<EditIcon />} 
            onClick={handleEditToggle}
          >
            ערוך פרטים
          </Button>
        )}
      </Box>
      
      {/* Client Info Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} component="div">
            <Grid item xs={12} md={3} component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                alt={client.name}
                src={client.avatarUrl}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {client.name.charAt(0)}
              </Avatar>
              <Chip
                label={getStatusText(client.status)}
                color={getStatusColor(client.status)}
                sx={{ mb: 1, width: '100%' }}
              />
              <Typography variant="body2" color="text.secondary" align="center">
                מתאמן מאז {formatDate(client.startDate)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={9} component="div">
              {isEditing ? (
                // Edit mode
                <Grid container spacing={2} component="div">
                  <Grid item xs={12} md={6} component="div">
                    <TextField
                      fullWidth
                      label="שם מלא"
                      name="name"
                      value={formData?.name || ''}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                      dir="rtl"
                    />
                    <TextField
                      fullWidth
                      label="אימייל"
                      name="email"
                      type="email"
                      value={formData?.email || ''}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                      dir="rtl"
                    />
                    <TextField
                      fullWidth
                      label="טלפון"
                      name="phone"
                      value={formData?.phone || ''}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                      dir="rtl"
                    />
                    <TextField
                      fullWidth
                      label="כתובת"
                      name="address"
                      value={formData?.address || ''}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                      dir="rtl"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} component="div">
                    <TextField
                      fullWidth
                      select
                      label="סטטוס"
                      name="status"
                      value={formData?.status || 'active'}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                      dir="rtl"
                    >
                      <MenuItem value="active">פעיל</MenuItem>
                      <MenuItem value="pending">ממתין</MenuItem>
                      <MenuItem value="inactive">לא פעיל</MenuItem>
                    </TextField>
                    <TextField
                      fullWidth
                      label="סוג תוכנית"
                      name="programType"
                      value={formData?.programType || ''}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                      dir="rtl"
                    />
                    <TextField
                      fullWidth
                      label="תאריך לידה"
                      name="birthDate"
                      type="date"
                      value={formData?.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ''}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="גובה (ס״מ)"
                        name="height"
                        type="number"
                        value={formData?.height || ''}
                        onChange={handleFormChange}
                        sx={{ mb: 2, flexGrow: 1 }}
                        dir="rtl"
                      />
                      <TextField
                        label="משקל (ק״ג)"
                        name="weight"
                        type="number"
                        value={formData?.weight || ''}
                        onChange={handleFormChange}
                        sx={{ mb: 2, flexGrow: 1 }}
                        dir="rtl"
                      />
                      <TextField
                        label="% שומן"
                        name="bodyFat"
                        type="number"
                        value={formData?.bodyFat || ''}
                        onChange={handleFormChange}
                        sx={{ mb: 2, flexGrow: 1 }}
                        dir="rtl"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} component="div">
                    <TextField
                      fullWidth
                      label="מטרות"
                      name="goals"
                      multiline
                      rows={2}
                      value={formData?.goals || ''}
                      onChange={handleFormChange}
                      sx={{ mb: 2 }}
                      dir="rtl"
                    />
                    <TextField
                      fullWidth
                      label="הערות רפואיות"
                      name="medicalNotes"
                      multiline
                      rows={2}
                      value={formData?.medicalNotes || ''}
                      onChange={handleFormChange}
                      dir="rtl"
                    />
                  </Grid>
                </Grid>
              ) : (
                // View mode
                <>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {client.name}
                    {client.birthDate && (
                      <Typography variant="body1" component="span" color="text.secondary" sx={{ mr: 2 }}>
                        ({calculateAge(client.birthDate)} שנים)
                      </Typography>
                    )}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', mb: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body1">{client.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}>
                      <WhatsAppIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body1">{client.phone}</Typography>
                    </Box>
                    {client.address && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1">{client.address}</Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3} component="div">
                    <Grid item xs={12} md={6} component="div">
                      <Typography variant="h6" gutterBottom>
                        פרטי תוכנית
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>סוג תוכנית:</strong> {client.programType}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>אימונים שהושלמו:</strong> {client.workoutCount}
                      </Typography>
                      {client.goals && (
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>מטרות:</strong> {client.goals}
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={6} component="div">
                      <Typography variant="h6" gutterBottom>
                        פרטים פיזיים
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {client.height && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>גובה:</strong> {client.height} ס״מ
                          </Typography>
                        )}
                        {client.weight && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>משקל:</strong> {client.weight} ק״ג
                          </Typography>
                        )}
                        {client.bodyFat && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>אחוז שומן:</strong> {client.bodyFat}%
                          </Typography>
                        )}
                      </Box>
                      {client.medicalNotes && (
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>הערות רפואיות:</strong> {client.medicalNotes}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Tabs for different sections */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab label="אימונים" icon={<FitnessCenterIcon />} iconPosition="start" />
            <Tab label="מדידות" icon={<ScaleIcon />} iconPosition="start" />
            <Tab label="יומן" icon={<CalendarTodayIcon />} iconPosition="start" />
            <Tab label="הודעות" icon={<ChatIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        {/* Workouts Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FitnessCenterIcon />}
            >
              צור אימון חדש
            </Button>
          </Box>
          
          {workouts.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="body1" color="text.secondary">
                אין אימונים להצגה
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%' }}>
              {workouts.map((workout) => (
                <Paper key={workout.id} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">{workout.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(workout.date)} | {workout.exercises} תרגילים
                      </Typography>
                    </Box>
                    <Chip 
                      label={workout.completed ? "הושלם" : "מתוכנן"} 
                      color={workout.completed ? "success" : "primary"} 
                    />
                  </Box>
                </Paper>
              ))}
            </List>
          )}
        </TabPanel>
        
        {/* Measurements Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ScaleIcon />}
            >
              הוסף מדידה חדשה
            </Button>
          </Box>
          
          {measurements.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="body1" color="text.secondary">
                אין מדידות להצגה
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%' }}>
              {measurements.map((measurement) => (
                <Paper key={measurement.id} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{formatDate(measurement.date)}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Typography variant="body1">
                          <strong>משקל:</strong> {measurement.weight} ק"ג
                        </Typography>
                        {measurement.bodyFat && (
                          <Typography variant="body1">
                            <strong>אחוז שומן:</strong> {measurement.bodyFat}%
                          </Typography>
                        )}
                      </Box>
                      {measurement.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {measurement.notes}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </List>
          )}
        </TabPanel>
        
        {/* Calendar Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h6" color="text.secondary">
              יומן - בפיתוח
            </Typography>
            <Typography variant="body1" color="text.secondary">
              תכונה זו תהיה זמינה בקרוב!
            </Typography>
          </Box>
        </TabPanel>
        
        {/* Messages Tab */}
        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 3 }}>
            <List sx={{ width: '100%' }}>
              {messages.map((message) => (
                <ListItem 
                  key={message.id} 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: message.sender === 'client' ? 'flex-start' : 'flex-end',
                    mb: 2
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{ 
                      p: 2,
                      bgcolor: message.sender === 'client' ? 'grey.100' : 'primary.light',
                      borderRadius: 2,
                      maxWidth: '70%'
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                  </Paper>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatDateTime(message.date)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', mt: 3 }}>
              <TextField
                fullWidth
                placeholder="הקלד הודעה כאן..."
                multiline
                rows={2}
                dir="rtl"
              />
              <Button 
                variant="contained" 
                color="primary"
                sx={{ mr: 1, height: 'fit-content', alignSelf: 'flex-end' }}
              >
                שלח
              </Button>
            </Box>
          </Paper>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default ClientDetailsPage;
