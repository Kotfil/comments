# 🧹 Comments Cleanup System

## Overview
Автоматическая система очистки комментариев, которая удаляет комментарии старше 5 минут каждые 5 минут.

## 🚀 Features

### Automatic Cleanup
- **Cron Job**: Каждые 5 минут автоматически удаляет старые комментарии
- **Smart Deletion**: Удаляет только комментарии старше 5 минут
- **Error Handling**: Обработка ошибок с детальным логированием
- **Statistics**: Сбор статистики по очистке

### Manual Control
- **Manual Trigger**: Возможность запустить очистку вручную
- **Stats Reset**: Сброс статистики очистки
- **Health Check**: Проверка состояния сервиса

## 📊 API Endpoints

### GET `/cleanup/stats`
Получить статистику очистки:
```json
{
  "totalCleaned": 150,
  "lastCleanup": "2024-01-01T12:00:00.000Z",
  "errors": 0,
  "lastCleanupTime": 45,
  "uptime": 3600,
  "memoryUsage": {
    "rss": 123456789,
    "heapTotal": 987654321,
    "heapUsed": 123456789,
    "external": 12345
  }
}
```

### GET `/cleanup/health`
Проверить здоровье сервиса:
```json
{
  "status": "healthy",
  "totalComments": 25,
  "lastCleanup": "2024-01-01T12:00:00.000Z",
  "totalCleaned": 150,
  "errors": 0
}
```

### POST `/cleanup/manual`
Запустить очистку вручную:
```json
{
  "message": "Manual cleanup triggered successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### DELETE `/cleanup/stats`
Сбросить статистику:
```json
{
  "message": "Stats reset successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET `/cleanup/system`
Информация о системе:
```json
{
  "uptime": 3600,
  "memoryUsage": {...},
  "nodeVersion": "v18.17.0",
  "platform": "win32",
  "arch": "x64",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## ⚙️ Configuration

### Cron Expression
```typescript
// Каждые 5 минут
@Cron(CronExpression.EVERY_5_MINUTES)

// Альтернативно: каждые 5 минут в 0 секунд
@Cron('0 */5 * * * *')
```

### Environment Variables
```bash
# Интервал очистки в минутах (по умолчанию: 5)
CLEANUP_INTERVAL_MINUTES=5

# Максимальное количество комментариев для очистки за раз
MAX_CLEANUP_BATCH_SIZE=1000

# Логирование детальной информации
CLEANUP_VERBOSE_LOGGING=true
```

## 🔧 Installation & Setup

### 1. Dependencies
```bash
npm install @nestjs/schedule
npm install --save-dev @types/cron
```

### 2. Module Configuration
```typescript
// app.module.ts
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // ... other modules
  ],
  providers: [CleanupService],
  controllers: [CleanupController],
})
export class AppModule {}
```

### 3. Service Registration
```typescript
// cleanup.service.ts
@Injectable()
export class CleanupService {
  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupOldComments() {
    // ... cleanup logic
  }
}
```

## 📈 Monitoring

### Console Output
```
🧹 Cleanup completed: 25 comments removed in 45ms
📊 Cleanup Stats: {
  "totalCleaned": 150,
  "lastCleanup": "2024-01-01T12:00:00.000Z",
  "errors": 0,
  "lastCleanupTime": 45
}
```

### Log Levels
- **INFO**: Успешная очистка
- **WARN**: Большое количество удаленных комментариев (>100)
- **ERROR**: Ошибки при очистке

### Performance Metrics
- **Duration**: Время выполнения очистки
- **Batch Size**: Количество удаленных комментариев
- **Error Rate**: Процент ошибок
- **Memory Usage**: Использование памяти

## 🚨 Troubleshooting

### Common Issues

#### 1. Cleanup Not Running
```bash
# Проверить логи
pm2 logs comments-server

# Проверить статус
pm2 status

# Перезапустить при необходимости
pm2 restart comments-server
```

#### 2. Database Connection Issues
```bash
# Проверить подключение к БД
npm run typeorm -- schema:sync

# Проверить .env файл
cat .env
```

#### 3. Performance Issues
```bash
# Проверить статистику
curl http://localhost:3001/cleanup/stats

# Проверить здоровье
curl http://localhost:3001/cleanup/health
```

### Debug Mode
```typescript
// Включить детальное логирование
@Cron(CronExpression.EVERY_5_MINUTES)
async cleanupOldComments() {
  console.log('🔍 Debug: Starting cleanup...');
  // ... cleanup logic
  console.log('🔍 Debug: Cleanup completed');
}
```

## 🔄 PM2 Integration

### Ecosystem Config
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'comments-server',
    script: 'dist/main.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

### PM2 Commands
```bash
# Запуск
pm2 start ecosystem.config.js

# Мониторинг
pm2 monit

# Логи
pm2 logs comments-server

# Перезапуск
pm2 restart comments-server

# Остановка
pm2 stop comments-server
```

## 📋 Testing

### Manual Testing
```bash
# Запустить очистку вручную
curl -X POST http://localhost:3001/cleanup/manual

# Проверить статистику
curl http://localhost:3001/cleanup/stats

# Проверить здоровье
curl http://localhost:3001/cleanup/health
```

### Automated Testing
```typescript
// cleanup.service.spec.ts
describe('CleanupService', () => {
  it('should cleanup old comments', async () => {
    // ... test implementation
  });
});
```

## 🚀 Production Deployment

### Best Practices
1. **Monitoring**: Настройте мониторинг через PM2
2. **Logging**: Настройте ротацию логов
3. **Backup**: Регулярно делайте бэкапы БД
4. **Alerts**: Настройте алерты при ошибках

### Performance Tuning
```typescript
// Оптимизация для больших объемов
@Cron(CronExpression.EVERY_5_MINUTES)
async cleanupOldComments() {
  const batchSize = 1000;
  let totalCleaned = 0;
  
  while (true) {
    const result = await this.commentsRepository.delete({
      created_at: LessThan(new Date(Date.now() - 5 * 60 * 1000)),
    }).limit(batchSize);
    
    if (result.affected === 0) break;
    totalCleaned += result.affected;
    
    // Небольшая пауза между батчами
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
```

## 📚 Additional Resources

- [NestJS Schedule Documentation](https://docs.nestjs.com/techniques/task-scheduling)
- [Cron Expression Generator](https://crontab.guru/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [TypeORM Query Builder](https://typeorm.io/#/select-query-builder)
