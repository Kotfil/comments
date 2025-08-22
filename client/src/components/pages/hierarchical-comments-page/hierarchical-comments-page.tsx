import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Comment, CreateCommentDto, CreateReplyDto } from '@/graphql/types';
import { GET_COMMENTS, CREATE_COMMENT, CREATE_REPLY } from '@/graphql/schema';
import { CommentsLayout } from '@/components/templates/comments-layout';
import { CommentCard } from '@/components/organisms/comment-card';
import { CommentModal } from '@/components/templates/comment-modal';
import { ProcessedCommentFormData } from '@/components/organisms/comment-form';

import { HierarchicalCommentsPageProps } from './hierarchical-comments-page.types';
import { Box, CircularProgress, Alert } from '@mui/material';

export const HierarchicalCommentsPage: React.FC<
  HierarchicalCommentsPageProps
> = ({ onAddComment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 25;

  // GraphQL хуки
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
    errorPolicy: 'all',
  });

  const [createComment, { loading: createLoading, error: createError }] =
    useMutation(CREATE_COMMENT, {
      refetchQueries: [{ query: GET_COMMENTS }],
      errorPolicy: 'all',
    });

  const [createReply, { loading: replyLoading, error: replyError }] =
    useMutation(CREATE_REPLY, {
      refetchQueries: [{ query: GET_COMMENTS }],
      errorPolicy: 'all',
    });

  const comments = (data as any)?.comments || [];

  // Отложенное значение для оптимизации рендеринга больших списков
  const deferredComments = useMemo(() => comments, [comments]);

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
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
      // Прокручиваем страницу вверх при смене страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  // Мемоизируем обработчик добавления комментария
  const handleAddComment = useCallback(
    async (commentData: ProcessedCommentFormData) => {
      try {
        if (replyToComment) {
          // Создаем ответ на комментарий
          const replyInput: CreateReplyDto = {
            parentId: replyToComment.id,
            author: commentData.author,
            email: commentData.email,
            homepage: commentData.homepage,
            content: commentData.content,
          };

          await createReply({
            variables: { input: replyInput },
            update: (cache, { data }: any) => {
              if (data?.createReply) {
                // Обновляем кэш для родительского комментария
                const existingComments = cache.readQuery({
                  query: GET_COMMENTS,
                }) as any;
                if (existingComments) {
                  cache.writeQuery({
                    query: GET_COMMENTS,
                    data: {
                      comments: existingComments.comments.map(
                        (comment: any) => {
                          if (comment.id === replyToComment.id) {
                            return {
                              ...comment,
                              replies: [
                                ...(comment.replies || []),
                                data.createReply,
                              ],
                            };
                          }
                          return comment;
                        }
                      ),
                    },
                  });
                }
              }
            },
          });
        } else {
          // Создаем новый основной комментарий
          const commentInput: CreateCommentDto = {
            author: commentData.author,
            email: commentData.email,
            homepage: commentData.homepage,
            content: commentData.content,
          };

          await createComment({
            variables: { input: commentInput },
            update: (cache, { data }: any) => {
              if (data?.createComment) {
                // Добавляем новый комментарий в начало списка
                const existingComments = cache.readQuery({
                  query: GET_COMMENTS,
                }) as any;
                if (existingComments) {
                  cache.writeQuery({
                    query: GET_COMMENTS,
                    data: {
                      comments: [
                        data.createComment,
                        ...existingComments.comments,
                      ],
                    },
                  });
                }
              }
            },
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
      }
    },
    [replyToComment, createComment, createReply, onAddComment]
  );

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

  // Мемоизируем обработчик закрытия модального окна
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setReplyToComment(null);
  }, []);

  // Мемоизируем обработчик действий с комментарием
  const handleAction = useCallback((action: string, comment: Comment) => {
    console.log(`Action: ${action} on comment:`, comment);
  }, []);

  // Информация о пагинации
  const paginationInfo = useMemo(
    () => ({
      currentCount: currentComments.length,
      totalCount: comments.length,
      currentPage: currentPage,
      totalPages: totalPages,
    }),
    [currentComments.length, comments.length, currentPage, totalPages]
  );

  // Показываем загрузку
  if (loading && comments.length === 0) {
    return (
      <CommentsLayout title="Иерархические комментарии">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </CommentsLayout>
    );
  }

  // Показываем ошибку
  if (error && comments.length === 0) {
    return (
      <CommentsLayout title="Иерархические комментарии">
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка загрузки комментариев: {error.message}
        </Alert>
        <Box textAlign="center">
          <button onClick={() => refetch()} style={{ padding: '8px 16px' }}>
            Попробовать снова
          </button>
        </Box>
      </CommentsLayout>
    );
  }

  return (
    <CommentsLayout
      title="Иерархические комментарии"
      onAddComment={handleAddMainComment}
    >
      {/* Управление polling */}

      {/* Информация о пагинации */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#666',
          fontSize: '14px',
        }}
      >
        Показано {paginationInfo.currentCount} из {paginationInfo.totalCount}{' '}
        комментариев (страница {paginationInfo.currentPage} из{' '}
        {paginationInfo.totalPages})
      </div>

      {/* Простая пагинация */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" gap={1} mb={3}>
          <button
            onClick={() =>
              handlePageChange({} as any, Math.max(1, currentPage - 1))
            }
            disabled={currentPage === 1}
            style={{ padding: '8px 16px', margin: '0 4px' }}
          >
            ←
          </button>
          <span style={{ padding: '8px 16px' }}>
            {currentPage} из {totalPages}
          </span>
          <button
            onClick={() =>
              handlePageChange({} as any, Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            style={{ padding: '8px 16px', margin: '0 4px' }}
          >
            →
          </button>
        </Box>
      )}

      {/* Комментарии текущей страницы */}
      {currentComments.map((comment: Comment) => (
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
        replyToComment={
          replyToComment
            ? {
                author: replyToComment.author,
                content: replyToComment.content,
              }
            : null
        }
        isSubmitting={createLoading || replyLoading}
      />

      {/* Показываем ошибки создания */}
      {(createError || replyError) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Ошибка создания комментария:{' '}
          {createError?.message || replyError?.message}
        </Alert>
      )}
    </CommentsLayout>
  );
};

export type { HierarchicalCommentsPageProps };
