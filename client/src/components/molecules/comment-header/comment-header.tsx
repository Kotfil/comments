import React from 'react';
import { Box, Typography } from '@mui/material';
import { Avatar } from '@/components/atoms/avatar';
import { IconButton } from '@/components/atoms/icon-button';

export interface CommentHeaderProps {
  author: string;
  timestamp: string;
  avatar: string;
  likes: number;
  dislikes: number;
  onAction?: (action: string) => void;
}

export const CommentHeader: React.FC<CommentHeaderProps> = ({
  author,
  timestamp,
  avatar,
  likes,
  dislikes,
  onAction,
}) => {
  const handleAction = (action: string) => {
    onAction?.(action);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 1,
      }}
    >
      <Avatar>{avatar}</Avatar>
      
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {author}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {timestamp}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          icon="#"
          tooltip="Ссылка"
          onClick={() => handleAction('link')}
        />
        <IconButton
          icon="🔖"
          tooltip="Закладка"
          onClick={() => handleAction('bookmark')}
        />
        <IconButton
          icon="⬆️"
          tooltip="Лайк"
          onClick={() => handleAction('like')}
        />
        <IconButton
          icon="⬇️"
          tooltip="Дизлайк"
          onClick={() => handleAction('dislike')}
        />
        <IconButton
          icon="🔄"
          tooltip="Поделиться"
          onClick={() => handleAction('share')}
        />
        
        <Typography variant="caption" color="text.secondary">
          ↑{likes} ↓{dislikes}
        </Typography>
      </Box>
    </Box>
  );
};
