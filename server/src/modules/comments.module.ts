import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommentsService } from '../services/comments.service';
import { CommentsResolver } from '../resolvers/comments.resolver';
import { ElasticsearchCommentsService } from '../services/elasticsearch.service';
import { KafkaService } from '../services/kafka.service';
import { KafkaEventsController } from '../controllers/kafka-events.controller';
import { Comment } from '../entities/comment.entity';
import { getElasticsearchConfig } from '../config/elasticsearch.config';
import { getKafkaConfig } from '../config/kafka.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    ElasticsearchModule.registerAsync({
      useFactory: getElasticsearchConfig,
      inject: [],
    }),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: getKafkaConfig,
        inject: [],
      },
    ]),
  ],
  providers: [CommentsService, CommentsResolver, ElasticsearchCommentsService, KafkaService],
  controllers: [KafkaEventsController],
  exports: [CommentsService],
})
export class CommentsModule {}
