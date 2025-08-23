import React from 'react';
import { Typography } from '@/components/atomic/typography';
import { Button } from '@/components/atomic/button';
import { CommentsLayoutProps } from './comments-layout.types';
import { StyledContainer, LayoutHeader } from './comments-layout.styles';

export const CommentsLayout: React.FC<CommentsLayoutProps> = ({
  title,
  children,
  onAddComment,
  addButtonText = 'Добавить комментарий',
  showAddButton = true,
}) => {
  return (
    <StyledContainer maxWidth="lg">
      <LayoutHeader>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>

        {showAddButton && onAddComment && (
          <Button variant="primary" onClick={onAddComment}>
            {addButtonText}
          </Button>
        )}
      </LayoutHeader>

      {children}
    </StyledContainer>
  );
};

export type { CommentsLayoutProps };
