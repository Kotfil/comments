'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Paper, Container, Avatar, Chip, CircularProgress, Alert } from '@mui/material';
import { useCommentByHomepage } from '@/hooks/use-comments';

export default function HomePageComment() {
  const params = useParams();
  const homepage = params.homepage as string;
  
  const { comment, loading, error, refetch } = useCommentByHomepage(homepage);

  useEffect(() => {
    if (homepage) {
      refetch();
    }
  }, [homepage, refetch]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка загрузки комментария: {error.message}
        </Alert>
        <Box textAlign="center">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Комментарий не найден
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Комментарий с URL "{homepage}" не существует.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!comment) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Комментарий не найден
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Комментарий с URL "{homepage}" не существует.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Заголовок */}
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {comment.avatar}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              Комментарий от {comment.author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {comment.timestamp}
            </Typography>
          </Box>
        </Box>

        {/* URL комментария */}
        <Box mb={3}>
          <Chip 
            label={`🌐 ${comment.homepage}`} 
            variant="outlined" 
            color="primary"
            sx={{ fontSize: '1rem' }}
          />
        </Box>

        {/* Содержимое комментария */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Содержание:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body1" component="div">
              {comment.content}
            </Typography>
          </Paper>
        </Box>

        {/* Статистика */}
        <Box display="flex" gap={2} mb={3}>
          <Chip 
            label={`👍 ${comment.likes}`} 
            color="success" 
            variant="outlined"
          />
          <Chip 
            label={`👎 ${comment.dislikes}`} 
            color="error" 
            variant="outlined"
          />
          <Chip 
            label={`Уровень: ${comment.level}`} 
            color="info" 
            variant="outlined"
          />
        </Box>

        {/* Ответы */}
        {comment.replies && comment.replies.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Ответы ({comment.replies.length}):
            </Typography>
            {comment.replies.map((reply) => (
              <Paper key={reply.id} variant="outlined" sx={{ p: 2, mb: 2, ml: 3 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                    {reply.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
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
                <Box display="flex" gap={1} mt={1}>
                  <Chip 
                    label={`👍 ${reply.likes}`} 
                    size="small"
                    color="success" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`👎 ${reply.dislikes}`} 
                    size="small"
                    color="error" 
                    variant="outlined"
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {/* Кнопка возврата */}
        <Box textAlign="center" mt={4}>
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

