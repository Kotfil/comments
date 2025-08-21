import React from 'react';
import { Box, Paper } from '@mui/material';
import { Comment } from '@/data/mock-comments';
import { UserInfo } from '@/components/molecules/user-info';
import { ActionButtons } from '@/components/molecules/action-buttons';
import { CommentContent } from '@/components/molecules/comment-content';
import { HTMLRenderer } from '@/components/molecules/html-renderer';

export interface CommentCardProps {
  comment: Comment;
  level?: number;
  onReply?: (comment: Comment) => void;
  onAction?: (action: string, comment: Comment) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
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
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        ml: level * 4,
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <UserInfo
          author={comment.author}
          timestamp={comment.timestamp}
          avatar={comment.avatar}
        />
        
        <ActionButtons
          likes={comment.likes}
          dislikes={comment.dislikes}
          onAction={handleAction}
        />
      </Box>
      
      <CommentContent
        content={comment.content}
        onReply={handleReply}
      />
      
      {/* Рекурсивно рендерим ответы */}
      {comment.replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              level={level + 1}
              onReply={onReply}
              onAction={onAction}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};
