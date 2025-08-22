import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CommentContentProps } from './comment-content.types';

export const CommentContent: React.FC<CommentContentProps> = ({
  content,
  onReply,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {content}
      </Typography>

      {onReply && (
        <Button
          variant="text"
          size="small"
          onClick={onReply}
          sx={{ textTransform: 'none' }}
        >
          Ответить
        </Button>
      )}
    </Box>
  );
};

export type { CommentContentProps };
