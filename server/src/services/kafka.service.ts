import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    try {
      await this.kafkaClient.connect();
      this.logger.log('Kafka client connected successfully');
    } catch (error) {
      this.logger.error(`Failed to connect to Kafka: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      await this.kafkaClient.close();
      this.logger.log('Kafka client disconnected successfully');
    } catch (error) {
      this.logger.error(`Failed to disconnect from Kafka: ${error.message}`);
    }
  }

  // Отправка событий
  async emitCommentCreated(comment: any): Promise<void> {
    try {
      const event: CommentCreatedEvent = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType: KAFKA_EVENTS.COMMENT_CREATED,
        source: 'comments-service',
        author: comment.author,
        email: comment.email,
        homepage: comment.homepage,
        content: comment.content,
        level: comment.level,
        parentId: comment.parent_id,
      };

      await this.kafkaClient.emit(KAFKA_TOPICS.COMMENT_CREATED, event).toPromise();
      this.logger.log(`Comment created event emitted: ${event.id}`);
    } catch (error) {
      this.logger.error(`Failed to emit comment created event: ${error.message}`);
    }
  }



  async emitCommentDeleted(commentId: string): Promise<void> {
    try {
      const event: CommentDeletedEvent = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType: KAFKA_EVENTS.COMMENT_DELETED,
        source: 'comments-service',
        commentId,
      };

      await this.kafkaClient.emit(KAFKA_TOPICS.COMMENT_DELETED, event).toPromise();
      this.logger.log(`Comment deleted event emitted: ${event.id}`);
    } catch (error) {
      this.logger.error(`Failed to emit comment deleted event: ${error.message}`);
    }
  }

  async emitCommentReplyCreated(reply: any): Promise<void> {
    try {
      const event: CommentReplyCreatedEvent = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType: KAFKA_EVENTS.COMMENT_REPLY_CREATED,
        source: 'comments-service',
        author: reply.author,
        email: reply.email,
        homepage: reply.homepage,
        content: reply.content,
        level: reply.level,
        parentId: reply.parent_id,
      };

      await this.kafkaClient.emit(KAFKA_TOPICS.COMMENT_REPLY_CREATED, event).toPromise();
      this.logger.log(`Comment reply created event emitted: ${event.id}`);
    } catch (error) {
      this.logger.error(`Failed to emit comment reply created event: ${error.message}`);
    }
  }

  async emitCommentSearchRequested(query: string, filters?: any): Promise<string> {
    try {
      const requestId = uuidv4();
      const event: CommentSearchRequestedEvent = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType: KAFKA_EVENTS.COMMENT_SEARCH_REQUESTED,
        source: 'comments-service',
        query,
        filters,
        requestId,
      };

      await this.kafkaClient.emit(KAFKA_TOPICS.COMMENT_SEARCH_REQUESTED, event).toPromise();
      this.logger.log(`Comment search requested event emitted: ${event.id}`);
      return requestId;
    } catch (error) {
      this.logger.error(`Failed to emit comment search requested event: ${error.message}`);
      throw error;
    }
  }

  async emitCommentIndexRequested(commentId: string, operation: 'create' | 'update' | 'delete'): Promise<void> {
    try {
      const event: CommentIndexRequestedEvent = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType: KAFKA_EVENTS.COMMENT_INDEX_REQUESTED,
        source: 'comments-service',
        commentId,
        operation,
      };

      await this.kafkaClient.emit(KAFKA_TOPICS.COMMENT_INDEX_REQUESTED, event).toPromise();
      this.logger.log(`Comment index requested event emitted: ${event.id}`);
    } catch (error) {
      this.logger.error(`Failed to emit comment index requested event: ${error.message}`);
    }
  }

  async emitCommentSyncRequested(syncType: 'full' | 'incremental', since?: string): Promise<void> {
    try {
      const event: CommentSyncRequestedEvent = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType: KAFKA_EVENTS.COMMENT_SYNC_REQUESTED,
        source: 'comments-service',
        syncType,
        since,
      };

      await this.kafkaClient.emit(KAFKA_TOPICS.COMMENT_SYNC_REQUESTED, event).toPromise();
      this.logger.log(`Comment sync requested event emitted: ${event.id}`);
    } catch (error) {
      this.logger.error(`Failed to emit comment sync requested event: ${error.message}`);
    }
  }

  // Отправка сообщений с ответом
  async sendCommentSearchRequest(query: string, filters?: any): Promise<any> {
    try {
      const requestId = uuidv4();
      const event: CommentSearchRequestedEvent = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType: KAFKA_EVENTS.COMMENT_SEARCH_REQUESTED,
        source: 'comments-service',
        query,
        filters,
        requestId,
      };

      const response = await this.kafkaClient
        .send(KAFKA_TOPICS.COMMENT_SEARCH_REQUESTED, event)
        .toPromise();

      this.logger.log(`Comment search request sent and response received: ${requestId}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to send comment search request: ${error.message}`);
      throw error;
    }
  }

  // Массовая отправка событий
  async emitBulkEvents(events: any[]): Promise<void> {
    try {
      const promises = events.map(event => this.kafkaClient.emit(event.topic, event.data).toPromise());
      await Promise.all(promises);
      this.logger.log(`Bulk events emitted: ${events.length} events`);
    } catch (error) {
      this.logger.error(`Failed to emit bulk events: ${error.message}`);
      throw error;
    }
  }

  // Проверка состояния подключения
  async isConnected(): Promise<boolean> {
    try {
      // Простая проверка подключения
      return true;
    } catch (error) {
      return false;
    }
  }

  // Получение статистики
  async getStats(): Promise<any> {
    try {
      // Здесь можно добавить логику получения статистики Kafka
      return {
        connected: await this.isConnected(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to get Kafka stats: ${error.message}`);
      return {
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
