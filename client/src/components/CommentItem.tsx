import React from 'react';
import { Comment } from '@/data/mock-comments';
import {
  CommentContainer,
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
} from './CommentItem.styles';

interface CommentItemProps {
  comment: Comment;
  showVerticalLine?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  showVerticalLine = false,
}) => {
  const hasReplies = comment.replies.length > 0;

  return (
    <CommentWrapper>
      {showVerticalLine && <VerticalLine />}
      <CommentContainer level={comment.level}>
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
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                showVerticalLine={true}
              />
            ))}
          </div>
        )}
      </CommentContainer>
    </CommentWrapper>
  );
};
