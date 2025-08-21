import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  error?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ 
  variant = 'outlined',
  error = false,
  helperText,
  ...props 
}) => {
  return (
    <TextField
      variant={variant}
      error={error}
      helperText={helperText}
      fullWidth
      size="small"
      {...props}
    />
  );
};
