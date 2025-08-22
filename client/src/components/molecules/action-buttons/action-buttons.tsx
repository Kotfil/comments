import React from 'react';
import { IconButton } from '@/components/atoms/icon-button';
import { ActionButtonsProps } from './action-buttons.types';
import { ActionButtonsContainer } from './action-buttons.styles';

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onAction }) => {
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
        icon="🔄"
        tooltip="Поделиться"
        onClick={() => handleAction('share')}
      />
    </ActionButtonsContainer>
  );
};

export type { ActionButtonsProps };
