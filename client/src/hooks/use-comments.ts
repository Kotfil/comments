import { useState, useEffect } from 'react';
import { Comment } from '@/graphql/types';
import { mockComments } from '@/data/mock-comments';

// Временная замена Apollo Client на mock данные
export const useComments = (pollInterval: number = 30000) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Имитируем polling
  useEffect(() => {
    const interval = setInterval(() => {
      // Здесь можно добавить реальный запрос к API
      console.log('Polling for new comments...');
    }, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);

  const refetch = () => {
    setLoading(true);
    // Имитируем загрузку
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const startPolling = () => {
    console.log('Polling started');
  };

  const stopPolling = () => {
    console.log('Polling stopped');
  };

  return {
    comments,
    loading,
    error,
    refetch,
    startPolling,
    stopPolling,
  };
};

// Хук для получения комментария по HomePage
export const useCommentByHomepage = (homepage: string) => {
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (homepage) {
      setLoading(true);
      // Ищем комментарий в mock данных
      const findCommentByHomepage = (comments: Comment[]): Comment | null => {
        for (const comment of comments) {
          if (comment.homepage === homepage) {
            return comment;
          }
          if (comment.replies.length > 0) {
            const found = findCommentByHomepage(comment.replies);
            if (found) return found;
          }
        }
        return null;
      };

      const foundComment = findCommentByHomepage(mockComments);
      setComment(foundComment);
      setLoading(false);
    }
  }, [homepage]);

  const refetch = () => {
    // Перезагружаем данные
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    comment,
    loading,
    error,
    refetch,
  };
};

// Хук для создания комментария
export const useCreateComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Comment | null>(null);

  const handleCreateComment = async (input: any) => {
    try {
      setLoading(true);
      // Имитируем создание комментария
      const newComment: Comment = {
        id: Date.now().toString(),
        author: input.author,
        email: input.email,
        homepage: input.homepage,
        avatar: '👤',
        content: input.content,
        timestamp: new Date().toLocaleString('ru-RU'),
        likes: 0,
        dislikes: 0,
        level: 0,
        replies: [],
      };

      // Добавляем в mock данные
      mockComments.unshift(newComment);
      setData(newComment);
      setLoading(false);
      return newComment;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return {
    createComment: handleCreateComment,
    loading,
    error,
    data,
  };
};

// Хук для создания ответа на комментарий
export const useCreateReply = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Comment | null>(null);

  const handleCreateReply = async (input: any) => {
    try {
      setLoading(true);
      // Имитируем создание ответа
      const newReply: Comment = {
        id: Date.now().toString(),
        author: input.author,
        email: input.email,
        homepage: input.homepage,
        avatar: '👤',
        content: input.content,
        timestamp: new Date().toLocaleString('ru-RU'),
        likes: 0,
        dislikes: 0,
        level: 1,
        replies: [],
      };

      // Находим родительский комментарий и добавляем ответ
      const addReplyToComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === input.parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
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

      // Обновляем mock данные
      Object.assign(mockComments, addReplyToComment(mockComments));
      setData(newReply);
      setLoading(false);
      return newReply;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return {
    createReply: handleCreateReply,
    loading,
    error,
    data,
  };
};
