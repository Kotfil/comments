import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Проверяем, что мы на клиенте
const isClient = typeof window !== 'undefined';

// Создаем HTTP линк для GraphQL API
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

// Линк для обработки ошибок
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }

    // Возвращаем операцию для повторной попытки
    return forward(operation);
  }
);

// Линк для добавления заголовков (например, для аутентификации)
const authLink = setContext((_, { headers }) => {
  // Получаем токен из localStorage (если есть)
  const token = isClient ? localStorage.getItem('authToken') : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
});

// Создаем Apollo Client только на клиенте
let client: ApolloClient<any> | null = null;

if (isClient) {
  client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            comments: {
              // Политика слияния для комментариев
              merge(existing = [], incoming) {
                return incoming;
              },
            },
          },
        },
        Comment: {
          fields: {
            replies: {
              // Политика слияния для ответов
              merge(existing = [], incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    // Настройки для разработки
    connectToDevTools: process.env.NODE_ENV === 'development',
    // Настройки для кэширования
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network',
      },
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}

// Экспортируем клиент
export { client };
export default client;
