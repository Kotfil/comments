import React, { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { Comment } from '@/graphql/types';
import { CommentsLayout } from '@/components/templates/comments-layout';
import { CommentCard } from '@/components/organisms/comment-card';
import { CommentModal } from '@/components/templates/comment-modal';
import { CommentFormData } from '@/components/organisms/comment-form';
import { PaginationComponent } from '@/components/molecules/pagination';
import { PollingControl } from '@/components/molecules/polling-control';
import { HierarchicalCommentsPageProps } from './hierarchical-comments-page.types';
import { 
  useComments, 
  useCreateComment, 
  useCreateReply
} from '@/hooks/use-comments';
import { Box } from '@mui/material';

export const HierarchicalCommentsPage: React.FC<HierarchicalCommentsPageProps> = ({ 
  onAddComment 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pollInterval, setPollInterval] = useState(30000); // 30 секунд по умолчанию
  const commentsPerPage = 25;

  // GraphQL хуки с polling
  const { 
    comments, 
    loading: commentsLoading, 
    error: commentsError, 
    refetch,
    startPolling,
    stopPolling
  } = useComments(pollInterval);
  
  const { createComment, loading: createLoading, error: createError } = useCreateComment();
  const { createReply, loading: replyLoading, error: replyError } = useCreateReply();

  // Отложенное значение для оптимизации рендеринга больших списков
  const deferredComments = useDeferredValue(comments);

  // Вычисляем общее количество страниц
  const totalPages = useMemo(() => {
    return Math.ceil(deferredComments.length / commentsPerPage);
  }, [deferredComments.length]);

  // Получаем комментарии для текущей страницы
  const currentComments = useMemo(() => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    return deferredComments.slice(startIndex, endIndex);
  }, [deferredComments, currentPage, commentsPerPage]);

  // Мемоизируем обработчик смены страницы
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Прокручиваем страницу вверх при смене страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Мемоизируем обработчик добавления комментария
  const handleAddComment = useCallback(async (commentData: CommentFormData) => {
    try {
      if (replyToComment) {
        // Создаем ответ на комментарий
        await createReply({
          parentId: replyToComment.id,
          author: commentData.author,
          email: commentData.email,
          homepage: commentData.homepage,
          content: commentData.content,
        });
      } else {
        // Создаем новый основной комментарий
        await createComment({
          author: commentData.author,
          email: commentData.email,
          homepage: commentData.homepage,
          content: commentData.content,
        });
        // Сбрасываем на первую страницу при добавлении нового комментария
        setCurrentPage(1);
      }

      // Если передан внешний обработчик, вызываем его
      if (onAddComment) {
        onAddComment(commentData);
      }

      setReplyToComment(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      // Здесь можно добавить уведомление об ошибке
    }
  }, [replyToComment, createComment, createReply, onAddComment]);

  // Мемоизируем обработчик клика по ответу
  const handleReplyClick = useCallback((comment: Comment) => {
    setReplyToComment(comment);
    setIsModalOpen(true);
  }, []);

  // Мемоизируем обработчик добавления основного комментария
  const handleAddMainComment = useCallback(() => {
    setReplyToComment(null);
    setIsModalOpen(true);
  }, []);

  // Мемоизируем обработчик действий
  const handleAction = useCallback((action: string, comment: Comment) => {
    // Обработка действий с комментарием
    console.log(`Action: ${action} on comment:`, comment);
  }, []);

  // Мемоизируем обработчик закрытия модала
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setReplyToComment(null);
  }, []);

  // Обработчики для polling
  const handleStartPolling = useCallback(() => {
    startPolling();
  }, [startPolling]);

  const handleStopPolling = useCallback(() => {
    stopPolling();
  }, [stopPolling]);

  const handleIntervalChange = useCallback((newInterval: number) => {
    setPollInterval(newInterval);
  }, []);

  // Мемоизируем информацию о пагинации
  const paginationInfo = useMemo(() => ({
    currentCount: currentComments.length,
    totalCount: deferredComments.length,
    currentPage,
    totalPages
  }), [currentComments.length, deferredComments.length, currentPage, totalPages]);

  // Показываем загрузку
  if (commentsLoading) {
    return (
      <CommentsLayout title="Иерархические комментарии">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Загрузка комментариев...
        </div>
      </CommentsLayout>
    );
  }

  // Показываем ошибку
  if (commentsError) {
    return (
      <CommentsLayout title="Иерархические комментарии">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Ошибка загрузки комментариев: {commentsError.message}
          <button onClick={() => refetch()} style={{ marginLeft: '1rem' }}>
            Попробовать снова
          </button>
        </div>
      </CommentsLayout>
    );
  }

  return (
    <CommentsLayout
      title="Иерархические комментарии"
      onAddComment={handleAddMainComment}
    >
      {/* Управление polling */}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        gap={2}
        sx={{ 
          mb: 3, 
          p: 2, 
          backgroundColor: 'grey.50', 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <PollingControl
          isPolling={true} // Apollo Client автоматически управляет polling
          onStartPolling={handleStartPolling}
          onStopPolling={handleStopPolling}
          onRefresh={refetch}
          pollInterval={pollInterval}
          onIntervalChange={handleIntervalChange}
          showStatus={true}
        />
      </Box>

      {/* Информация о пагинации */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        color: '#666',
        fontSize: '14px'
      }}>
        Показано {paginationInfo.currentCount} из {paginationInfo.totalCount} комментариев 
        (страница {paginationInfo.currentPage} из {paginationInfo.totalPages})
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <PaginationComponent
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      )}

      {/* Комментарии текущей страницы */}
      {currentComments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          onReply={handleReplyClick}
          onAction={handleAction}
        />
      ))}
      
      <CommentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddComment}
        replyToComment={replyToComment ? {
          author: replyToComment.author,
          content: replyToComment.content,
        } : null}
        isSubmitting={createLoading || replyLoading}
      />

      {/* Показываем ошибки создания */}
      {(createError || replyError) && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#fee', 
          color: '#c00',
          borderRadius: '4px'
        }}>
          Ошибка: {createError?.message || replyError?.message}
        </div>
      )}
    </CommentsLayout>
  );
};

export type { HierarchicalCommentsPageProps };
