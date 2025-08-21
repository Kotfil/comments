import React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import { TypographyProps } from './typography.types';

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body1',
  children,
  color = 'primary',
  ...props 
}) => {
  return (
    <MuiTypography
      variant={variant}
      color={color}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

export type { TypographyProps };
