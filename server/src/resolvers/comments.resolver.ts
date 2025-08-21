import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto, CreateReplyDto } from '../dto/create-comment.dto';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [Comment], { description: 'Получить все комментарии' })
  async comments(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Query(() => Comment, { description: 'Получить комментарий по ID' })
  async comment(@Args('id') id: string): Promise<Comment> {
    return this.commentsService.findById(id);
  }

  @Query(() => Comment, { description: 'Получить комментарий по HomePage' })
  async commentByHomepage(@Args('homepage') homepage: string): Promise<Comment> {
    return this.commentsService.findByHomepage(homepage);
  }

  @Query(() => [Comment], { description: 'Поиск комментариев' })
  async searchComments(
    @Args('query') query: string,
    @Args('filters', { nullable: true }) filters?: any,
  ): Promise<Comment[]> {
    return this.commentsService.searchComments(query, filters);
  }

  @Query(() => [Comment], { description: 'Поиск комментариев по содержимому' })
  async searchByContent(@Args('content') content: string): Promise<Comment[]> {
    return this.commentsService.searchByContent(content);
  }

  @Query(() => [Comment], { description: 'Поиск комментариев по автору' })
  async searchByAuthor(@Args('author') author: string): Promise<Comment[]> {
    return this.commentsService.searchByAuthor(author);
  }

  @Query(() => [Comment], { description: 'Поиск комментариев по HomePage' })
  async searchByHomepage(@Args('homepage') homepage: string): Promise<Comment[]> {
    return this.commentsService.searchByHomepage(homepage);
  }

  @Query(() => [String], { description: 'Получить предложения для автодополнения' })
  async getSuggestions(@Args('query') query: string): Promise<string[]> {
    return this.commentsService.getSuggestions(query);
  }

  @Mutation(() => Comment, { description: 'Создать новый комментарий' })
  async createComment(
    @Args('input') createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  @Mutation(() => Comment, { description: 'Создать ответ на комментарий' })
  async createReply(
    @Args('input') createReplyDto: CreateReplyDto,
  ): Promise<Comment> {
    return this.commentsService.createReply(createReplyDto);
  }



  @Mutation(() => Boolean, { description: 'Удалить комментарий' })
  async deleteComment(@Args('id') id: string): Promise<boolean> {
    await this.commentsService.delete(id);
    return true;
  }

  // Резолвер для поля replies
  @ResolveField(() => [Comment])
  async replies(@Parent() comment: Comment): Promise<Comment[]> {
    if (comment.replies) {
      return comment.replies;
    }
    
    // Если replies не загружены, загружаем их
    const fullComment = await this.commentsService.findById(comment.id);
    return fullComment.replies || [];
  }

  // Резолвер для поля parent
  @ResolveField(() => Comment, { nullable: true })
  async parent(@Parent() comment: Comment): Promise<Comment | null> {
    if (comment.parent) {
      return comment.parent;
    }
    
    if (comment.parent_id) {
      try {
        return await this.commentsService.findById(comment.parent_id);
      } catch {
        return null;
      }
    }
    
    return null;
  }
}
