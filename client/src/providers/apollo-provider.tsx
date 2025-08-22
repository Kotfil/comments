'use client';

import React, { ReactNode } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from '@apollo/client';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export const ApolloProviderWrapper: React.FC<ApolloProviderWrapperProps> = ({
  children,
}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
