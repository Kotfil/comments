# 🔗 Интеграция клиента с сервером

## 📋 Обзор

После запуска сервера, клиент может подключиться к GraphQL API для получения и отправки комментариев.

## 🌐 Endpoints

- **GraphQL**: `http://localhost:4000/graphql`
- **API**: `http://localhost:4000/api/*`

## 🔧 Обновление клиента

### 1. Обновить Apollo Client конфигурацию

В `client/src/lib/apollo-client.ts`:
```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Обновить URL
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### 2. Обновить хуки

В `client/src/hooks/use-comments.ts` заменить mock данные на реальные GraphQL запросы:

```typescript
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_COMMENTS, 
  CREATE_COMMENT, 
  CREATE_REPLY 
} from '@/graphql/schema';

export const useComments = (pollInterval: number = 30000) => {
  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery(
    GET_COMMENTS,
    { pollInterval }
  );

  return {
    comments: data?.comments || [],
    loading,
    error,
    refetch,
    startPolling,
    stopPolling,
  };
};
```

### 3. Обновить GraphQL схему

В `client/src/graphql/schema.ts`:
```typescript
import { gql } from '@apollo/client';

export const GET_COMMENTS = gql`
  query GetComments {
    comments {
      id
      author
      email
      homepage
      avatar
      content
      timestamp
      likes
      dislikes
      level
      replies {
        id
        author
        content
        timestamp
        level
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      author
      content
      timestamp
    }
  }
`;
```

## 🚀 Тестирование интеграции

### 1. Запустить сервер
```bash
cd server
pnpm start:dev
```

### 2. Запустить клиент
```bash
cd client
pnpm dev
```

### 3. Проверить GraphQL Playground
Открыть: http://localhost:4000/graphql

### 4. Тестовый запрос
```graphql
query {
  comments {
    id
    author
    content
    timestamp
  }
}
```

## 🔒 CORS настройки

Сервер настроен для работы с клиентом на `http://localhost:3000`.

Если нужно изменить, обновить в `server/src/main.ts`:
```typescript
app.enableCors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
});
```

## 📊 Мониторинг

### Логи сервера
```bash
# В режиме разработки
pnpm start:dev

# В продакшне
pnpm start:prod
```

### GraphQL Playground
- URL: http://localhost:4000/graphql
- Включен в режиме разработки
- Отключен в продакшне

## 🐛 Отладка

### Проблемы подключения
1. Проверить, что сервер запущен на порту 4000
2. Проверить CORS настройки
3. Проверить GraphQL схему

### Проблемы с базой данных
1. Проверить подключение к PostgreSQL
2. Проверить переменные окружения
3. Проверить логи TypeORM

## 📈 Производительность

### Polling
- По умолчанию: 30 секунд
- Настраивается через `pollInterval` в `useComments`

### Кэширование
- Apollo Client InMemoryCache
- Автоматическое обновление кэша при мутациях

## 🚀 Продакшн

### Переменные окружения
```env
NODE_ENV=production
GRAPHQL_PLAYGROUND=false
GRAPHQL_DEBUG=false
```

### Сборка
```bash
pnpm build
pnpm start:prod
```

### Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```
