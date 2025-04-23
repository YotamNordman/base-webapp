import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Avatar, 
  Badge, 
  Divider, 
  Card, 
  CardContent, 
  CardHeader,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  IconButton,
  styled
} from '@mui/material';
import { 
  CameraAlt as CameraIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Lock as LockIcon,
  History as HistoryIcon,
  Add as AddIcon
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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const StyledBadge = styled(Badge)(({ theme }: { theme: any }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const ProfilePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'מאמן לדוגמה',
    email: 'coach@example.com',
    phone: '050-1234567',
    bio: 'מאמן כושר מוסמך עם ניסיון של 10 שנים. מתמחה באימוני כוח, שריפת שומן והכנה לתחרויות.',
    profilePicture: 'https://randomuser.me/api/portraits/men/44.jpg',
    specialties: ['אימוני כוח', 'פיתוח גוף', 'ירידה במשקל', 'אימון תפקודי'],
    certifications: [
      { id: 1, name: 'מדריך חדר כושר', issuer: 'מכון וינגייט', year: '2015' },
      { id: 2, name: 'מאמן כושר אישי', issuer: 'מכון וינגייט', year: '2016' },
      { id: 3, name: 'מאמן תזונת ספורט', issuer: 'מכללת INTAC', year: '2018' }
    ]
  });
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    // Save profile logic would go here
    setIsEditing(false);
    // Show success message
    alert('הפרופיל עודכן בהצלחה!');
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 2, fontSize: 32 }} />
          הפרופיל שלי
        </Typography>
        <Button 
          variant={isEditing ? "contained" : "outlined"}
          color={isEditing ? "primary" : "inherit"}
          startIcon={<EditIcon />}
          onClick={handleEditToggle}
        >
          {isEditing ? 'ביטול העריכה' : 'עריכת פרופיל'}
        </Button>
      </Box>
      
      <Paper sx={{ mb: 4, overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ p: 4, bgcolor: 'primary.main', color: 'white', position: 'relative' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box sx={{ position: 'relative' }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar
                    src={userData.profilePicture}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      border: '4px solid white',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                  />
                </StyledBadge>
                {isEditing && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0, 
                      bgcolor: 'primary.dark', 
                      borderRadius: '50%', 
                      p: 0.7,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.dark', opacity: 0.9 }
                    }}
                  >
                    <CameraIcon fontSize="small" />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs>
              {isEditing ? (
                <TextField 
                  fullWidth
                  label="שם"
                  variant="filled"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  InputProps={{ sx: { color: 'white', '&::before': { borderColor: 'white' } } }}
                  InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="h4" fontWeight="bold">
                  {userData.name}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {userData.specialties.map((specialty, index) => (
                  <Chip 
                    key={index} 
                    label={specialty} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
                    }} 
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="מידע אישי" icon={<PersonIcon />} />
          <Tab label="הסמכות" icon={<BadgeIcon />} />
          <Tab label="סיסמה ואבטחה" icon={<LockIcon />} />
          <Tab label="היסטוריית פעילות" icon={<HistoryIcon />} />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Box component={isEditing ? "form" : "div"} onSubmit={handleSaveProfile}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="פרטי קשר" />
                  <Divider />
                  <CardContent>
                    {isEditing ? (
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="דוא״ל"
                            variant="outlined"
                            value={userData.email}
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="טלפון"
                            variant="outlined"
                            value={userData.phone}
                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <List disablePadding>
                        <ListItem>
                          <ListItemText 
                            primary="דוא״ל" 
                            secondary={userData.email} 
                            primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                            secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="טלפון" 
                            secondary={userData.phone} 
                            primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                            secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                          />
                        </ListItem>
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="אודות" />
                  <Divider />
                  <CardContent>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        label="תיאור"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={userData.bio}
                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                      />
                    ) : (
                      <Typography variant="body1">
                        {userData.bio}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardHeader title="התמחויות" />
                  <Divider />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {userData.specialties.map((specialty, index) => (
                        <Chip 
                          key={index} 
                          label={specialty} 
                          color="primary" 
                          variant="outlined"
                          onDelete={isEditing ? () => {} : undefined}
                        />
                      ))}
                      {isEditing && (
                        <Chip 
                          icon={<AddIcon />} 
                          label="הוספת התמחות" 
                          variant="outlined" 
                          color="primary"
                          sx={{ borderStyle: 'dashed' }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {isEditing && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      size="large"
                    >
                      שמור שינויים
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Grid container spacing={3}>
              {userData.certifications.map((cert) => (
                <Grid item xs={12} md={4} key={cert.id}>
                  <Card variant="outlined">
                    <CardHeader 
                      title={cert.name} 
                      subheader={`${cert.issuer} | ${cert.year}`}
                      action={
                        isEditing ? (
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        ) : null
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        הסמכה זו מאשרת את הכישורים והידע המקצועי בתחום.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              
              {isEditing && (
                <Grid item xs={12} md={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderStyle: 'dashed',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <AddIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography color="primary">הוספת הסמכה חדשה</Typography>
                    </Box>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Alert severity="info" sx={{ mb: 3 }}>
            הגדרות האבטחה יהיו זמינות בקרוב.
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column' }}>
            <LockIcon color="primary" sx={{ fontSize: 80, opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" mb={2}>אבטחת חשבון</Typography>
            <Typography variant="body2" color="text.secondary" mb={3} textAlign="center" maxWidth="600px">
              כאן תוכלו לנהל את הגדרות האבטחה של החשבון שלכם, כולל שינוי סיסמה, הגדרת אימות דו-שלבי, וניהול הרשאות גישה.
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Alert severity="info" sx={{ mb: 3 }}>
            היסטוריית הפעילות תהיה זמינה בקרוב.
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column' }}>
            <HistoryIcon color="primary" sx={{ fontSize: 80, opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" mb={2}>היסטוריית פעילות</Typography>
            <Typography variant="body2" color="text.secondary" mb={3} textAlign="center" maxWidth="600px">
              כאן תוכלו לראות את היסטוריית הפעילות בחשבון שלכם, כולל התחברויות, שינויים בהגדרות, ופעולות נוספות.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfilePage;