# 💬 Comments System

Полноценная система комментариев с клиентом на Next.js и сервером на NestJS.

## 🏗️ Архитектура

### Frontend (Client)
- **Next.js 14** с TypeScript
- **Material-UI** для компонентов
- **Styled Components** для стилизации
- **Apollo Client** для GraphQL
- **Atomic Design** архитектура

### Backend (Server)
- **NestJS** с TypeScript
- **TypeORM** для работы с базой данных
- **PostgreSQL** как основная БД
- **GraphQL** API с Apollo Server
- **Docker** для развертывания

## 🚀 Быстрый старт

### 1. Клонирование и установка
```bash
git clone <repository-url>
cd comments

# Установка зависимостей клиента
cd client
pnpm install

# Установка зависимостей сервера
cd ../server
pnpm install
```

### 2. Запуск базы данных
```bash
cd server
# Убедитесь, что Docker запущен
docker-compose up -d postgres
```

### 3. Запуск сервера
```bash
cd server
pnpm start:dev
```

### 4. Запуск клиента
```bash
cd client
pnpm dev
```

## 🌐 Доступные сервисы

- **Клиент**: http://localhost:3000
- **Сервер**: http://localhost:4000
- **GraphQL**: http://localhost:4000/graphql
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)

## 📁 Структура проекта

```
comments/
├── client/                 # Next.js клиент
│   ├── src/
│   │   ├── components/    # Atomic Design компоненты
│   │   ├── graphql/       # GraphQL схемы и типы
│   │   ├── hooks/         # React хуки
│   │   └── app/           # Next.js страницы
│   └── package.json
├── server/                 # NestJS сервер
│   ├── src/
│   │   ├── entities/      # TypeORM сущности
│   │   ├── services/      # Бизнес-логика
│   │   ├── resolvers/     # GraphQL резолверы
│   │   └── modules/       # NestJS модули
│   ├── docker-compose.yml # PostgreSQL
│   └── package.json
└── README.md
```

## 🔧 Основные функции

### Клиент
- ✅ Создание комментариев и ответов
- ✅ Иерархическое отображение
- ✅ Пагинация (25 комментариев на страницу)
- ✅ Polling для real-time обновлений
- ✅ Валидация форм
- ✅ Responsive дизайн

### Сервер
- ✅ GraphQL API
- ✅ PostgreSQL с TypeORM
- ✅ Валидация данных
- ✅ Иерархические комментарии
- ✅ Автоматические миграции

## 🎨 Atomic Design

### Atoms
- Button, Input, Typography, Avatar, IconButton

### Molecules
- FormField, HTMLToolbar, CommentHeader, Pagination

### Organisms
- CommentItem, CommentForm, CommentCard

### Templates
- CommentModal, CommentsLayout

### Pages
- CommentsPage, HierarchicalCommentsPage

## 📊 GraphQL Schema

### Queries
```graphql
query {
  comments {
    id
    author
    content
    replies {
      id
      author
      content
    }
  }
}
```

### Mutations
```graphql
mutation {
  createComment(input: {
    author: "John Doe"
    email: "john@example.com"
    content: "Отличный пост!"
  }) {
    id
    author
    content
  }
}
```

## 🗄️ База данных

### Таблица `comments`
- UUID первичный ключ
- Иерархическая структура (parent_id)
- Автоматические timestamps
- Валидация на уровне БД

### Индексы
- parent_id для быстрого поиска ответов
- homepage для поиска по URL
- created_at для сортировки

## 🚀 Развертывание

### Разработка
```bash
# Клиент
cd client && pnpm dev

# Сервер
cd server && pnpm start:dev

# База данных
cd server && docker-compose up -d
```

### Продакшн
```bash
# Клиент
cd client && pnpm build && pnpm start

# Сервер
cd server && pnpm build && pnpm start:prod
```

## 🧪 Тестирование

### Клиент
```bash
cd client
pnpm test
```

### Сервер
```bash
cd server
pnpm test
```

## 📚 Документация

- [Клиент](./client/README.md) - Детали Next.js приложения
- [Сервер](./server/README.md) - Детали NestJS API
- [Интеграция](./server/CLIENT_INTEGRATION.md) - Как подключить клиент к серверу
- [Быстрый старт](./server/QUICK_START.md) - Быстрый запуск сервера

## 🔒 Безопасность

- Валидация входных данных
- CORS настройки
- Подготовленные SQL запросы
- Ограничения на уровне БД

## 📈 Производительность

- React.memo и useCallback для оптимизации
- Apollo Client кэширование
- TypeORM lazy loading
- Индексы БД для быстрых запросов

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Создайте Pull Request

## 📄 Лицензия

MIT License

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи сервера и клиента
2. Убедитесь в доступности PostgreSQL
3. Проверьте переменные окружения
4. Создайте Issue с описанием проблемы

---

**Создано с ❤️ используя современные технологии разработки**

