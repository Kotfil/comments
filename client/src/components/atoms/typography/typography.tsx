import React from 'react';
import { Typography as MuiTypography, TypographyProps } from '@mui/material';

export interface TypographyProps extends TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'subtitle1' | 'subtitle2';
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

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
