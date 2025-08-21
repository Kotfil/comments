import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

@InputType()
export class CreateCommentDto {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  author: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  homepage?: string;

  @Field()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string;
}

@InputType()
export class CreateReplyDto extends CreateCommentDto {
  @Field()
  @IsString()
  parentId: string;
}
