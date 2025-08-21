import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  const getMuiVariant = (): MuiButtonProps['variant'] => {
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
