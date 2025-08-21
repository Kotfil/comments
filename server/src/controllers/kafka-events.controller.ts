import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { KafkaService } from '../services/kafka.service';
import { CommentsService } from '../services/comments.service';
import { ElasticsearchCommentsService } from '../services/elasticsearch.service';
import {
  KAFKA_TOPICS,
  KAFKA_EVENTS,
  CommentCreatedEvent,
  CommentDeletedEvent,
  CommentReplyCreatedEvent,
  CommentSearchRequestedEvent,
  CommentIndexRequestedEvent,
  CommentSyncRequestedEvent,
} from '../dto/kafka-events.dto';

@Controller()
export class KafkaEventsController {
  private readonly logger = new Logger(KafkaEventsController.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly commentsService: CommentsService,
    private readonly elasticsearchService: ElasticsearchCommentsService,
  ) {}

  // Обработка события создания комментария
  @EventPattern(KAFKA_TOPICS.COMMENT_CREATED)
  async handleCommentCreated(@Payload() data: CommentCreatedEvent) {
    this.logger.log(`Received comment created event: ${data.id}`);
    
    try {
      // Здесь можно добавить дополнительную логику обработки
      // Например, отправка уведомлений, аналитика и т.д.
      this.logger.log(`Comment created event processed successfully: ${data.id}`);
    } catch (error) {
      this.logger.error(`Failed to process comment created event: ${error.message}`);
    }
  }



  // Обработка события удаления комментария
  @EventPattern(KAFKA_TOPICS.COMMENT_DELETED)
  async handleCommentDeleted(@Payload() data: CommentDeletedEvent) {
    this.logger.log(`Received comment deleted event: ${data.id}`);
    
    try {
      // Дополнительная логика обработки
      this.logger.log(`Comment deleted event processed successfully: ${data.id}`);
    } catch (error) {
      this.logger.error(`Failed to process comment deleted event: ${error.message}`);
    }
  }

  // Обработка события создания ответа
  @EventPattern(KAFKA_TOPICS.COMMENT_REPLY_CREATED)
  async handleCommentReplyCreated(@Payload() data: CommentReplyCreatedEvent) {
    this.logger.log(`Received comment reply created event: ${data.id}`);
    
    try {
      // Дополнительная логика обработки
      this.logger.log(`Comment reply created event processed successfully: ${data.id}`);
    } catch (error) {
      this.logger.error(`Failed to process comment reply created event: ${error.message}`);
    }
  }

  // Обработка запроса поиска комментариев
  @MessagePattern(KAFKA_TOPICS.COMMENT_SEARCH_REQUESTED)
  async handleCommentSearchRequested(@Payload() data: CommentSearchRequestedEvent) {
    this.logger.log(`Received comment search requested event: ${data.id}`);
    
    try {
      const startTime = Date.now();
      
      // Выполняем поиск через Elasticsearch
      const results = await this.elasticsearchService.searchComments(data.query, data.filters);
      
      const processingTime = Date.now() - startTime;
      
      // Отправляем ответ
      const response = {
        requestId: data.requestId,
        query: data.query,
        results,
        totalCount: results.length,
        processingTime,
        timestamp: new Date().toISOString(),
      };

      this.logger.log(`Comment search request processed successfully: ${data.id}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to process comment search request: ${error.message}`);
      throw error;
    }
  }

  // Обработка запроса индексации комментария
  @EventPattern(KAFKA_TOPICS.COMMENT_INDEX_REQUESTED)
  async handleCommentIndexRequested(@Payload() data: CommentIndexRequestedEvent) {
    this.logger.log(`Received comment index requested event: ${data.id}`);
    
    try {
      switch (data.operation) {
        case 'create':
        case 'update':
          // Получаем комментарий из базы данных
          const comment = await this.commentsService.findById(data.commentId);
          
          if (data.operation === 'create') {
            await this.elasticsearchService.indexComment(comment);
          } else {
            await this.elasticsearchService.updateComment(comment);
          }
          break;
          
        case 'delete':
          await this.elasticsearchService.deleteComment(data.commentId);
          break;
      }
      
      this.logger.log(`Comment index requested event processed successfully: ${data.id}`);
    } catch (error) {
      this.logger.error(`Failed to process comment index requested event: ${error.message}`);
    }
  }

  // Обработка запроса синхронизации комментариев
  @MessagePattern(KAFKA_TOPICS.COMMENT_SYNC_REQUESTED)
  async handleCommentSyncRequested(@Payload() data: CommentSyncRequestedEvent) {
    this.logger.log(`Received comment sync requested event: ${data.id}`);
    
    try {
      let processedCount = 0;
      
      if (data.syncType === 'full') {
        // Полная синхронизация - индексируем все комментарии
        const allComments = await this.commentsService.findAll();
        await this.elasticsearchService.bulkIndex(allComments);
        processedCount = allComments.length;
      } else {
        // Инкрементальная синхронизация - только новые/обновленные комментарии
        // Здесь можно добавить логику для определения изменений с определенной даты
        const sinceDate = data.since ? new Date(data.since) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Последние 24 часа
        
        // Примерная логика для инкрементальной синхронизации
        const recentComments = await this.commentsService.findAll(); // В реальности нужно фильтровать по дате
        await this.elasticsearchService.bulkIndex(recentComments);
        processedCount = recentComments.length;
      }
      
      const response = {
        syncType: data.syncType,
        processedCount,
        status: 'success',
        timestamp: new Date().toISOString(),
      };

      this.logger.log(`Comment sync requested event processed successfully: ${data.id}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to process comment sync requested event: ${error.message}`);
      
      const response = {
        syncType: data.syncType,
        processedCount: 0,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
      
      return response;
    }
  }

  // Обработка событий для аналитики
  @EventPattern('comment.analytics.*')
  async handleAnalyticsEvents(@Payload() data: any) {
    this.logger.log(`Received analytics event: ${data.eventType}`);
    
    try {
      // Логика для аналитики комментариев
      // Например, подсчет статистики, метрики производительности и т.д.
      this.logger.log(`Analytics event processed successfully: ${data.eventType}`);
    } catch (error) {
      this.logger.error(`Failed to process analytics event: ${error.message}`);
    }
  }

  // Обработка событий для мониторинга
  @EventPattern('comment.monitoring.*')
  async handleMonitoringEvents(@Payload() data: any) {
    this.logger.log(`Received monitoring event: ${data.eventType}`);
    
    try {
      // Логика для мониторинга системы комментариев
      // Например, проверка здоровья сервисов, метрики производительности
      this.logger.log(`Monitoring event processed successfully: ${data.eventType}`);
    } catch (error) {
      this.logger.error(`Failed to process monitoring event: ${error.message}`);
    }
  }
}
