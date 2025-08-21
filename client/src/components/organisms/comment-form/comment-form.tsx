import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { FormField } from '@/components/molecules/form-field';
import { HTMLToolbar } from '@/components/molecules/html-toolbar';
import { Button } from '@/components/atoms/button';
import { CommentFormProps, CommentFormData } from './comment-form.types';

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  replyToComment,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<CommentFormData>({
    author: '',
    email: '',
    homepage: '',
    content: '',
    captcha: '',
  });

  const [errors, setErrors] = useState<Partial<CommentFormData>>({});

  const CAPTCHA_CHALLENGE = 'ABC123';

  // Мемоизируем валидацию формы
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<CommentFormData> = {};

    if (!formData.author.trim()) {
      newErrors.author = 'User Name обязателен';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.author)) {
      newErrors.author = 'Только латинские буквы и цифры';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (formData.homepage && !/^(https?:\/\/.+|^[a-zA-Z0-9\/\-_]+)$/.test(formData.homepage)) {
      newErrors.homepage = 'Неверный формат URL';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Текст комментария обязателен';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Минимум 10 символов';
    }

    if (!formData.captcha.trim()) {
      newErrors.captcha = 'CAPTCHA обязательна';
    } else if (formData.captcha !== CAPTCHA_CHALLENGE) {
      newErrors.captcha = 'Неверный код CAPTCHA';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Мемоизируем обработчик отправки формы
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [validateForm, onSubmit, formData]);

  // Мемоизируем обработчик изменения полей
  const handleInputChange = useCallback((field: keyof CommentFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Мемоизируем обработчик вставки HTML тегов
  const insertHTMLTag = useCallback((tag: string) => {
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

    setFormData(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      if (textField) {
        textField.focus();
        textField.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [formData.content]);

  // Мемоизируем заголовок формы
  const formTitle = useMemo(() => {
    if (replyToComment) {
      return `Ответить на комментарий от ${replyToComment.author}`;
    }
    return 'Добавить комментарий';
  }, [replyToComment]);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h2" gutterBottom>
        {formTitle}
      </Typography>

      {replyToComment && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Ответ на:</strong> {replyToComment.content}
          </Typography>
        </Alert>
      )}

      <FormField
        label="User Name"
        name="author"
        value={formData.author}
        onChange={handleInputChange('author')}
        error={errors.author}
        helperText="Только латинские буквы и цифры"
        required
      />

      <FormField
        label="E-mail"
        name="email"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={errors.email}
        helperText="Введите корректный email"
        type="email"
        required
      />

      {/* Показываем поле HomePage только для основных комментариев */}
      {!replyToComment && (
        <FormField
          label="Home page"
          name="homepage"
          value={formData.homepage || ''}
          onChange={handleInputChange('homepage')}
          error={errors.homepage}
          helperText="Необязательное поле (формат URL)"
          placeholder="https://example.com"
        />
      )}

      <FormField
        label="Текст комментария"
        name="content"
        value={formData.content}
        onChange={handleInputChange('content')}
        error={errors.content}
        helperText="Минимум 10 символов. Используйте кнопки выше для форматирования"
        multiline
        rows={4}
        required
        infoText="Разрешенные HTML теги: &lt;i&gt;, &lt;strong&gt;, &lt;code&gt;, &lt;a href=&quot;&quot; title=&quot;&quot;&gt;"
      />

      <HTMLToolbar onInsertTag={insertHTMLTag} />

      <FormField
        label="CAPTCHA"
        name="captcha"
        value={formData.captcha}
        onChange={handleInputChange('captcha')}
        error={errors.captcha}
        helperText={`Введите код CAPTCHA: ${CAPTCHA_CHALLENGE}`}
        required
      />

      <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          disabled={isSubmitting}
        >
          {replyToComment ? 'Добавить ответ' : 'Добавить комментарий'}
        </Button>
      </Box>
    </Box>
  );
};

export type { CommentFormProps, CommentFormData };
