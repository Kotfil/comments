import React from 'react';
import { Comment } from '@/data/mock-comments';
import { UserInfo } from '@/components/molecules/user-info';
import { ActionButtons } from '@/components/molecules/action-buttons';
import { CommentContent } from '@/components/molecules/comment-content';
import { CommentCardProps } from './comment-card.types';
import { StyledCommentCard, CommentCardHeader, CommentCardReplies } from './comment-card.styles';

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  level = 0,
  onReply,
  onAction,
}) => {
  const handleReply = () => {
    onReply?.(comment);
  };

  const handleAction = (action: string) => {
    onAction?.(action, comment);
  };

  return (
    <StyledCommentCard level={level}>
      <CommentCardHeader>
        <UserInfo
          author={comment.author}
          timestamp={comment.timestamp}
          avatar={comment.avatar}
        />
        
        <ActionButtons
          likes={comment.likes}
          dislikes={comment.dislikes}
          onAction={handleAction}
        />
      </CommentCardHeader>
      
      <CommentContent
        content={comment.content}
        onReply={handleReply}
      />
      
      {/* Рекурсивно рендерим ответы */}
      {comment.replies.length > 0 && (
        <CommentCardReplies>
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              level={level + 1}
              onReply={onReply}
              onAction={onAction}
            />
          ))}
        </CommentCardReplies>
      )}
    </StyledCommentCard>
  );
};
