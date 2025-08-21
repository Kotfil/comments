import { BoxProps } from '@mui/material';

export interface AvatarProps extends Omit<BoxProps, 'component'> {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}
