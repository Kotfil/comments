import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledAvatar = styled(Box)<BoxProps>(({ theme }) => ({
  borderRadius: '50%',
  backgroundColor: '#f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));
