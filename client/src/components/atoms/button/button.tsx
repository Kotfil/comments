import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { ButtonProps } from './button.types';

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  const getMuiVariant = (): 'contained' | 'outlined' | 'text' => {
    switch (variant) {
      case 'outline':
        return 'outlined';
      case 'secondary':
        return 'text';
      default:
        return 'contained';
    }
  };

  return (
    <MuiButton
      variant={getMuiVariant()}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
