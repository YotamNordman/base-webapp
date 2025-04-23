import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tab,
  Tabs,
  SelectChangeEvent
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // Form states
  const [language, setLanguage] = useState('he');
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [rtlEnabled, setRtlEnabled] = useState(true);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleThemeChange = (event: SelectChangeEvent) => {
    setTheme(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Save settings logic would go here
    alert('הגדרות נשמרו בהצלחה!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <SettingsIcon sx={{ mr: 2, fontSize: 32 }} />
          הגדרות
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="כללי" icon={<SettingsIcon />} />
          <Tab label="חשבון" icon={<AccountIcon />} />
          <Tab label="התראות" icon={<NotificationsIcon />} />
          <Tab label="אבטחה" icon={<SecurityIcon />} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleFormSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardHeader title="שפה ותצוגה" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="language-select-label">שפה</InputLabel>
                          <Select
                            labelId="language-select-label"
                            id="language-select"
                            value={language}
                            onChange={handleLanguageChange}
                            label="שפה"
                          >
                            <MenuItem value="he">עברית</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="theme-select-label">ערכת נושא</InputLabel>
                          <Select
                            labelId="theme-select-label"
                            id="theme-select"
                            value={theme}
                            onChange={handleThemeChange}
                            label="ערכת נושא"
                          >
                            <MenuItem value="light">בהיר</MenuItem>
                            <MenuItem value="dark">כהה</MenuItem>
                            <MenuItem value="system">ברירת מחדל מערכת</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={rtlEnabled} 
                              onChange={(e) => setRtlEnabled(e.target.checked)} 
                              color="primary"
                            />
                          }
                          label="תמיכה בכיוון RTL (ימין לשמאל)"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardHeader title="פרטי יצירת קשר" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="דוא״ל"
                          variant="outlined"
                          defaultValue="user@example.com"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="טלפון"
                          variant="outlined"
                          defaultValue="050-1234567"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                  >
                    שמור הגדרות
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Alert severity="info" sx={{ mb: 3 }}>
            הגדרות החשבון יהיו זמינות בקרוב.
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column' }}>
            <AccountIcon color="primary" sx={{ fontSize: 80, opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" mb={2}>הגדרות חשבון</Typography>
            <Typography variant="body2" color="text.secondary" mb={3} textAlign="center" maxWidth="600px">
              כאן תוכלו לנהל את פרטי החשבון שלכם, לשנות סיסמה, ולהתאים את הגדרות הפרופיל האישי.
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box component="form" onSubmit={handleFormSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 2 }}>
                  <CardHeader title="הגדרות התראות" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={emailNotifications} 
                              onChange={(e) => setEmailNotifications(e.target.checked)} 
                              color="primary"
                            />
                          }
                          label="התראות בדוא״ל"
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 3, mt: 0.5 }}>
                          קבלת הודעות עדכון, תזכורות ועוד באמצעות דוא״ל
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={pushNotifications} 
                              onChange={(e) => setPushNotifications(e.target.checked)} 
                              color="primary"
                            />
                          }
                          label="התראות דחיפה"
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 3, mt: 0.5 }}>
                          קבלת התראות מיידיות באפליקציה
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={smsNotifications} 
                              onChange={(e) => setSmsNotifications(e.target.checked)} 
                              color="primary"
                            />
                          }
                          label="התראות SMS"
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 3, mt: 0.5 }}>
                          קבלת התראות באמצעות הודעות טקסט (עשוי להיות כרוך בתשלום)
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                  >
                    שמור הגדרות
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Alert severity="info" sx={{ mb: 3 }}>
            הגדרות האבטחה יהיו זמינות בקרוב.
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column' }}>
            <SecurityIcon color="primary" sx={{ fontSize: 80, opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" mb={2}>הגדרות אבטחה</Typography>
            <Typography variant="body2" color="text.secondary" mb={3} textAlign="center" maxWidth="600px">
              כאן תוכלו לנהל את הגדרות האבטחה של החשבון שלכם, כולל שינוי סיסמה, הגדרת אימות דו-שלבי, וניהול הרשאות גישה.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Settings;
