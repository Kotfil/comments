'use client';

import React from 'react';
import { HierarchicalComments } from '@/components/HierarchicalComments';
import { PageContainer, PageTitle, PageDescription } from './page.styles';

export default function HomePage() {
  return (
    <PageContainer>
      <PageTitle>💬 Система комментариев</PageTitle>
      <PageDescription>
        Добро пожаловать в приложение для управления комментариями. 
        Здесь вы можете просматривать иерархические комментарии с вложенностью.
      </PageDescription>
      
      <HierarchicalComments />
    </PageContainer>
  );
}
