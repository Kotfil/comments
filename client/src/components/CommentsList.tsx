import React from 'react';
import { CommentItem } from './CommentItem';
import { Comment } from '@/data/mock-comments';
import { CommentsListContainer, CommentsTitle } from './CommentsList.styles';

interface CommentsListProps {
  comments: Comment[];
}

export const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  return (
    <CommentsListContainer>
      <CommentsTitle>Комментарии ({comments.length})</CommentsTitle>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </CommentsListContainer>
  );
};
