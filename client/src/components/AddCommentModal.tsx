import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';
import { AddCommentModalContainer, ModalContent, FormSection } from './AddCommentModal.styles';

interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (commentData: CommentFormData) => void;
}

interface CommentFormData {
  author: string;
  email: string;
  homepage?: string;
  content: string;
  captcha: string;
}

interface FormErrors {
  author?: string;
  email?: string;
  homepage?: string;
  content?: string;
  captcha?: string;
}

const CAPTCHA_CHALLENGE = 'ABC123';

export const AddCommentModal: React.FC<AddCommentModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CommentFormData>({
    author: '',
    email: '',
    homepage: '',
    content: '',
    captcha: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // User Name validation (цифры и буквы латинского алфавита)
    if (!formData.author.trim()) {
      newErrors.author = 'User Name обязателен';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.author)) {
      newErrors.author = 'Только латинские буквы и цифры';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    // Homepage validation (необязательное, но если указан - должен быть URL)
    if (formData.homepage && !/^https?:\/\/.+/.test(formData.homepage)) {
      newErrors.homepage = 'Неверный формат URL';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Текст комментария обязателен';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Минимум 10 символов';
    }

    // CAPTCHA validation
    if (!formData.captcha.trim()) {
      newErrors.captcha = 'CAPTCHA обязательна';
    } else if (formData.captcha !== CAPTCHA_CHALLENGE) {
      newErrors.captcha = 'Неверный код CAPTCHA';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      author: '',
      email: '',
      homepage: '',
      content: '',
      captcha: '',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof CommentFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-comment-modal-title"
      aria-describedby="add-comment-modal-description"
    >
      <AddCommentModalContainer>
        <ModalContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Добавить комментарий
          </Typography>

          <form onSubmit={handleSubmit}>
            <FormSection>
              <TextField
                fullWidth
                label="User Name *"
                value={formData.author}
                onChange={handleInputChange('author')}
                error={!!errors.author}
                helperText={errors.author || 'Только латинские буквы и цифры'}
                variant="outlined"
                size="small"
              />
            </FormSection>

            <FormSection>
              <TextField
                fullWidth
                label="E-mail *"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email || 'Введите корректный email'}
                variant="outlined"
                size="small"
              />
            </FormSection>

            <FormSection>
              <TextField
                fullWidth
                label="Home page"
                value={formData.homepage}
                onChange={handleInputChange('homepage')}
                error={!!errors.homepage}
                helperText={errors.homepage || 'Необязательное поле (формат URL)'}
                variant="outlined"
                size="small"
                placeholder="https://example.com"
              />
            </FormSection>

            <FormSection>
              <TextField
                fullWidth
                label="Текст комментария *"
                value={formData.content}
                onChange={handleInputChange('content')}
                error={!!errors.content}
                helperText={errors.content || 'Минимум 10 символов'}
                variant="outlined"
                size="small"
                multiline
                rows={4}
              />
            </FormSection>

            <FormSection>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>CAPTCHA:</strong> Введите код: <code>{CAPTCHA_CHALLENGE}</code>
                </Typography>
              </Alert>
              <TextField
                fullWidth
                label="CAPTCHA *"
                value={formData.captcha}
                onChange={handleInputChange('captcha')}
                error={!!errors.captcha}
                helperText={errors.captcha || 'Введите код CAPTCHA'}
                variant="outlined"
                size="small"
              />
            </FormSection>

            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button variant="outlined" onClick={handleClose}>
                Отмена
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Добавить комментарий
              </Button>
            </Box>
          </form>
        </ModalContent>
      </AddCommentModalContainer>
    </Modal>
  );
};
