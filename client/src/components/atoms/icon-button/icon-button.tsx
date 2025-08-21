import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps, Tooltip } from '@mui/material';

export interface IconButtonProps extends Omit<IconButtonProps, 'children'> {
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  tooltip,
  onClick,
  ...props 
}) => {
  const button = (
    <MuiIconButton
      onClick={onClick}
      size="small"
      {...props}
    >
      {icon}
    </MuiIconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        {button}
      </Tooltip>
    );
  }

  return button;
};
