import React from 'react';
import { Box, Typography } from '@mui/material';
import { Avatar } from '@/components/atoms/avatar';
import { IconButton } from '@/components/atoms/icon-button';
import { CommentHeaderProps } from './comment-header.types';

export const CommentHeader: React.FC<CommentHeaderProps> = ({
  author,
  timestamp,
  avatar,
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
        <Typography variant="caption" color="secondary">
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
          icon="🔄"
          tooltip="Поделиться"
          onClick={() => handleAction('share')}
        />
      </Box>
    </Box>
  );
};
