import React from 'react';
import { Alert as MuiAlert } from '@mui/material';
import { AlertProps } from './alert.types';

export const Alert: React.FC<AlertProps> = ({ 
  severity = 'info',
  children,
  title,
  ...props 
}) => {
  return (
    <MuiAlert
      severity={severity}
      {...props}
    >
      {title && <strong>{title}</strong>}
      {children}
    </MuiAlert>
  );
};
