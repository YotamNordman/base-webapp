import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TrainingMethodology, BlockType, WorkoutType } from '../../../types/methodology';

interface MethodologyDetailsProps {
  methodology: TrainingMethodology;
  selectedBlockType?: BlockType;
  selectedWorkoutType?: WorkoutType;
}

const MethodologyDetails: React.FC<MethodologyDetailsProps> = ({
  methodology,
  selectedBlockType,
  selectedWorkoutType
}) => {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" color="primary.main">Training Methodology</Typography>
          <Chip 
            label={methodology.name} 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {methodology.description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Block Type Section */}
        {selectedBlockType && (
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Applied Block Type: {selectedBlockType.name}
            </Typography>
            <Typography variant="body2" paragraph>
              {selectedBlockType.description}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Recommended Duration:</strong> {selectedBlockType.recommendedDuration.min}-{selectedBlockType.recommendedDuration.max} weeks
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Recommended Frequency:</strong> {selectedBlockType.recommendedFrequency.min}-{selectedBlockType.recommendedFrequency.max} workouts/week
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Recommended Volume Range:</strong> {selectedBlockType.recommendedVolumeRange.min}-{selectedBlockType.recommendedVolumeRange.max} sets per muscle group per week
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Workout Type Section */}
        {selectedWorkoutType && (
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Applied Workout Type: {selectedWorkoutType.name}
            </Typography>
            <Typography variant="body2" paragraph>
              {selectedWorkoutType.description}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Purpose:</strong> {selectedWorkoutType.purpose}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Recommended Frequency:</strong> {selectedWorkoutType.recommendedFrequency}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Default Duration:</strong> {selectedWorkoutType.defaultDuration} minutes
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Methodology Details Accordion */}
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Methodology Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {/* Workout Types */}
              {methodology.workoutTypes.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Workout Types
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {methodology.workoutTypes.map(workoutType => (
                      <Chip 
                        key={workoutType.id} 
                        label={workoutType.name} 
                        size="small"
                        variant="outlined"
                        sx={{ 
                          bgcolor: workoutType.id === selectedWorkoutType?.id ? 'primary.light' : 'transparent',
                          color: workoutType.id === selectedWorkoutType?.id ? 'white' : 'inherit'
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
              
              {/* Block Types */}
              {methodology.blockTypes.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Block Types
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {methodology.blockTypes.map(blockType => (
                      <Chip 
                        key={blockType.id} 
                        label={blockType.name} 
                        size="small"
                        variant="outlined"
                        sx={{ 
                          bgcolor: blockType.id === selectedBlockType?.id ? 'primary.light' : 'transparent',
                          color: blockType.id === selectedBlockType?.id ? 'white' : 'inherit'
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
              
              {/* Training Styles */}
              {methodology.trainingStyles.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Training Styles
                  </Typography>
                  <Box mb={2}>
                    {methodology.trainingStyles.map(style => (
                      <Box key={style.id} mb={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {style.name}
                        </Typography>
                        <Typography variant="body2">
                          {style.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sets: {style.setsRange.min}-{style.setsRange.max} | 
                          Reps: {style.repsRange.min}-{style.repsRange.max} | 
                          Rest: {style.restRange.min}-{style.restRange.max}s | 
                          Target RIR: {style.recommenededRir}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
              
              {/* RIR Ranges */}
              {methodology.rirRanges.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    RIR Ranges
                  </Typography>
                  <Box mb={2}>
                    {methodology.rirRanges.map(rirRange => (
                      <Box key={rirRange.id} mb={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {rirRange.name}
                        </Typography>
                        <Typography variant="body2">
                          Target: {rirRange.targetRir} RIR | Range: {rirRange.minRir}-{rirRange.maxRir} RIR
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {rirRange.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
              
              {/* Exercise Progressions */}
              {methodology.exerciseProgressions.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Exercise Progressions
                  </Typography>
                  <Box mb={2}>
                    {methodology.exerciseProgressions.map(progression => (
                      <Box key={progression.id} mb={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {progression.name}
                        </Typography>
                        <Typography variant="body2">
                          {progression.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Strategy:</strong> {progression.progressionStrategy}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Deload:</strong> {progression.deloadStrategy}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
              
              {/* Measurement Protocol */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Measurement Protocol
                </Typography>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {methodology.measuringProtocol.name}
                  </Typography>
                  <Typography variant="body2">
                    {methodology.measuringProtocol.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Weight:</strong> {methodology.measuringProtocol.weightFrequency} | 
                    <strong> Measurements:</strong> {methodology.measuringProtocol.measurementsFrequency} | 
                    <strong> Photos:</strong> {methodology.measuringProtocol.photosFrequency}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default MethodologyDetails;