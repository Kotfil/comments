import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Проверяем, что мы на клиенте
const isClient = typeof window !== 'undefined';

// Создаем HTTP линк для GraphQL API
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

// Линк для защиты от XSS и валидации данных
const securityLink = new ApolloLink((operation, forward) => {
  // Защита от XSS - проверяем и очищаем входные данные
  const sanitizeInput = (obj: any): any => {
    if (typeof obj === 'string') {
      // Убираем потенциально опасные HTML теги
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeInput(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  // Очищаем переменные операции
  if (operation.variables) {
    operation.variables = sanitizeInput(operation.variables);
  }

  return forward(operation);
});

// Линк для тротлинга запросов (защита от DDoS)
const throttleLink = new ApolloLink((operation, forward) => {
  // Простой тротлинг - максимум 10 запросов в секунду
  const now = Date.now();
  const key = operation.operationName || 'default';
  
  if (!throttleLink['requestCounts']) {
    throttleLink['requestCounts'] = {};
  }
  
  if (!throttleLink['lastReset']) {
    throttleLink['lastReset'] = now;
  }
  
  // Сбрасываем счетчик каждую секунду
  if (now - throttleLink['lastReset'] > 1000) {
    throttleLink['requestCounts'] = {};
    throttleLink['lastReset'] = now;
  }
  
  // Проверяем лимит
  if (!throttleLink['requestCounts'][key]) {
    throttleLink['requestCounts'][key] = 0;
  }
  
  if (throttleLink['requestCounts'][key] >= 10) {
    throw new Error('Rate limit exceeded. Too many requests.');
  }
  
  throttleLink['requestCounts'][key]++;
  
  return forward(operation);
});

// Линк для тайминга запросов
const timingLink = new ApolloLink((operation, forward) => {
  const startTime = Date.now();
  
  return forward(operation).map((result) => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Логируем медленные запросы (>1 секунды)
    if (duration > 1000) {
      console.warn(`Slow query: ${operation.operationName} took ${duration}ms`);
    }
    
    return result;
  });
});

// Линк для обработки ошибок с защитой
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: ${message}`,
        `Location: ${locations}`,
        `Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`Network error: ${networkError.message}`);
  }
});

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
let client: ApolloClient | null = null;

if (isClient) {
  client = new ApolloClient({
    link: from([securityLink, throttleLink, timingLink, errorLink, authLink, httpLink]),
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
    // Настройки для разработки (отключено для совместимости)
    // connectToDevTools: process.env.NODE_ENV === 'development',
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
