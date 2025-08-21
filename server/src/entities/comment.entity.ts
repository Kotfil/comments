import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('comments')
export class Comment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  author: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  homepage?: string;

  @Field()
  @Column({ type: 'varchar', length: 10, default: '👤' })
  avatar: string;

  @Field()
  @Column({ type: 'text' })
  content: string;

  @Field()
  @CreateDateColumn()
  timestamp: Date;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  likes: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  dislikes: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  level: number;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.parent, {
    cascade: true,
    eager: false,
  })
  replies: Comment[];

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Comment;

  @Column({ type: 'uuid', nullable: true })
  parent_id?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
