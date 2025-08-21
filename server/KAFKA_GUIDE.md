# 🚀 Kafka Guide

## 📋 Обзор

Apache Kafka интегрирован в систему комментариев для обеспечения асинхронной обработки событий, масштабируемости и отказоустойчивости.

## 🚀 Запуск

### 1. Через Docker Compose
```bash
cd server
docker-compose up -d zookeeper kafka kafka-ui
```

### 2. Проверка статуса
```bash
# Kafka
curl http://localhost:9092

# Kafka UI
http://localhost:8080
```

## 🔧 Конфигурация

### Переменные окружения
```env
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=comments-service
KAFKA_CONSUMER_GROUP_ID=comments-consumer-group
```

### Настройки Kafka
- **Broker**: localhost:9092
- **Zookeeper**: localhost:2181
- **Auto-create topics**: enabled
- **Replication factor**: 1 (для разработки)

## 📊 Структура топиков

### Основные топики
```typescript
export const KAFKA_TOPICS = {
  COMMENT_CREATED: 'comment.created',
  COMMENT_DELETED: 'comment.deleted',
  COMMENT_REPLY_CREATED: 'comment.reply.created',
  COMMENT_SEARCH_REQUESTED: 'comment.search.requested',
  COMMENT_INDEX_REQUESTED: 'comment.index.requested',
  COMMENT_SYNC_REQUESTED: 'comment.sync.requested',
} as const;
```

### События и их структура

#### 1. Создание комментария
```typescript
interface CommentCreatedEvent {
  id: string;
  timestamp: string;
  eventType: 'comment.created';
  source: 'comments-service';
  author: string;
  email: string;
  homepage?: string;
  content: string;
  level: number;
  parentId?: string;
}
```



#### 2. Удаление комментария
```typescript
interface CommentDeletedEvent {
  id: string;
  timestamp: string;
  eventType: 'comment.deleted';
  source: 'comments-service';
  commentId: string;
}
```

#### 3. Создание ответа
```typescript
interface CommentReplyCreatedEvent {
  id: string;
  timestamp: string;
  eventType: 'comment.reply.created';
  source: 'comments-service';
  author: string;
  email: string;
  homepage?: string;
  content: string;
  level: number;
  parentId: string;
}
```

#### 4. Запрос поиска
```typescript
interface CommentSearchRequestedEvent {
  id: string;
  timestamp: string;
  eventType: 'comment.search.requested';
  source: 'comments-service';
  query: string;
  filters?: any;
  requestId: string;
}
```

#### 5. Запрос индексации
```typescript
interface CommentIndexRequestedEvent {
  id: string;
  timestamp: string;
  eventType: 'comment.index.requested';
  source: 'comments-service';
  commentId: string;
  operation: 'create' | 'update' | 'delete';
}
```

#### 6. Запрос синхронизации
```typescript
interface CommentSyncRequestedEvent {
  id: string;
  timestamp: string;
  eventType: 'comment.sync.requested';
  source: 'comments-service';
  syncType: 'full' | 'incremental';
  since?: string;
}
```

## 🔄 Обработка событий

### Event Pattern (Fire-and-Forget)
```typescript
@EventPattern(KAFKA_TOPICS.COMMENT_CREATED)
async handleCommentCreated(@Payload() data: CommentCreatedEvent) {
  // Обработка события без ответа
  this.logger.log(`Comment created: ${data.id}`);
}
```

### Message Pattern (Request-Response)
```typescript
@MessagePattern(KAFKA_TOPICS.COMMENT_SEARCH_REQUESTED)
async handleCommentSearchRequested(@Payload() data: CommentSearchRequestedEvent) {
  // Обработка запроса с ответом
  const results = await this.searchComments(data.query, data.filters);
  return { results, requestId: data.requestId };
}
```

## 📤 Отправка событий

### Отправка события
```typescript
// Отправка события без ожидания ответа
await this.kafkaService.emitCommentCreated(comment);
```

### Отправка запроса с ответом
```typescript
// Отправка запроса с ожиданием ответа
const response = await this.kafkaService.sendCommentSearchRequest(query, filters);
```

### Массовая отправка
```typescript
// Отправка нескольких событий одновременно
await this.kafkaService.emitBulkEvents([
  { topic: 'comment.created', data: comment1 },
  { topic: 'comment.created', data: comment2 },
]);
```

## 🎯 Сценарии использования

### 1. Асинхронная обработка
```typescript
// При создании комментария
async create(createCommentDto: CreateCommentDto): Promise<Comment> {
  const comment = await this.commentsRepository.save(createCommentDto);
  
  // Синхронно индексируем в Elasticsearch
  await this.elasticsearchService.indexComment(comment);
  
  // Асинхронно отправляем событие в Kafka
  await this.kafkaService.emitCommentCreated(comment);
  
  return comment;
}
```

### 2. Обработка поисковых запросов
```typescript
// Асинхронная обработка поиска
async searchCommentsAsync(query: string, filters?: any): Promise<string> {
  // Отправляем запрос в Kafka и получаем ID для отслеживания
  const requestId = await this.kafkaService.emitCommentSearchRequested(query, filters);
  return requestId;
}
```

### 3. Синхронизация данных
```typescript
// Запрос полной синхронизации
async requestFullSync(): Promise<void> {
  await this.kafkaService.emitCommentSyncRequested('full');
}

// Запрос инкрементальной синхронизации
async requestIncrementalSync(since: string): Promise<void> {
  await this.kafkaService.emitCommentSyncRequested('incremental', since);
}
```

## 📈 Мониторинг

### Kafka UI
- **URL**: http://localhost:8080
- **Функции**: просмотр топиков, сообщений, потребителей, производителей

### Статистика Kafka
```typescript
// Получение статистики
const stats = await this.kafkaService.getStats();
console.log('Kafka connected:', stats.connected);
```

### Проверка подключения
```typescript
// Проверка состояния подключения
const isConnected = await this.kafkaService.isConnected();
if (isConnected) {
  console.log('Kafka is connected');
} else {
  console.log('Kafka is disconnected');
}
```

## 🔒 Обработка ошибок

### Retry механизм
```typescript
// Автоматические повторы при ошибках
client: {
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
}
```

### Fallback стратегия
```typescript
try {
  await this.kafkaService.emitCommentCreated(comment);
} catch (error) {
  // Логируем ошибку, но не прерываем основной поток
  this.logger.error(`Failed to emit Kafka event: ${error.message}`);
  
  // Можно добавить fallback логику
  // await this.fallbackService.handleCommentCreated(comment);
}
```

## 📚 Полезные команды

### Управление топиками
```bash
# Создание топика
kafka-topics --create --topic comment.created --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

# Просмотр топиков
kafka-topics --list --bootstrap-server localhost:9092

# Просмотр деталей топика
kafka-topics --describe --topic comment.created --bootstrap-server localhost:9092
```

### Просмотр сообщений
```bash
# Просмотр сообщений в топике
kafka-console-consumer --topic comment.created --bootstrap-server localhost:9092 --from-beginning

# Отправка тестового сообщения
kafka-console-producer --topic comment.created --bootstrap-server localhost:9092
```

### Группы потребителей
```bash
# Просмотр групп потребителей
kafka-consumer-groups --bootstrap-server localhost:9092 --list

# Просмотр деталей группы
kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group comments-consumer-group
```

## 🎯 Лучшие практики

### 1. Именование топиков
- Используйте точечную нотацию: `domain.action`
- Пример: `comment.created`, `user.registered`

### 2. Структура событий
- Всегда включайте `id`, `timestamp`, `eventType`, `source`
- Используйте UUID для уникальных идентификаторов
- Включайте только необходимые данные

### 3. Обработка ошибок
- Логируйте все ошибки
- Используйте retry механизм
- Реализуйте fallback стратегии

### 4. Мониторинг
- Отслеживайте задержки обработки
- Мониторьте размер очередей
- Проверяйте состояние потребителей

## 🔗 Полезные ссылки

- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [Kafka UI](https://github.com/provectus/kafka-ui)
- [Confluent Platform](https://docs.confluent.io/platform/current/overview.html)
