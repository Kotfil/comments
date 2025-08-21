# GraphQL Setup для Comments App

## Установленные зависимости

```bash
pnpm add @apollo/client graphql
```

## Структура GraphQL

### 1. Схема (`src/graphql/schema.ts`)
- **COMMENT_FRAGMENT** - фрагмент для комментариев
- **GET_COMMENTS** - запрос всех комментариев
- **GET_COMMENT_BY_HOMEPAGE** - запрос комментария по HomePage
- **CREATE_COMMENT** - создание комментария
- **CREATE_REPLY** - создание ответа

### 2. Типы (`src/graphql/types.ts`)
- TypeScript интерфейсы для всех GraphQL типов
- Типы для входных данных и ответов

### 3. Apollo Client (`src/lib/apollo-client.ts`)
- Конфигурация Apollo Client
- Обработка ошибок
- Аутентификация через заголовки
- Политики кэширования
- DevTools для разработки

### 4. Provider (`src/providers/apollo-provider.tsx`)
- Apollo Provider для оборачивания приложения
- Подключение к layout.tsx

### 5. Хуки (`src/hooks/use-comments.ts`)
- **useComments()** - получение всех комментариев
- **useCommentByHomepage(homepage)** - получение по HomePage
- **useCreateComment()** - создание комментария
- **useCreateReply()** - создание ответа

## Настройка переменных окружения

Создайте файл `.env.local` в корне client:

```env
# GraphQL API URL
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# Для продакшена
# NEXT_PUBLIC_GRAPHQL_URL=https://api.example.com/graphql
```

## Использование в компонентах

### Основная страница комментариев
```tsx
import { useComments, useCreateComment, useCreateReply } from '@/hooks/use-comments';

export const HierarchicalCommentsPage = () => {
  const { comments, loading, error, refetch } = useComments();
  const { createComment, loading: createLoading } = useCreateComment();
  const { createReply, loading: replyLoading } = useCreateReply();
  
  // ... логика компонента
};
```

### Динамическая страница комментария
```tsx
import { useCommentByHomepage } from '@/hooks/use-comments';

export default function HomePageComment() {
  const { comment, loading, error, refetch } = useCommentByHomepage(homepage);
  
  // ... логика компонента
}
```

## Особенности реализации

### 1. Кэширование
- Автоматическое обновление кэша при мутациях
- Политики слияния для комментариев и ответов
- Оптимистичные обновления UI

### 2. Обработка ошибок
- Централизованная обработка GraphQL ошибок
- Сетевые ошибки и ошибки валидации
- Retry механизм для операций

### 3. Типизация
- Полная TypeScript поддержка
- Автодополнение в IDE
- Проверка типов на этапе компиляции

## Следующие шаги

1. **Создать GraphQL сервер** на порту 4000
2. **Реализовать резолверы** для всех запросов
3. **Настроить базу данных** (PostgreSQL, MongoDB)
4. **Добавить аутентификацию** через JWT

## Пример GraphQL сервера

```typescript
// server/schema.ts
const typeDefs = `
  type Comment {
    id: ID!
    author: String!
    email: String!
    homepage: String
    avatar: String!
    content: String!
    timestamp: String!
    likes: Int!
    dislikes: Int!
    level: Int!
    replies: [Comment!]!
  }
  
  input CreateCommentInput {
    author: String!
    email: String!
    homepage: String
    content: String!
  }
  
  input CreateReplyInput {
    parentId: ID!
    author: String!
    email: String!
    homepage: String
    content: String!
  }
  
  type Query {
    comments: [Comment!]!
    commentByHomepage(homepage: String!): Comment
  }
  
  type Mutation {
    createComment(input: CreateCommentInput!): Comment!
    createReply(input: CreateReplyInput!): Comment!
  }
`;
```
