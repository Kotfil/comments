import React from 'react';
import { Box, BoxProps } from '@mui/material';

export interface AvatarProps extends Omit<BoxProps, 'component'> {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const Avatar: React.FC<AvatarProps> = ({ 
  children, 
  size = 'medium',
  ...props 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      default:
        return 32;
    }
  };

  return (
    <Box
      component="span"
      sx={{
        width: getSize(),
        height: getSize(),
        borderRadius: '50%',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${getSize() * 0.5}px`,
        flexShrink: 0,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
