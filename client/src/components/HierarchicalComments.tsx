import React from 'react';
import { Comment } from '@/data/mock-comments';
import { mockComments } from '@/data/mock-comments';
import {
  HierarchicalContainer,
  CommentBlock,
  CommentHeader,
  Avatar,
  UserInfo,
  Username,
  Timestamp,
  ActionIcons,
  IconButton,
  VoteCounter,
  CommentContent,
  CommentText,
  ReplyButton,
  VerticalLine,
  CommentWrapper,
  HierarchicalTitle,
} from './HierarchicalComments.styles';

export const HierarchicalComments: React.FC = () => {
  const renderComment = (comment: Comment, level: number = 0, showVerticalLine: boolean = false) => {
    const hasReplies = comment.replies.length > 0;

    return (
      <CommentWrapper key={comment.id}>
        {showVerticalLine && <VerticalLine />}
        <CommentBlock level={level}>
          <CommentHeader>
            <Avatar>{comment.avatar}</Avatar>
            <UserInfo>
              <Username>{comment.author}</Username>
              <Timestamp>{comment.timestamp}</Timestamp>
            </UserInfo>
            <ActionIcons>
              <IconButton>#</IconButton>
              <IconButton>🔖</IconButton>
              <IconButton>⬆️</IconButton>
              <IconButton>⬇️</IconButton>
              <IconButton>🔄</IconButton>
              <VoteCounter>
                ↑{comment.likes}↓{comment.dislikes}
              </VoteCounter>
            </ActionIcons>
          </CommentHeader>
          
          <CommentContent>
            <CommentText>{comment.content}</CommentText>
            <ReplyButton>Ответить</ReplyButton>
          </CommentContent>
          
          {hasReplies && (
            <div className="replies">
              {comment.replies.map((reply, index) => (
                <div key={reply.id}>
                  {renderComment(reply, level + 1, true)}
                </div>
              ))}
            </div>
          )}
        </CommentBlock>
      </CommentWrapper>
    );
  };

  return (
    <HierarchicalContainer>
      <HierarchicalTitle variant="h6">Иерархические комментарии</HierarchicalTitle>
      {mockComments.map((comment) => renderComment(comment))}
    </HierarchicalContainer>
  );
};
