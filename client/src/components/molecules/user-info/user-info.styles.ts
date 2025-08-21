import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const UserInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const UserInfoContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));
