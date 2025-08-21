import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  FormatItalic,
  FormatBold,
  Code,
  Link,
} from '@mui/icons-material';
import { Comment } from '@/data/mock-comments';
import { AddCommentModalContainer, ModalContent, FormSection, HTMLToolbar, HTMLButton } from './AddCommentModal.styles';

interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (commentData: CommentFormData) => void;
  replyToComment?: Comment | null;
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
  replyToComment,
}) => {
  const [formData, setFormData] = useState<CommentFormData>({
    author: '',
    email: '',
    homepage: '',
    content: '',
    captcha: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Функция для вставки HTML тегов
  const insertHTMLTag = (tag: string) => {
    const textField = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textField) return;

    const start = textField.selectionStart;
    const end = textField.selectionEnd;
    const selectedText = formData.content.substring(start, end);

    let newText = '';
    let newCursorPos = start;

    switch (tag) {
      case 'i':
        newText = `<i>${selectedText || 'курсивный текст'}</i>`;
        newCursorPos = start + 3 + (selectedText ? selectedText.length : 15);
        break;
      case 'strong':
        newText = `<strong>${selectedText || 'жирный текст'}</strong>`;
        newCursorPos = start + 8 + (selectedText ? selectedText.length : 15);
        break;
      case 'code':
        newText = `<code>${selectedText || 'код'}</code>`;
        newCursorPos = start + 6 + (selectedText ? selectedText.length : 3);
        break;
      case 'a':
        newText = `<a href="https://example.com" title="ссылка">${selectedText || 'ссылка'}</a>`;
        newCursorPos = start + 9 + (selectedText ? selectedText.length : 5);
        break;
    }

    const newContent = 
      formData.content.substring(0, start) + 
      newText + 
      formData.content.substring(end);

    setFormData(prev => ({
      ...prev,
      content: newContent,
    }));

    // Устанавливаем курсор в нужную позицию после обновления состояния
    setTimeout(() => {
      if (textField) {
        textField.focus();
        textField.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Функция для валидации HTML тегов
  const validateHTMLTags = (content: string): boolean => {
    // Разрешенные теги
    const allowedTags = ['i', 'strong', 'code', 'a'];
    
    // Регулярное выражение для поиска HTML тегов
    const tagRegex = /<\/?([a-zA-Z]+)([^>]*)>/g;
    let match;
    
    while ((match = tagRegex.exec(content)) !== null) {
      const isClosing = match[0].startsWith('</');
      const tagName = match[1].toLowerCase();
      const attributes = match[2];
      
      // Проверяем, разрешен ли тег
      if (!allowedTags.includes(tagName)) {
        return false;
      }
      
      // Для открывающего тега <a> проверяем атрибуты
      if (tagName === 'a' && !isClosing) {
        const hrefMatch = attributes.match(/href\s*=\s*["']([^"']*)["']/);
        
        // Проверяем, что href присутствует и является валидным URL
        if (!hrefMatch || !/^https?:\/\/.+/.test(hrefMatch[1])) {
          return false;
        }
        
        // title атрибут необязательный, поэтому не проверяем его наличие
      }
    }
    
    return true;
  };

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
    } else if (!validateHTMLTags(formData.content)) {
      newErrors.content = 'Использованы неразрешенные HTML теги. Разрешены только: <i>, <strong>, <code>, <a href="" title="">';
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

  const getModalTitle = () => {
    if (replyToComment) {
      return `Ответить на комментарий от ${replyToComment.author}`;
    }
    return 'Добавить комментарий';
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
            {getModalTitle()}
          </Typography>

          {replyToComment && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Ответ на:</strong> {replyToComment.content}
              </Typography>
            </Alert>
          )}

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
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Разрешенные HTML теги:</strong> <code>&lt;i&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;code&gt;</code>, <code>&lt;a href="" title=""&gt;</code>
                </Typography>
              </Alert>
              
              <HTMLToolbar>
                <Tooltip title="Курсив">
                  <HTMLButton onClick={() => insertHTMLTag('i')}>
                    <FormatItalic />
                  </HTMLButton>
                </Tooltip>
                <Tooltip title="Жирный">
                  <HTMLButton onClick={() => insertHTMLTag('strong')}>
                    <FormatBold />
                  </HTMLButton>
                </Tooltip>
                <Tooltip title="Код">
                  <HTMLButton onClick={() => insertHTMLTag('code')}>
                    <Code />
                  </HTMLButton>
                </Tooltip>
                <Tooltip title="Ссылка">
                  <HTMLButton onClick={() => insertHTMLTag('a')}>
                    <Link />
                  </HTMLButton>
                </Tooltip>
              </HTMLToolbar>

              <TextField
                fullWidth
                name="content"
                label="Текст комментария *"
                value={formData.content}
                onChange={handleInputChange('content')}
                error={!!errors.content}
                helperText={errors.content || 'Минимум 10 символов. Используйте кнопки выше для форматирования'}
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
                {replyToComment ? 'Добавить ответ' : 'Добавить комментарий'}
              </Button>
            </Box>
          </form>
        </ModalContent>
      </AddCommentModalContainer>
    </Modal>
  );
};
