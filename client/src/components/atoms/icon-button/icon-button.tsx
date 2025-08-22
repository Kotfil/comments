import React from 'react';
import { Tooltip } from '@mui/material';
import { IconButtonProps } from './icon-button.types';
import { StyledIconButton } from './icon-button.styles';

export type { IconButtonProps };

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  onClick,
  ...props
}) => {
  const button = (
    <StyledIconButton onClick={onClick} size="small" {...props}>
      {icon}
    </StyledIconButton>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};
