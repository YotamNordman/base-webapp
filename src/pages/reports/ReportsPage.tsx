import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  Button,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  TimelineOutlined as TimelineIcon,
  AssessmentOutlined as AssessmentIcon, 
  PieChartOutlined as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon
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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ReportsPage: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <BarChartIcon sx={{ mr: 2, fontSize: 32 }} />
          דוחות וניתוח נתונים
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="סיכום" icon={<AssessmentIcon />} />
          <Tab label="מתאמנים" icon={<PeopleIcon />} />
          <Tab label="אימונים" icon={<TimelineIcon />} />
          <Tab label="התקדמות" icon={<TrendingUpIcon />} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                מערכת הדוחות עדיין בפיתוח. בקרוב תוכלו ליהנות מניתוח מידע וחיזויים מתקדמים שיעזרו לכם לשפר את האימונים והתוצאות.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 2 }}>
                <CardHeader title="סיכום חודשי" />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PieChartIcon color="primary" sx={{ fontSize: 80, opacity: 0.5 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    נתוני סיכום חודשי יופיעו כאן בקרוב
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 2 }}>
                <CardHeader title="מגמות ביצועים" />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TimelineIcon color="primary" sx={{ fontSize: 80, opacity: 0.5 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    נתוני מגמות ביצועים יופיעו כאן בקרוב
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column' }}>
            <PeopleIcon color="primary" sx={{ fontSize: 80, opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" mb={2}>דוחות מתאמנים</Typography>
            <Typography variant="body2" color="text.secondary" mb={3} textAlign="center" maxWidth="600px">
              הדוחות המפורטים מספקים ניתוח מעמיק של הביצועים והנוכחות של כל מתאמן, מאפשרים לך לראות את ההתקדמות לאורך זמן ולזהות מגמות.
            </Typography>
            <Button variant="contained" disabled>
              טרם זמין
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column' }}>
            <TimelineIcon color="primary" sx={{ fontSize: 80, opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" mb={2}>דוחות אימונים</Typography>
            <Typography variant="body2" color="text.secondary" mb={3} textAlign="center" maxWidth="600px">
              דוחות מפורטים על ביצועי האימונים, כולל נתוני השלמה, סטטיסטיקות עומס ומגמות ביצועים לסוגי תרגילים שונים.
            </Typography>
            <Button variant="contained" disabled>
              טרם זמין
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column' }}>
            <TrendingUpIcon color="primary" sx={{ fontSize: 80, opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" mb={2}>דוחות התקדמות</Typography>
            <Typography variant="body2" color="text.secondary" mb={3} textAlign="center" maxWidth="600px">
              דוחות התקדמות מפורטים המציגים מגמות שיפור לאורך זמן במדדים שונים, כגון כוח, סיבולת, משקל, ומדדי גוף.
            </Typography>
            <Button variant="contained" disabled>
              טרם זמין
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ReportsPage;