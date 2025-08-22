import React from 'react';
import { AvatarProps } from './avatar.types';
import { StyledAvatar } from './avatar.styles';

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
    <StyledAvatar
      sx={{
        width: getSize(),
        height: getSize(),
        fontSize: `${getSize() * 0.5}px`,
      }}
      {...props}
    >
      {children}
    </StyledAvatar>
  );
};
