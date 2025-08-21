'use client';

import React from 'react';
import { CommentsList } from '@/components/CommentsList';
import { mockComments } from '@/data/mock-comments';
import { PageContainer, PageTitle, PageDescription } from './page.styles';

export default function HomePage() {
  return (
    <PageContainer>
      <PageTitle>💬 Система комментариев</PageTitle>
      <PageDescription>
        Добро пожаловать в приложение для управления комментариями. 
        Здесь вы можете просматривать иерархические комментарии с вложенностью.
      </PageDescription>
      
      <CommentsList comments={mockComments} />
    </PageContainer>
  );
}
