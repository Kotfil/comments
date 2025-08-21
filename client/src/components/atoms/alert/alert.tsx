import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps } from '@mui/material';

export interface AlertProps extends Omit<MuiAlertProps, 'severity'> {
  severity?: 'success' | 'info' | 'warning' | 'error';
  children: React.ReactNode;
  title?: string;
}

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
