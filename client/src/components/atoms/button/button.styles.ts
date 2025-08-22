import { styled } from '@mui/material/styles';
import { Button as MuiButton } from '@mui/material';

export const StyledButton = styled(MuiButton)(({ theme }) => ({
  // Базовые стили для всех вариантов
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 500,

  // Специфичные стили для primary
  '&.MuiButton-contained': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },

  // Специфичные стили для outline
  '&.MuiButton-outlined': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
  },
}));
