'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Paper, Container, Avatar, Chip } from '@mui/material';
import { Comment } from '@/data/mock-comments';
import { mockComments } from '@/data/mock-comments';

export default function HomePageComment() {
  const params = useParams();
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const homepage = params.homepage as string;
    
    // Ищем комментарий по homepage
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
  }, [params.homepage]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (!comment) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" color="error">
          Комментарий не найден
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Комментарий с URL "{params.homepage}" не существует.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        {/* Заголовок страницы */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Комментарий от {comment.author}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            URL: {comment.homepage}
          </Typography>
        </Box>

        {/* Информация о комментарии */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 56, height: 56, fontSize: '24px' }}>
            {comment.avatar}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {comment.author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {comment.timestamp}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {comment.email}
            </Typography>
          </Box>
        </Box>

        {/* Содержание комментария */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Текст комментария:
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, backgroundColor: '#fafafa' }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {comment.content}
            </Typography>
          </Paper>
        </Box>

        {/* Статистика */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip 
            label={`👍 ${comment.likes}`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={`👎 ${comment.dislikes}`} 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            label={`💬 ${comment.replies.length} ответов`} 
            color="info" 
            variant="outlined" 
          />
        </Box>

        {/* Ответы */}
        {comment.replies.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Ответы ({comment.replies.length}):
            </Typography>
            {comment.replies.map((reply, index) => (
              <Paper key={reply.id} variant="outlined" sx={{ p: 2, mb: 2, ml: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: '16px' }}>
                    {reply.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {reply.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {reply.timestamp}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">
                  {reply.content}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* Кнопка возврата */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => window.history.back()}
          >
            ← Вернуться к списку комментариев
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
