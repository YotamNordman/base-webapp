import React from 'react';
import { 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export interface RIRSelectorProps {
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  required?: boolean;
  name?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

const RIR_DESCRIPTIONS = {
  0: 'Failure - Could not do any more reps',
  1: 'Almost Failure - Could barely do 1 more rep',
  2: 'Could definitely do 2 more reps',
  3: 'Moderately Hard - Could do 3 more reps',
  4: 'Somewhat Hard - Could do 4 more reps',
  5: 'Moderate - Could do 5+ more reps'
};

/**
 * RIR (Reps In Reserve) Selector component
 * 
 * This component provides a dropdown to select RIR values from 0-5
 * with descriptions to help users understand what each value means.
 */
const RIRSelector: React.FC<RIRSelectorProps> = ({
  value,
  onChange,
  label = 'Reps In Reserve (RIR)',
  disabled = false,
  error,
  helperText,
  required = false,
  name,
  fullWidth = true,
  size = 'medium'
}) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    const newValue = event.target.value === '' ? null : Number(event.target.value);
    onChange(newValue);
  };

  return (
    <FormControl 
      variant="outlined" 
      fullWidth={fullWidth} 
      size={size}
      disabled={disabled}
      error={!!error}
      required={required}
    >
      <Box display="flex" alignItems="center">
        <InputLabel>{label}</InputLabel>
        <Tooltip 
          title={
            <Typography variant="body2">
              RIR (Reps In Reserve) indicates how many more reps you could have done at the end of a set.
              <br/><br/>
              0 = Failure (could not do any more)
              <br/>
              5 = Easy (could do 5+ more)
            </Typography>
          }
        >
          <Box component="span" ml={1} display="inline-flex" alignItems="center">
            <HelpOutlineIcon fontSize="small" color="action" />
          </Box>
        </Tooltip>
      </Box>
      
      <Select
        value={value === null ? '' : value}
        onChange={handleChange}
        label={label}
        name={name}
      >
        {Object.entries(RIR_DESCRIPTIONS).map(([rir, description]) => (
          <MenuItem key={rir} value={rir}>
            <Box>
              <Typography variant="body1">{rir} - {description.split(' - ')[0]}</Typography>
              <Typography variant="caption" color="textSecondary">
                {description.split(' - ')[1] || ''}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
      
      {(helperText || error) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default RIRSelector;