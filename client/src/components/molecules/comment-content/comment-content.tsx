import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { HTMLRenderer } from '@/components/molecules/html-renderer';

export interface CommentContentProps {
  content: string;
  onReply?: () => void;
}

export const CommentContent: React.FC<CommentContentProps> = ({
  content,
  onReply,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <HTMLRenderer content={content} />
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
