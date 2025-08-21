# Comments Server

GraphQL сервер для комментариев на NestJS с TypeORM и PostgreSQL.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
pnpm install
```

### 2. Настройка базы данных
Создайте файл `.env` на основе `env.example`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=comments_db
```

### 3. Создание базы данных
```sql
CREATE DATABASE comments_db;
```

### 4. Запуск сервера
```bash
# Режим разработки
pnpm start:dev

# Продакшн
pnpm build
pnpm start:prod
```

## 📊 GraphQL Playground

После запуска откройте: http://localhost:4000/graphql

## 🗄️ Структура базы данных

### Таблица `comments`
- `id` - UUID (Primary Key)
- `author` - VARCHAR(100) - Имя автора
- `email` - VARCHAR(255) - Email автора
- `homepage` - VARCHAR(255) - URL домашней страницы (опционально)
- `avatar` - VARCHAR(10) - Эмодзи аватар
- `content` - TEXT - Содержимое комментария
- `timestamp` - TIMESTAMP - Время создания
- `likes` - INTEGER - Количество лайков
- `dislikes` - INTEGER - Количество дизлайков
- `level` - INTEGER - Уровень вложенности
- `parent_id` - UUID - ID родительского комментария (для ответов)
- `created_at` - TIMESTAMP - Время создания записи
- `updated_at` - TIMESTAMP - Время обновления записи

## 🔧 Доступные операции

### Queries
- `comments` - Получить все комментарии
- `comment(id: ID!)` - Получить комментарий по ID
- `commentByHomepage(homepage: String!)` - Получить комментарий по HomePage

### Mutations
- `createComment(input: CreateCommentInput!)` - Создать комментарий
- `createReply(input: CreateReplyInput!)` - Создать ответ
- `updateCommentReactions(id: ID!, likes: Int!, dislikes: Int!)` - Обновить реакции
- `deleteComment(id: ID!)` - Удалить комментарий

## 📁 Структура проекта

```
src/
├── config/          # Конфигурация TypeORM
├── dto/            # Data Transfer Objects
├── entities/       # TypeORM сущности
├── modules/        # NestJS модули
├── resolvers/      # GraphQL резолверы
├── services/       # Бизнес-логика
├── app.module.ts   # Главный модуль
└── main.ts         # Точка входа
```

## 🛠️ Команды разработки

```bash
# Сборка
pnpm build

# Линтинг
pnpm lint

# Тесты
pnpm test

# TypeORM команды
pnpm migration:generate    # Генерация миграции
pnpm migration:run         # Запуск миграций
pnpm migration:revert      # Откат миграции
pnpm schema:sync          # Синхронизация схемы
```

## 🌐 API Endpoints

- **GraphQL**: `/graphql`
- **API**: `/api/*`
- **Health Check**: `/api/health`

## 🔒 Безопасность

- Валидация входных данных через class-validator
- CORS настройки для клиента
- Подготовленные SQL запросы через TypeORM

## 📝 Примеры запросов

### Получить все комментарии
```graphql
query {
  comments {
    id
    author
    content
    timestamp
    replies {
      id
      author
      content
    }
  }
}
```

### Создать комментарий
```graphql
mutation {
  createComment(input: {
    author: "John Doe"
    email: "john@example.com"
    content: "Отличный пост!"
    homepage: "johndoe"
  }) {
    id
    author
    content
    timestamp
  }
}
```

## 🚀 Развертывание

### Docker (в разработке)
```bash
docker-compose up -d
```

### Продакшн
```bash
# Установка зависимостей
pnpm install --production

# Сборка
pnpm build

# Запуск
pnpm start:prod
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи сервера
2. Убедитесь в доступности PostgreSQL
3. Проверьте переменные окружения
4. Убедитесь в корректности GraphQL схемы
