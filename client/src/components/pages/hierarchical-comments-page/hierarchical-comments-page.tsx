import React, { useState, useMemo, useCallback, useDeferredValue } from 'react';
import { Comment } from '@/data/mock-comments';
import { mockComments } from '@/data/mock-comments';
import { CommentsLayout } from '@/components/templates/comments-layout';
import { CommentCard } from '@/components/organisms/comment-card';
import { CommentModal } from '@/components/templates/comment-modal';
import { CommentFormData } from '@/components/organisms/comment-form';
import { PaginationComponent } from '@/components/molecules/pagination';
import { HierarchicalCommentsPageProps } from './hierarchical-comments-page.types';

export const HierarchicalCommentsPage: React.FC<HierarchicalCommentsPageProps> = ({ 
  onAddComment 
}) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 25;

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
  const handleAddComment = useCallback((commentData: CommentFormData) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: commentData.author,
      email: commentData.email,
      homepage: commentData.homepage,
      avatar: '👤',
      content: commentData.content,
      timestamp: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      likes: 0,
      dislikes: 0,
      level: replyToComment ? replyToComment.level + 1 : 0,
      replies: [],
    };

    if (replyToComment) {
      // Добавляем ответ к существующему комментарию
      const addReplyToComment = (commentList: Comment[]): Comment[] => {
        return commentList.map(comment => {
          if (comment.id === replyToComment.id) {
            return {
              ...comment,
              replies: [...comment.replies, newComment],
            };
          }
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(addReplyToComment(comments));
    } else {
      // Добавляем новый основной комментарий
      setComments([newComment, ...comments]);
      // Сбрасываем на первую страницу при добавлении нового комментария
      setCurrentPage(1);
    }

    // Если передан внешний обработчик, вызываем его
    if (onAddComment) {
      onAddComment(commentData);
    }

    setReplyToComment(null);
    setIsModalOpen(false);
  }, [replyToComment, comments, onAddComment]);

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

  // Мемоизируем информацию о пагинации
  const paginationInfo = useMemo(() => ({
    currentCount: currentComments.length,
    totalCount: deferredComments.length,
    currentPage,
    totalPages
  }), [currentComments.length, deferredComments.length, currentPage, totalPages]);

  return (
    <CommentsLayout
      title="Иерархические комментарии"
      onAddComment={handleAddMainComment}
    >
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
      />
    </CommentsLayout>
  );
};

export type { HierarchicalCommentsPageProps };
