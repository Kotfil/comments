# 🚀 Быстрый запуск Comments Server

## 1. Запуск PostgreSQL
```bash
# Через PowerShell
.\start-db.ps1

# Или вручную
docker-compose up -d postgres
```

## 2. Проверка базы данных
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)
- **База**: comments_db

## 3. Запуск сервера
```bash
# Режим разработки
pnpm start:dev

# Или продакшн
pnpm build
pnpm start:prod
```

## 4. Проверка работы
- **Сервер**: http://localhost:4000
- **GraphQL**: http://localhost:4000/graphql
- **API**: http://localhost:4000/api

## 5. Тестовые данные
База автоматически заполняется тестовыми комментариями при первом запуске.

## 🛑 Остановка
```bash
# Остановить сервер: Ctrl+C
# Остановить базу: docker-compose down
```

## 📝 Пример GraphQL запроса
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
