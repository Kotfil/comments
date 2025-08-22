import { IconButton as MuiIconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledIconButton = styled(MuiIconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  fontSize: '14px',
  color: theme.palette.text.secondary,
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));
