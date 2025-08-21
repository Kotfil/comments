import { KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const getKafkaConfig = (configService: ConfigService): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: configService.get('KAFKA_BROKERS', 'localhost:9092').split(','),
      clientId: configService.get('KAFKA_CLIENT_ID', 'comments-service'),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    },
    consumer: {
      groupId: configService.get('KAFKA_CONSUMER_GROUP_ID', 'comments-consumer-group'),
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    },
  },
});

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      clientId: process.env.KAFKA_CLIENT_ID || 'comments-service',
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    },
    consumer: {
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'comments-consumer-group',
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    },
  },
};

// Константы для топиков
export const KAFKA_TOPICS = {
  COMMENT_CREATED: 'comment.created',
  COMMENT_DELETED: 'comment.deleted',
  COMMENT_REPLY_CREATED: 'comment.reply.created',
  COMMENT_SEARCH_REQUESTED: 'comment.search.requested',
  COMMENT_INDEX_REQUESTED: 'comment.index.requested',
  COMMENT_SYNC_REQUESTED: 'comment.sync.requested',
} as const;

// Константы для событий
export const KAFKA_EVENTS = {
  COMMENT_CREATED: 'comment.created',
  COMMENT_DELETED: 'comment.deleted',
  COMMENT_REPLY_CREATED: 'comment.reply.created',
  COMMENT_SEARCH_REQUESTED: 'comment.search.requested',
  COMMENT_INDEX_REQUESTED: 'comment.index.requested',
  COMMENT_SYNC_REQUESTED: 'comment.sync.requested',
} as const;
