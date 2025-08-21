import { AlertProps as MuiAlertProps } from '@mui/material';

export interface AlertProps extends Omit<MuiAlertProps, 'severity'> {
  severity?: 'success' | 'info' | 'warning' | 'error';
  children: React.ReactNode;
  title?: string;
}
