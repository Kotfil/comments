import { Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledCommentCard = styled(Paper)<{ level: number }>(
  ({ theme, level }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: level * theme.spacing(4),
    position: 'relative',

    '&::before':
      level > 0
        ? {
            content: '""',
            position: 'absolute',
            left: -theme.spacing(2),
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: theme.palette.divider,
          }
        : {},
  })
);

export const CommentCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));

export const CommentCardReplies = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));
