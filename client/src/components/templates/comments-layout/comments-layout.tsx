import React from 'react';
import { Box, Container } from '@mui/material';
import { Typography } from '@/components/atoms/typography';
import { Button } from '@/components/atoms/button';

export interface CommentsLayoutProps {
  title: string;
  children: React.ReactNode;
  onAddComment?: () => void;
  addButtonText?: string;
  showAddButton?: boolean;
}

export const CommentsLayout: React.FC<CommentsLayoutProps> = ({
  title,
  children,
  onAddComment,
  addButtonText = 'Добавить комментарий',
  showAddButton = true,
}) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        
        {showAddButton && onAddComment && (
          <Button
            variant="primary"
            onClick={onAddComment}
          >
            {addButtonText}
          </Button>
        )}
      </Box>
      
      {children}
    </Container>
  );
};
