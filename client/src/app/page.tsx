'use client';

import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { CommentsTable } from '@/components/CommentsTable';
import { AddCommentModal } from '@/components/AddCommentModal';
import { HierarchicalComments } from '@/components/HierarchicalComments';
import { getMainComments } from '@/data/mock-comments';
import { PageContainer, PageTitle, PageDescription, AddButtonContainer } from './page.styles';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainComments = getMainComments();

  const handleAddComment = (commentData: any) => {
    // Здесь будет логика добавления комментария
    console.log('Новый комментарий:', commentData);
    // В реальном приложении здесь будет API вызов
  };

  return (
    <PageContainer>
      <PageTitle>💬 Система комментариев</PageTitle>
      <PageDescription>
        Добро пожаловать в приложение для управления комментариями. 
        Здесь вы можете просматривать иерархические комментарии с вложенностью.
      </PageDescription>
      
      <AddButtonContainer>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          size="large"
        >
          Добавить комментарий
        </Button>
      </AddButtonContainer>

      <CommentsTable comments={mainComments} />
      
      <HierarchicalComments />
      
      <AddCommentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddComment}
      />
    </PageContainer>
  );
}
