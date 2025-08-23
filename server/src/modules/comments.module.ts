import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from '../services/comments.service';
import { CommentsResolver } from '../resolvers/comments.resolver';
import { CleanupService } from '../services/cleanup.service';
import { CleanupController } from '../controllers/cleanup.controller';
import { Comment } from '../entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
  ],
  controllers: [CleanupController],
  providers: [CommentsService, CommentsResolver, CleanupService],
  exports: [CommentsService, CleanupService],
})
export class CommentsModule {}
