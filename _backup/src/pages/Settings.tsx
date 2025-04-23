import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import PaletteIcon from '@mui/icons-material/Palette';
import LanguageIcon from '@mui/icons-material/Language';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useAuth } from '../hooks/useAuth';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState<number>(0);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || 'מנהל מערכת',
    email: user?.email || 'admin@example.com',
    phone: '052-1234567',
    bio: 'מאמן כושר מוסמך עם 5 שנות ניסיון. מתמחה באימוני כוח ובניית תוכניות אישיות.'
  });
  
  // Password settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newClientAlert: true,
    completedWorkoutAlert: true,
    messageAlert: true,
    reminderAlert: true
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: false,
    highContrast: false,
    fontSize: 'medium',
    language: 'he'
  });
  
  // Success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTogglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAppearanceChange = (name: string, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, we would send to the API
    setSuccessMessage('פרטי הפרופיל נשמרו בהצלחה');
  };
  
  const handleSavePassword = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return; // Would show an error in a real app
    }
    
    // In a real app, we would send to the API
    setSuccessMessage('הסיסמה עודכנה בהצלחה');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handleSaveNotifications = () => {
    // In a real app, we would send to the API
    setSuccessMessage('הגדרות ההתראות נשמרו בהצלחה');
  };
  
  const handleSaveAppearance = () => {
    // In a real app, we would send to the API
    setSuccessMessage('הגדרות התצוגה נשמרו בהצלחה');
  };
  
  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="right">
          הגדרות
        </Typography>
        <Typography variant="body1" color="text.secondary" align="right">
          נהל את חשבונך והעדפות המערכת
        </Typography>
      </Box>
      
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab label="פרופיל" icon={<AccountCircleIcon />} iconPosition="start" />
            <Tab label="אבטחה" icon={<SecurityIcon />} iconPosition="start" />
            <Tab label="התראות" icon={<NotificationsIcon />} iconPosition="start" />
            <Tab label="תצוגה ושפה" icon={<PaletteIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
              <Grid container spacing={3} component="div">
                <Grid item xs={12} md={4} component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      mb: 2
                    }}
                  >
                    {profileData.name.charAt(0)}
                  </Box>
                  <Button variant="outlined" color="primary">
                    שנה תמונה
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={8} component="div">
                  <Typography variant="h6" gutterBottom align="right">
                    פרטים אישיים
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="שם מלא"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    sx={{ mb: 2 }}
                    dir="rtl"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="אימייל"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    sx={{ mb: 2 }}
                    dir="rtl"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlternateEmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="טלפון"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    sx={{ mb: 2 }}
                    dir="rtl"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="תיאור קצר"
                    name="bio"
                    multiline
                    rows={3}
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    sx={{ mb: 2 }}
                    dir="rtl"
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                    >
                      שמור שינויים
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
        
        {/* Security Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="right">
                שינוי סיסמה
              </Typography>
              
              <TextField
                fullWidth
                label="סיסמה נוכחית"
                name="currentPassword"
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                sx={{ mb: 2 }}
                dir="rtl"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePasswordVisibility('current')}
                        edge="end"
                      >
                        {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="סיסמה חדשה"
                name="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                sx={{ mb: 2 }}
                dir="rtl"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePasswordVisibility('new')}
                        edge="end"
                      >
                        {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="אימות סיסמה חדשה"
                name="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                sx={{ mb: 2 }}
                dir="rtl"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePasswordVisibility('confirm')}
                        edge="end"
                      >
                        {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? 'הסיסמאות אינן תואמות' : ''}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSavePassword}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                >
                  עדכן סיסמה
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom align="right">
                הגדרות אבטחה נוספות
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="אימות דו-שלבי" 
                    secondary="הגנה נוספת על החשבון שלך באמצעות קוד אימות"
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={<Switch />}
                      label="מושבת"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <DataUsageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="ניהול מכשירים מחוברים" 
                    secondary="צפייה ושליטה במכשירים שמחוברים לחשבונך"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" size="small">
                      נהל
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </TabPanel>
        
        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="right">
                הגדרות התראות
              </Typography>
              
              <Typography variant="subtitle1" align="right" sx={{ mt: 2 }}>
                ערוצי התראות
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="התראות דוא״ל" 
                    secondary="קבל התראות ועדכונים בדוא״ל"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      name="emailNotifications"
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="התראות פוש" 
                    secondary="קבל התראות בזמן אמת במכשיר שלך"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onChange={handleNotificationChange}
                      name="pushNotifications"
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="התראות SMS" 
                    secondary="קבל התראות דחופות ב-SMS"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onChange={handleNotificationChange}
                      name="smsNotifications"
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" align="right" sx={{ mt: 2 }}>
                סוגי התראות
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="מתאמן חדש" 
                    secondary="קבל התראה כאשר מתאמן חדש נרשם"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.newClientAlert}
                      onChange={handleNotificationChange}
                      name="newClientAlert"
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="אימון הושלם" 
                    secondary="קבל התראה כאשר מתאמן משלים אימון"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.completedWorkoutAlert}
                      onChange={handleNotificationChange}
                      name="completedWorkoutAlert"
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="הודעה חדשה" 
                    secondary="קבל התראה כאשר מתקבלת הודעה חדשה ממתאמן"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.messageAlert}
                      onChange={handleNotificationChange}
                      name="messageAlert"
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="תזכורות" 
                    secondary="קבל תזכורות על אימונים מתוכננים ומשימות"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.reminderAlert}
                      onChange={handleNotificationChange}
                      name="reminderAlert"
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSaveNotifications}
                >
                  שמור הגדרות
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
        
        {/* Appearance Tab */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="right">
                תצוגה
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="מצב כהה" 
                    secondary="השתמש בערכת צבעים כהה"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={appearanceSettings.darkMode}
                      onChange={(e) => handleAppearanceChange('darkMode', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="ניגודיות גבוהה" 
                    secondary="הגבר ניגודיות לשיפור הקריאות"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={appearanceSettings.highContrast}
                      onChange={(e) => handleAppearanceChange('highContrast', e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="גודל טקסט" 
                    secondary="שנה את גודל הטקסט במערכת"
                  />
                  <ListItemSecondaryAction>
                    <FormControl sx={{ minWidth: 120 }}>
                      <Select
                        value={appearanceSettings.fontSize}
                        onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                        size="small"
                      >
                        <MenuItem value="small">קטן</MenuItem>
                        <MenuItem value="medium">בינוני</MenuItem>
                        <MenuItem value="large">גדול</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom align="right">
                שפה
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="שפת ממשק" 
                    secondary="בחר את השפה המועדפת עליך"
                  />
                  <ListItemSecondaryAction>
                    <FormControl sx={{ minWidth: 120 }}>
                      <Select
                        value={appearanceSettings.language}
                        onChange={(e) => handleAppearanceChange('language', e.target.value)}
                        size="small"
                      >
                        <MenuItem value="he">עברית</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="ar">العربية</MenuItem>
                        <MenuItem value="ru">Русский</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSaveAppearance}
                >
                  שמור הגדרות
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>
      
      {/* Success message snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccessMessage} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;
