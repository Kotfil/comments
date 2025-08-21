# 🔍 Elasticsearch Guide

## 📋 Обзор

Elasticsearch интегрирован в систему комментариев для обеспечения быстрого полнотекстового поиска, автодополнения и аналитики.

## 🚀 Запуск

### 1. Через Docker Compose
```bash
cd server
docker-compose up -d elasticsearch kibana
```

### 2. Проверка статуса
```bash
# Elasticsearch
curl http://localhost:9200/_cluster/health

# Kibana
http://localhost:5601
```

## 🔧 Конфигурация

### Переменные окружения
```env
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

### Настройки индекса
- **Название**: `comments`
- **Анализатор**: `standard` с русскими стоп-словами
- **Типы полей**: text, keyword, date, integer

## 📊 Структура индекса

### Маппинг полей
```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "author": { 
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "content": { 
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "homepage": { 
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "timestamp": { "type": "date" },
      "level": { "type": "integer" },
      "parent_id": { "type": "keyword" },
      "created_at": { "type": "date" },
      "updated_at": { "type": "date" }
    }
  }
}
```

## 🔍 Поисковые запросы

### 1. Полнотекстовый поиск
```graphql
query {
  searchComments(query: "информативно", filters: { level: 0 }) {
    id
    author
    content
    score
    highlight {
      content
      author
    }
  }
}
```

### 2. Поиск по автору
```graphql
query {
  searchByAuthor(author: "John Doe") {
    id
    author
    content
    timestamp
  }
}
```

### 3. Поиск по содержимому
```graphql
query {
  searchByContent(content: "отличный пост") {
    id
    author
    content
    score
  }
}
```

### 4. Поиск по HomePage
```graphql
query {
  searchByHomepage(homepage: "johndoe") {
    id
    author
    content
    homepage
  }
}
```

### 5. Автодополнение
```graphql
query {
  getSuggestions(query: "jo") {
    # Возвращает массив строк для автодополнения
  }
}
```

## 🎯 Особенности поиска

### Приоритеты полей
- **content**: вес 3 (высокий приоритет)
- **author**: вес 2 (средний приоритет)
- **homepage**: вес 1 (низкий приоритет)

### Нечеткий поиск
- Автоматическое исправление опечаток
- Поиск по синонимам
- Учет морфологии русского языка

### Фильтрация
- По уровню вложенности (`level`)
- По автору (`author`)
- По HomePage (`homepage`)

## 📈 Мониторинг

### Kibana Dashboard
- **URL**: http://localhost:5601
- **Индекс**: `comments`
- **Визуализации**: поисковые запросы, популярные авторы, активность

### Elasticsearch API
```bash
# Статистика индекса
curl http://localhost:9200/comments/_stats

# Количество документов
curl http://localhost:9200/comments/_count

# Анализ запроса
curl -X POST "localhost:9200/comments/_analyze" \
  -H 'Content-Type: application/json' \
  -d '{
    "analyzer": "standard",
    "text": "Отличный комментарий!"
  }'
```

## 🔄 Синхронизация данных

### Автоматическая индексация
- При создании комментария
- При обновлении комментария
- При удалении комментария

### Bulk операции
```typescript
// Массовая индексация существующих комментариев
await elasticsearchService.bulkIndex(comments);
```

## 🚨 Обработка ошибок

### Fallback стратегия
- При недоступности Elasticsearch
- Поиск через PostgreSQL
- Логирование ошибок

### Мониторинг
- Проверка подключения
- Статус индекса
- Производительность запросов

## 📚 Полезные команды

### Управление индексом
```bash
# Создание индекса
curl -X PUT "localhost:9200/comments"

# Удаление индекса
curl -X DELETE "localhost:9200/comments"

# Пересоздание индекса
curl -X POST "localhost:9200/comments/_refresh"
```

### Поисковые запросы
```bash
# Простой поиск
curl -X GET "localhost:9200/comments/_search?q=content:информативно"

# Сложный поиск
curl -X POST "localhost:9200/comments/_search" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": {
      "multi_match": {
        "query": "информативно",
        "fields": ["content^3", "author^2"]
      }
    }
  }'
```

## 🎯 Лучшие практики

### 1. Индексация
- Используйте bulk операции для массовых данных
- Настройте правильные маппинги
- Регулярно обновляйте индексы

### 2. Поиск
- Используйте фильтры для улучшения производительности
- Применяйте агрегации для аналитики
- Настройте релевантность результатов

### 3. Мониторинг
- Отслеживайте производительность запросов
- Мониторьте размер индекса
- Проверяйте состояние кластера

## 🔗 Полезные ссылки

- [Elasticsearch Documentation](https://www.elastic.co/guide/index.html)
- [NestJS Elasticsearch](https://docs.nestjs.com/techniques/elasticsearch)
- [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
