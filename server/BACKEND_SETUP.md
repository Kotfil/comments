# 🚀 Настройка бэкенда для комментариев

## 📋 Требования

- Node.js 18+
- Docker Desktop
- PostgreSQL 15+

## 🗄️ Настройка базы данных

### 1. Запуск PostgreSQL в Docker

```powershell
# Запустите скрипт для автоматической настройки
.\start-postgres.ps1
```

Или вручную:

```bash
# Остановить существующий контейнер
docker stop postgres-comments
docker rm postgres-comments

# Запустить новый контейнер
docker run -d \
  --name postgres-comments \
  -e POSTGRES_DB=comments_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15
```

### 2. Создание базы данных

```bash
# Создать базу и таблицы
docker exec -i postgres-comments psql -U postgres < setup-database.sql
```

## ⚙️ Конфигурация

### Переменные окружения (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=comments_db

# Server Configuration
PORT=3001
NODE_ENV=development

# GraphQL Configuration
GRAPHQL_PLAYGROUND=true
GRAPHQL_DEBUG=true
```

### Структура базы данных

- **База данных**: `comments_db`
- **Таблица**: `comments`
- **Порты**: 5432 (PostgreSQL), 3001 (API)

## 🚀 Запуск сервера

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run start:dev

# Или сборка и запуск
npm run build
npm run start
```

## 🔗 Подключение клиента

Клиент настроен на подключение к `http://localhost:3001/graphql`

## 📊 GraphQL Playground

После запуска сервера откройте: `http://localhost:3001/graphql`

## 🧪 Тестирование

### Создание комментария

```graphql
mutation CreateComment {
  createComment(input: {
    author: "Test User"
    email: "test@example.com"
    content: "Тестовый комментарий"
  }) {
    id
    author
    content
    timestamp
  }
}
```

### Получение комментариев

```graphql
query GetComments {
  comments {
    id
    author
    content
    timestamp
    level
    replies {
      id
      author
      content
    }
  }
}
```

## 🐛 Устранение проблем

### Ошибка подключения к БД
- Проверьте, что PostgreSQL запущен: `docker ps`
- Проверьте порт 5432: `netstat -an | findstr 5432`

### Ошибка GraphQL
- Проверьте, что сервер запущен на порту 3001
- Проверьте консоль сервера на ошибки

## 📁 Структура проекта

```
server/
├── src/
│   ├── entities/          # Модели данных
│   ├── resolvers/         # GraphQL резолверы
│   ├── services/          # Бизнес-логика
│   ├── dto/              # Data Transfer Objects
│   └── config/            # Конфигурация
├── .env                   # Переменные окружения
├── setup-database.sql     # SQL для создания БД
└── start-postgres.ps1     # Скрипт запуска PostgreSQL
```
