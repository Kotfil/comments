'use client';

import { ReactNode } from 'react';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export const ApolloProviderWrapper: React.FC<ApolloProviderWrapperProps> = ({ children }) => {
  // Временно отключаем Apollo Provider для отладки
  return <>{children}</>;
};
