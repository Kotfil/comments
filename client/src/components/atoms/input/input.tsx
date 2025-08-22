import React from 'react';
import { TextField } from '@mui/material';
import { InputProps } from './input.types';

export type { InputProps };

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
