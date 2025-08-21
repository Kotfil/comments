import React from 'react';
import { Box } from '@mui/material';
import { CommentHeader } from '@/components/molecules/comment-header';
import { CommentContent } from '@/components/molecules/comment-content';
import { CommentItemProps } from './comment-item.types';

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  level = 0,
  onReply,
  onAction,
}) => {
  const handleReply = () => {
    onReply?.(comment);
  };

  const handleAction = (action: string) => {
    onAction?.(action, comment);
  };

  return (
    <Box
      sx={{
        ml: level * 3,
        mb: 2,
        position: 'relative',
        '&::before': level > 0 ? {
          content: '""',
          position: 'absolute',
          left: -16,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: '#e0e0e0',
        } : {},
      }}
    >
      <CommentHeader
        author={comment.author}
        timestamp={comment.timestamp}
        avatar={comment.avatar}
        likes={comment.likes}
        dislikes={comment.dislikes}
        onAction={handleAction}
      />
      
      <CommentContent
        content={comment.content}
        onReply={handleReply}
      />
      
      {/* Рекурсивно рендерим ответы */}
      {comment.replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              level={level + 1}
              onReply={onReply}
              onAction={onAction}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export type { CommentItemProps };
