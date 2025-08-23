import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { CommentHeader } from '@/components/simple-components/comment-header';
import { CommentContent } from '@/components/simple-components/comment-content';
import { AttachedFiles } from '@/components/simple-components/attached-files';
import { CommentItemProps } from './comment-item.types';

export const CommentItem: React.FC<CommentItemProps> = ({
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

  // Обработчик скачивания файлов (временно отключен)
  // const handleFileDownload = useCallback((file: any) => {
  //   // Создаем ссылку для скачивания
  //   const link = document.createElement('a');
  //   link.href = file.data;
  //   link.download = file.name;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }, []);

  return (
    <Box
      sx={{
        ml: level * 3,
        mb: 2,
        position: 'relative',
        '&::before':
          level > 0
            ? {
                content: '""',
                position: 'absolute',
                left: -16,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#e0e0e0',
              }
            : {},
      }}
    >
      <CommentHeader
        author={comment.author}
        timestamp={comment.timestamp}
        avatar={comment.avatar}
        onAction={handleAction}
      />

      <CommentContent content={comment.content} onReply={handleReply} />

      {/* Показываем прикрепленные файлы только для основных комментариев */}
      {/* {level === 0 && comment.files && comment.files.length > 0 && (
        <AttachedFiles files={comment.files} onDownload={handleFileDownload} />
      )} */}

      {/* Показываем HomePage только для основных комментариев */}
      {level === 0 && comment.homepage && (
        <Box
          sx={{
            mt: 1,
            cursor: 'pointer',
            color: 'primary.main',
            textDecoration: 'underline',
            fontSize: '0.875rem',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
          onClick={handleHomepageClick}
          title="Кликните для перехода по ссылке"
        >
          🌐 {comment.homepage}
        </Box>
      )}

      {/* Рекурсивно рендерим ответы */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              level={level + 1}
              onReply={onReply}
              onAction={onAction}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export type { CommentItemProps };
