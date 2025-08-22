'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Container,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Comment } from '@/graphql/types';

export default function HomePageComment() {
  const params = useParams();
  const homepage = params.homepage as string;

  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (homepage) {
      // Имитируем загрузку комментария
      setLoading(true);
      setTimeout(() => {
        // Здесь в реальном приложении был бы запрос к API
        setLoading(false);
        setError('Комментарий не найден');
      }, 1000);
    }
  }, [homepage]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка загрузки комментария: {error}
        </Alert>
        <Box textAlign="center">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Комментарий не найден
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Комментарий с URL &quot;{homepage}&quot; не существует.
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
            Комментарий с URL &quot;{homepage}&quot; не существует.
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
            label={`Уровень: ${comment.level}`}
            color="info"
            variant="outlined"
          />
          <Chip label="📝 Комментарий" color="primary" variant="outlined" />
        </Box>

        {/* Ответы */}
        {comment.replies && comment.replies.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Ответы ({comment.replies.length}):
            </Typography>
            {comment.replies.map((reply) => (
              <Paper
                key={reply.id}
                variant="outlined"
                sx={{ p: 2, mb: 2, ml: 3 }}
              >
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
                <Typography variant="body2">{reply.content}</Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip
                    label="💬 Ответ"
                    size="small"
                    color="info"
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
