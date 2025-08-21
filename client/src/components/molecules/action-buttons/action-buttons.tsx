import React from 'react';
import { IconButton } from '@/components/atoms/icon-button';
import { Typography } from '@/components/atoms/typography';
import { ActionButtonsProps } from './action-buttons.types';
import { ActionButtonsContainer } from './action-buttons.styles';

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
    <ActionButtonsContainer>
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
    </ActionButtonsContainer>
  );
};

export type { ActionButtonsProps };
