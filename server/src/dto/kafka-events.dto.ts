import { IsString, IsOptional, IsUUID, IsNumber, IsDateString } from 'class-validator';

// Базовое событие
export class BaseKafkaEvent {
  @IsUUID()
  id: string;

  @IsDateString()
  timestamp: string;

  @IsString()
  eventType: string;

  @IsString()
  source: string;
}

// Событие создания комментария
export class CommentCreatedEvent extends BaseKafkaEvent {
  @IsString()
  author: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  homepage?: string;

  @IsString()
  content: string;

  @IsNumber()
  level: number;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}



// Событие удаления комментария
export class CommentDeletedEvent extends BaseKafkaEvent {
  @IsUUID()
  commentId: string;
}

// Событие создания ответа
export class CommentReplyCreatedEvent extends BaseKafkaEvent {
  @IsString()
  author: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  homepage?: string;

  @IsString()
  content: string;

  @IsNumber()
  level: number;

  @IsUUID()
  parentId: string;
}

// Событие запроса поиска
export class CommentSearchRequestedEvent extends BaseKafkaEvent {
  @IsString()
  query: string;

  @IsOptional()
  filters?: any;

  @IsString()
  requestId: string;
}

// Событие запроса индексации
export class CommentIndexRequestedEvent extends BaseKafkaEvent {
  @IsUUID()
  commentId: string;

  @IsString()
  operation: 'create' | 'update' | 'delete';
}

// Событие запроса синхронизации
export class CommentSyncRequestedEvent extends BaseKafkaEvent {
  @IsString()
  syncType: 'full' | 'incremental';

  @IsOptional()
  @IsDateString()
  since?: string;
}

// Ответ на событие поиска
export class CommentSearchResponseEvent extends BaseKafkaEvent {
  @IsString()
  requestId: string;

  @IsString()
  query: string;

  results: any[];

  @IsNumber()
  totalCount: number;

  @IsNumber()
  processingTime: number;
}

// Ответ на событие индексации
export class CommentIndexResponseEvent extends BaseKafkaEvent {
  @IsUUID()
  commentId: string;

  @IsString()
  operation: 'create' | 'update' | 'delete';

  @IsString()
  status: 'success' | 'error';

  @IsOptional()
  @IsString()
  error?: string;
}

// Ответ на событие синхронизации
export class CommentSyncResponseEvent extends BaseKafkaEvent {
  @IsString()
  syncType: 'full' | 'incremental';

  @IsNumber()
  processedCount: number;

  @IsString()
  status: 'success' | 'error';

  @IsOptional()
  @IsString()
  error?: string;
}
