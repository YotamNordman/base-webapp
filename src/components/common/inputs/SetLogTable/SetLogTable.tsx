import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Typography,
  Box,
  Checkbox,
  CircularProgress,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DoneIcon from '@mui/icons-material/Done';
import { ExerciseSet } from '../../../../types/exercise';
import RIRSelector from '../RIRSelector';

export interface SetLogTableProps {
  sets: ExerciseSet[];
  onSetsChange: (sets: ExerciseSet[]) => void;
  loading?: boolean;
  exerciseName?: string;
  showPreviousPerformance?: boolean;
  previousSets?: {
    setNumber: number;
    actualWeight?: number;
    actualReps?: number;
    actualRir?: number;
  }[];
  disabled?: boolean;
}

/**
 * A component for logging workout sets with RIR tracking
 */
const SetLogTable: React.FC<SetLogTableProps> = ({
  sets,
  onSetsChange,
  loading = false,
  exerciseName,
  showPreviousPerformance = false,
  previousSets = [],
  disabled = false
}) => {
  const [localSets, setLocalSets] = useState<ExerciseSet[]>(sets);

  // Update local state when props change
  useEffect(() => {
    setLocalSets(sets);
  }, [sets]);

  // Handle changes to a specific set
  const handleSetChange = (index: number, field: keyof ExerciseSet, value: any) => {
    const updatedSets = [...localSets];
    updatedSets[index] = {
      ...updatedSets[index],
      [field]: value
    };
    
    setLocalSets(updatedSets);
    onSetsChange(updatedSets);
  };

  // Handle marking a set as completed
  const handleCompleteSet = (index: number) => {
    const updatedSets = [...localSets];
    updatedSets[index] = {
      ...updatedSets[index],
      completed: !updatedSets[index].completed
    };
    
    setLocalSets(updatedSets);
    onSetsChange(updatedSets);
  };

  // Add a new set
  const handleAddSet = () => {
    const newSetNumber = localSets.length > 0 ? Math.max(...localSets.map(s => s.setNumber)) + 1 : 1;
    const lastSet = localSets[localSets.length - 1];
    
    const newSet: ExerciseSet = {
      setNumber: newSetNumber,
      plannedReps: lastSet ? lastSet.plannedReps : 8,
      plannedWeight: lastSet ? lastSet.plannedWeight : 0,
      plannedRir: lastSet ? lastSet.plannedRir : 2,
      completed: false
    };
    
    const updatedSets = [...localSets, newSet];
    setLocalSets(updatedSets);
    onSetsChange(updatedSets);
  };

  // Remove a set
  const handleRemoveSet = (index: number) => {
    const updatedSets = localSets.filter((_, i) => i !== index);
    // Update set numbers to be consecutive
    const reorderedSets = updatedSets.map((set, i) => ({
      ...set,
      setNumber: i + 1
    }));
    
    setLocalSets(reorderedSets);
    onSetsChange(reorderedSets);
  };

  // Find previous set data for comparison
  const getPreviousSetData = (setNumber: number) => {
    return previousSets.find(s => s.setNumber === setNumber);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {exerciseName && (
        <Typography variant="h6" gutterBottom>
          {exerciseName}
        </Typography>
      )}
      
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Set</TableCell>
              <TableCell align="center">Planned Reps</TableCell>
              <TableCell align="center">Actual Reps</TableCell>
              <TableCell align="center">Planned Weight</TableCell>
              <TableCell align="center">Actual Weight</TableCell>
              <TableCell align="center">RIR</TableCell>
              <TableCell align="center">Done</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localSets.map((set, index) => {
              const previousSet = showPreviousPerformance ? getPreviousSetData(set.setNumber) : null;
              
              return (
                <TableRow key={set.setNumber}>
                  <TableCell align="center">{set.setNumber}</TableCell>
                  
                  {/* Planned Reps */}
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={set.plannedReps}
                      onChange={(e) => handleSetChange(index, 'plannedReps', parseInt(e.target.value) || 0)}
                      variant="outlined"
                      size="small"
                      disabled={disabled}
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={{ width: 70 }}
                    />
                  </TableCell>
                  
                  {/* Actual Reps */}
                  <TableCell align="center">
                    <Box sx={{ position: 'relative' }}>
                      <TextField
                        type="number"
                        value={set.actualReps || ''}
                        onChange={(e) => handleSetChange(index, 'actualReps', e.target.value ? parseInt(e.target.value) : null)}
                        variant="outlined"
                        size="small"
                        disabled={disabled || !set.completed}
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ width: 70 }}
                      />
                      {previousSet && previousSet.actualReps !== undefined && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            position: 'absolute', 
                            bottom: -18, 
                            left: 0, 
                            right: 0, 
                            textAlign: 'center' 
                          }}
                        >
                          Previous: {previousSet.actualReps}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  
                  {/* Planned Weight */}
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={set.plannedWeight || ''}
                      onChange={(e) => handleSetChange(index, 'plannedWeight', e.target.value ? parseFloat(e.target.value) : null)}
                      variant="outlined"
                      size="small"
                      disabled={disabled}
                      InputProps={{ inputProps: { min: 0, step: "0.5" } }}
                      sx={{ width: 70 }}
                    />
                  </TableCell>
                  
                  {/* Actual Weight */}
                  <TableCell align="center">
                    <Box sx={{ position: 'relative' }}>
                      <TextField
                        type="number"
                        value={set.actualWeight || ''}
                        onChange={(e) => handleSetChange(index, 'actualWeight', e.target.value ? parseFloat(e.target.value) : null)}
                        variant="outlined"
                        size="small"
                        disabled={disabled || !set.completed}
                        InputProps={{ inputProps: { min: 0, step: "0.5" } }}
                        sx={{ width: 70 }}
                      />
                      {previousSet && previousSet.actualWeight !== undefined && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            position: 'absolute', 
                            bottom: -18, 
                            left: 0, 
                            right: 0, 
                            textAlign: 'center' 
                          }}
                        >
                          Previous: {previousSet.actualWeight}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  
                  {/* RIR */}
                  <TableCell align="center">
                    <Box sx={{ position: 'relative', minWidth: 80 }}>
                      <RIRSelector
                        value={set.completed ? (set.actualRir || null) : (set.plannedRir || null)}
                        onChange={(value) => handleSetChange(
                          index,
                          set.completed ? 'actualRir' : 'plannedRir',
                          value
                        )}
                        fullWidth
                        size="small"
                        disabled={disabled || (set.completed && !set.actualReps)}
                        label={set.completed ? "Actual RIR" : "Planned RIR"}
                      />
                      {previousSet && previousSet.actualRir !== undefined && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            position: 'absolute', 
                            bottom: -18, 
                            left: 0, 
                            right: 0, 
                            textAlign: 'center' 
                          }}
                        >
                          Previous: {previousSet.actualRir}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  
                  {/* Completed */}
                  <TableCell align="center">
                    <Checkbox
                      checked={set.completed}
                      onChange={() => handleCompleteSet(index)}
                      disabled={disabled}
                      color="primary"
                    />
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveSet(index)}
                      disabled={disabled || localSets.length <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddSet}
          disabled={disabled || loading}
          variant="outlined"
          size="small"
        >
          Add Set
        </Button>
        
        {loading && <CircularProgress size={24} />}
      </Box>
    </Box>
  );
};

export default SetLogTable;