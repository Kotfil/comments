import { IconButtonProps as MuiIconButtonProps } from '@mui/material';

export interface IconButtonProps extends Omit<MuiIconButtonProps, 'children'> {
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
}
