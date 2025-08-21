import React from 'react';
import { Box } from '@mui/material';
import { IconButton } from '@/components/atoms/icon-button';
import { Typography } from '@/components/atoms/typography';

export interface ActionButtonsProps {
  likes: number;
  dislikes: number;
  onAction?: (action: string) => void;
  showVoteCounter?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  likes,
  dislikes,
  onAction,
  showVoteCounter = true,
}) => {
  const handleAction = (action: string) => {
    onAction?.(action);
  };

  return (
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
      
      {showVoteCounter && (
        <Typography variant="caption" color="secondary">
          ↑{likes} ↓{dislikes}
        </Typography>
      )}
    </Box>
  );
};
