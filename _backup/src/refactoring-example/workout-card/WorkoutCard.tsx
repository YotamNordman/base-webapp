import React from 'react';
import { Card, CardContent } from '@mui/material';
import { WorkoutCardHeader } from './WorkoutCardHeader';
import { ExercisesList } from './ExercisesList';
import { WorkoutCardActions } from './WorkoutCardActions';
import { WorkoutCardProps } from './types';
import { formatWorkoutDate } from './utils';

export const WorkoutCard: React.FC<WorkoutCardProps> = (props) => {
  // Format the date
  const formattedDate = formatWorkoutDate(props.scheduledFor);

  return (
    <Card sx={{ 
      mb: 2, 
      borderRadius: 2, 
      borderRight: props.completed ? '4px solid #4caf50' : '4px solid #ff9800' 
    }}>
      <CardContent>
        <WorkoutCardHeader
          title={props.title}
          description={props.description}
          clientName={props.clientName}
          formattedDate={formattedDate}
          completed={props.completed}
        />
        
        <ExercisesList exercises={props.exercises} />
        
        <WorkoutCardActions
          id={props.id}
          completed={props.completed}
          onComplete={props.onComplete}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
        />
      </CardContent>
    </Card>
  );
};
