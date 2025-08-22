import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  private cleanupStats = {
    totalCleaned: 0,
    lastCleanup: null,
    errors: 0,
    lastCleanupTime: null,
  };

  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  // Автоматическая очистка каждые 5 минут
  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupOldComments() {
    const startTime = Date.now();
    
    try {
      // Удаляем комментарии старше 5 минут
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const result = await this.commentsRepository.delete({
        created_at: LessThan(fiveMinutesAgo),
      });

      const duration = Date.now() - startTime;
      const cleanedCount = result.affected || 0;
      
      // Обновляем статистику
      this.cleanupStats.totalCleaned += cleanedCount;
      this.cleanupStats.lastCleanup = new Date();
      this.cleanupStats.lastCleanupTime = duration;

      this.logger.log(
        `🧹 Cleanup completed: ${cleanedCount} comments removed in ${duration}ms`
      );

      // Выводим статистику в консоль для мониторинга
      console.log(`📊 Cleanup Stats: ${JSON.stringify(this.cleanupStats, null, 2)}`);
      
      // Если очистили много комментариев, логируем предупреждение
      if (cleanedCount > 100) {
        this.logger.warn(`⚠️ Large cleanup: ${cleanedCount} comments removed`);
      }
      
    } catch (error) {
      this.cleanupStats.errors++;
      this.logger.error('❌ Cleanup failed:', error);
      
      // Детальное логирование ошибки
      console.error('Cleanup Error Details:', {
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack,
        stats: this.cleanupStats,
      });
    }
  }

  // Альтернативная очистка по конкретному времени (каждые 5 минут в 0 секунд)
  @Cron('0 */5 * * * *')
  async cleanupCommentsAtSpecificTime() {
    this.logger.log('🕐 Scheduled cleanup triggered at specific time');
    await this.cleanupOldComments();
  }

  // Ручной запуск очистки (для тестирования)
  async manualCleanup() {
    this.logger.log('🔧 Manual cleanup triggered');
    return this.cleanupOldComments();
  }

  // Получение статистики очистки
  getCleanupStats() {
    return {
      ...this.cleanupStats,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }

  // Сброс статистики
  resetStats() {
    this.cleanupStats = {
      totalCleaned: 0,
      lastCleanup: null,
      errors: 0,
      lastCleanupTime: null,
    };
    this.logger.log('🔄 Cleanup stats reset');
  }

  // Проверка здоровья сервиса
  async healthCheck() {
    try {
      const count = await this.commentsRepository.count();
      return {
        status: 'healthy',
        totalComments: count,
        lastCleanup: this.cleanupStats.lastCleanup,
        totalCleaned: this.cleanupStats.totalCleaned,
        errors: this.cleanupStats.errors,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
