import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { Input } from '@/components/atomic/input';
import { FormFieldProps } from './form-field.types';

export type { FormFieldProps };

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  type = 'text',
  placeholder,
  multiline = false,
  rows = 1,
  required = false,
  infoText,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  return (
    <Box sx={{ mb: 2 }}>
      {infoText && (
        <Alert severity="info" sx={{ mb: 1 }}>
          <Typography variant="body2">{infoText}</Typography>
        </Alert>
      )}

      <Input
        label={`${label}${required ? ' *' : ''}`}
        name={name}
        value={value}
        onChange={handleChange}
        error={!!error}
        helperText={error || helperText}
        type={type}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
      />
    </Box>
  );
};
