import React, { useCallback } from 'react';
import { Comment } from '@/data/mock-comments';
import { UserInfo } from '@/components/simple-components/user-info';
import { ActionButtons } from '@/components/simple-components/action-buttons';
import { CommentContent } from '@/components/simple-components/comment-content';
import { CommentCardProps } from './comment-card.types';
import {
  StyledCommentCard,
  CommentCardHeader,
  CommentCardReplies,
} from './comment-card.styles';

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  level = 0,
  onReply,
  onAction,
}) => {
  // Мемоизируем обработчик ответа
  const handleReply = useCallback(() => {
    onReply?.(comment);
  }, [onReply, comment]);

  // Мемоизируем обработчик действий
  const handleAction = useCallback(
    (action: string) => {
      onAction?.(action, comment);
    },
    [onAction, comment]
  );

  // Мемоизируем обработчик клика по HomePage
  const handleHomepageClick = useCallback(() => {
    if (comment.homepage && level === 0) {
      // Если это относительный путь, переходим на страницу комментария
      if (comment.homepage.startsWith('http')) {
        window.open(comment.homepage, '_blank', 'noopener,noreferrer');
      } else {
        // Переходим на страницу комментария в том же окне
        window.location.href = `/${comment.homepage}`;
      }
    }
  }, [comment.homepage, level]);

  return (
    <StyledCommentCard level={level}>
      <CommentCardHeader>
        <UserInfo
          author={comment.author}
          timestamp={comment.timestamp}
          avatar={comment.avatar}
        />

        <ActionButtons onAction={handleAction} />
      </CommentCardHeader>

      <CommentContent content={comment.content} onReply={handleReply} />

      {/* Показываем HomePage только для основных комментариев */}
      {level === 0 && comment.homepage && (
        <div
          style={{
            marginTop: '8px',
            cursor: 'pointer',
            color: '#1976d2',
            textDecoration: 'underline',
            fontSize: '0.875rem',
          }}
          onClick={handleHomepageClick}
          title="Кликните для перехода по ссылке"
        >
          🌐 {comment.homepage}
        </div>
      )}

      {/* Рекурсивно рендерим ответы */}
      {comment.replies && comment.replies.length > 0 && (
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

export type { CommentCardProps };
