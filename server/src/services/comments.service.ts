import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto, CreateReplyDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { parent_id: null }, // Только основные комментарии
      relations: ['replies', 'replies.replies'], // Загружаем ответы
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['replies', 'replies.replies'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async findByHomepage(homepage: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { homepage },
      relations: ['replies', 'replies.replies'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with homepage ${homepage} not found`);
    }

    return comment;
  }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      level: 0,
      avatar: '👤',
    });

    const savedComment = await this.commentsRepository.save(comment);
    return savedComment;
  }

  async createReply(createReplyDto: CreateReplyDto): Promise<Comment> {
    // Проверяем существование родительского комментария
    const parentComment = await this.findById(createReplyDto.parentId);
    
    const reply = this.commentsRepository.create({
      ...createReplyDto,
      parent_id: createReplyDto.parentId,
      level: parentComment.level + 1,
      avatar: '👤',
    });

    const savedReply = await this.commentsRepository.save(reply);
    return savedReply;
  }



  async delete(id: string): Promise<void> {
    const comment = await this.findById(id);
    await this.commentsRepository.remove(comment);
  }

  // Метод для заполнения базы тестовыми данными
  async seedDatabase(): Promise<void> {
    const existingComments = await this.commentsRepository.count();
    
    if (existingComments === 0) {
      const sampleComments = [
        {
          author: 'John Doe',
          email: 'john@example.com',
          homepage: 'johndoe',
          content: 'Отличный пост! Очень информативно.',
          avatar: '👨‍💻',
          level: 0,
        },
        {
          author: 'Jane Smith',
          email: 'jane@example.com',
          homepage: 'janesmith',
          content: 'Согласна с предыдущим комментарием. Добавлю от себя: очень полезная информация!',
          avatar: '👩‍🎨',
          level: 0,
        },
        {
          author: 'Bob Johnson',
          email: 'bob@example.com',
          content: 'Интересная точка зрения. Хотелось бы узнать больше деталей.',
          avatar: '👨‍🔬',
          level: 0,
        },
      ];

      for (const commentData of sampleComments) {
        await this.create(commentData);
      }

      console.log('Database seeded with sample data');
    }
  }

  // Методы поиска через SQL
  async searchComments(query: string, filters?: any): Promise<any[]> {
    const qb = this.commentsRepository.createQueryBuilder('comment');
    
    if (query) {
      qb.where('comment.content ILIKE :query OR comment.author ILIKE :query', {
        query: `%${query}%`
      });
    }
    
    return qb.orderBy('comment.created_at', 'DESC').getMany();
  }

  async searchByContent(content: string): Promise<any[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.content ILIKE :content', { content: `%${content}%` })
      .orderBy('comment.created_at', 'DESC')
      .getMany();
  }

  async searchByAuthor(author: string): Promise<any[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.author ILIKE :author', { author: `%${author}%` })
      .orderBy('comment.created_at', 'DESC')
      .getMany();
  }

  async searchByHomepage(homepage: string): Promise<any[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.homepage ILIKE :homepage', { homepage: `%${homepage}%` })
      .orderBy('comment.created_at', 'DESC')
      .getMany();
  }

  async getSuggestions(query: string): Promise<string[]> {
    const authors = await this.commentsRepository
      .createQueryBuilder('comment')
      .select('DISTINCT comment.author', 'author')
      .where('comment.author ILIKE :query', { query: `%${query}%` })
      .limit(5)
      .getRawMany();
    
    return authors.map(a => a.author);
  }
}
