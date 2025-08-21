'use client';

import { ReactNode } from 'react';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

// Fallback версия без Apollo Client для отладки
export const ApolloProviderWrapper: React.FC<ApolloProviderWrapperProps> = ({ children }) => {
  return <>{children}</>;
};
