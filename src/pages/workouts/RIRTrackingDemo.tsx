import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import { ExerciseSet } from '../../types/exercise';
import SetLogTable from '../../components/common/inputs/SetLogTable';
import PreviousPerformanceComparison from '../../components/widgets/previous-performance';

// Sample previous performance data
const SAMPLE_PREVIOUS_PERFORMANCE = {
  workoutId: 123,
  title: "אימון כוח עליון",
  completedAt: "2025-04-10T09:30:00Z",
  exercises: [
    {
      id: 1,
      name: "לחיצת חזה",
      sets: [
        { setNumber: 1, actualWeight: 60, actualReps: 10, actualRir: 2 },
        { setNumber: 2, actualWeight: 70, actualReps: 8, actualRir: 1 },
        { setNumber: 3, actualWeight: 75, actualReps: 6, actualRir: 0 },
      ]
    },
    {
      id: 2,
      name: "מתח",
      sets: [
        { setNumber: 1, actualWeight: 0, actualReps: 12, actualRir: 3 },
        { setNumber: 2, actualWeight: 0, actualReps: 10, actualRir: 2 },
        { setNumber: 3, actualWeight: 0, actualReps: 8, actualRir: 1 },
      ]
    }
  ],
  volume: 1240
};

// Sample current exercise data
const INITIAL_BENCH_PRESS_SETS: ExerciseSet[] = [
  {
    setNumber: 1,
    plannedReps: 10,
    plannedWeight: 65,
    plannedRir: 2,
    completed: false
  },
  {
    setNumber: 2,
    plannedReps: 8,
    plannedWeight: 75,
    plannedRir: 1,
    completed: false
  },
  {
    setNumber: 3,
    plannedReps: 6,
    plannedWeight: 80,
    plannedRir: 0,
    completed: false
  }
];

/**
 * RIR Tracking Demo Page
 * 
 * This page demonstrates the Reps In Reserve (RIR) tracking feature
 * including the ability to log sets with RIR values and compare with
 * previous performance.
 */
const RIRTrackingDemo: React.FC = () => {
  const [benchPressSets, setBenchPressSets] = useState<ExerciseSet[]>(INITIAL_BENCH_PRESS_SETS);
  const [currentVolume, setCurrentVolume] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Handle changes to bench press sets
  const handleBenchPressSetsChange = (sets: ExerciseSet[]) => {
    setBenchPressSets(sets);
    
    // Calculate current volume
    let volume = 0;
    sets.forEach(set => {
      if (set.completed && set.actualReps && set.actualWeight) {
        volume += set.actualReps * Number(set.actualWeight);
      }
    });
    
    setCurrentVolume(volume);
  };
  
  // Simulate saving the workout
  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        מעקב RIR (Reps In Reserve)
      </Typography>
      
      <Typography variant="body1" paragraph>
        מערכת מעקב RIR מאפשרת לעקוב אחר עצימות האימון באמצעות מדידת מספר החזרות שנשארו "ברזרבה" בסוף כל סט.
        RIR=0 משמעותו אימון עד כשל מלא, בעוד RIR=3 משמעותו שיכולת לבצע עוד 3 חזרות.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Previous Performance */}
        <Grid item xs={12}>
          <PreviousPerformanceComparison
            previousPerformance={SAMPLE_PREVIOUS_PERFORMANCE}
            currentVolume={currentVolume}
          />
        </Grid>
        
        {/* Current Workout */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              אימון נוכחי: אימון כוח עליון
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                לחיצת חזה
              </Typography>
              
              <SetLogTable
                sets={benchPressSets}
                onSetsChange={handleBenchPressSetsChange}
                loading={loading}
                showPreviousPerformance={true}
                previousSets={SAMPLE_PREVIOUS_PERFORMANCE.exercises[0].sets}
              />
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
                {loading ? 'שומר...' : 'שמור אימון'}
              </Button>
              
              <Box>
                <Typography variant="body1">
                  <strong>נפח נוכחי:</strong> {currentVolume || 0}
                </Typography>
                {currentVolume && SAMPLE_PREVIOUS_PERFORMANCE.volume && (
                  <Typography variant="body2" color={currentVolume > SAMPLE_PREVIOUS_PERFORMANCE.volume ? 'success.main' : 'error.main'}>
                    {currentVolume > SAMPLE_PREVIOUS_PERFORMANCE.volume ? '↑' : '↓'} 
                    {Math.abs(((currentVolume - SAMPLE_PREVIOUS_PERFORMANCE.volume) / SAMPLE_PREVIOUS_PERFORMANCE.volume) * 100).toFixed(1)}% 
                    {currentVolume > SAMPLE_PREVIOUS_PERFORMANCE.volume ? ' יותר' : ' פחות'} מהאימון הקודם
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* RIR Explanation */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="מהו RIR (Reps In Reserve)?" />
            <CardContent>
              <Typography variant="body1" paragraph>
                RIR, או Reps In Reserve, הוא כלי למדידת עצימות האימון. הוא מתאר כמה חזרות נוספות היית יכול לבצע בסט מסוים אם היית דוחף את עצמך למקסימום.
              </Typography>
              
              <Box sx={{ ml: 2 }}>
                <Typography><strong>RIR 0:</strong> לא יכולת לבצע אפילו חזרה אחת נוספת (כשל מלא)</Typography>
                <Typography><strong>RIR 1:</strong> יכולת לבצע עוד חזרה אחת בלבד</Typography>
                <Typography><strong>RIR 2:</strong> יכולת לבצע עוד 2 חזרות</Typography>
                <Typography><strong>RIR 3:</strong> יכולת לבצע עוד 3 חזרות</Typography>
                <Typography><strong>RIR 4+:</strong> יכולת לבצע 4 או יותר חזרות נוספות (קל מדי)</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Benefits of RIR */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="יתרונות השימוש ב-RIR" />
            <CardContent>
              <Typography variant="body1" paragraph>
                שימוש במדד ה-RIR מציע מספר יתרונות משמעותיים לאימון:
              </Typography>
              
              <Box sx={{ ml: 2 }}>
                <Typography>• מדידה מדויקת יותר של עצימות האימון</Typography>
                <Typography>• תכנון התקדמות הדרגתית (רגרסיה/פרוגרסיה) באימונים</Typography>
                <Typography>• הפחתת הסיכון לאימון יתר ופציעות</Typography>
                <Typography>• שליטה טובה יותר בעומס האימון לאורך זמן</Typography>
                <Typography>• מתן משוב מהימן למתאמן ולמאמן</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          האימון נשמר בהצלחה!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RIRTrackingDemo;