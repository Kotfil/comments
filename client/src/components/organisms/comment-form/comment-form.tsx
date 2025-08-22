import React, { useState, useCallback, useMemo } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { FormField } from '@/components/molecules/form-field';
import { HTMLToolbar } from '@/components/molecules/html-toolbar';
import { FileUpload } from '@/components/molecules/file-upload';
import { Button } from '@/components/atoms/button';
import {
  CommentFormProps,
  CommentFormData,
  ProcessedCommentFormData,
} from './comment-form.types';
import { useFileUpload } from '@/hooks/use-file-upload';

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
    files: [],
  });

  const [errors, setErrors] = useState<Partial<CommentFormData>>({});

  // Используем хук для управления файлами
  const {
    uploadedFiles,
    isUploading: isFileUploading,
    uploadError: fileError,
    addFiles,
    removeFile,
    clearFiles,
    prepareFiles,
    hasFiles,
  } = useFileUpload();

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

    if (
      formData.homepage &&
      !/^(https?:\/\/.+|^[a-zA-Z0-9\/\-_]+)$/.test(formData.homepage)
    ) {
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
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        try {
          // Подготавливаем файлы через хук
          const processedFiles = await prepareFiles();

          // Создаем финальные данные формы
          const finalFormData: ProcessedCommentFormData = {
            author: formData.author,
            email: formData.email,
            homepage: formData.homepage,
            content: formData.content,
            captcha: formData.captcha,
            files: processedFiles,
          };

          onSubmit(finalFormData);

          // Очищаем файлы после успешной отправки
          clearFiles();
        } catch (error) {
          console.error('Ошибка при обработке файлов:', error);
          // Продолжаем без файлов, если произошла ошибка
          const finalFormData: ProcessedCommentFormData = {
            author: formData.author,
            email: formData.email,
            homepage: formData.homepage,
            content: formData.content,
            captcha: formData.captcha,
            files: [],
          };
          onSubmit(finalFormData);
          clearFiles();
        }
      }
    },
    [validateForm, onSubmit, formData, prepareFiles, clearFiles]
  );

  // Мемоизируем обработчик изменения полей
  const handleInputChange = useCallback(
    (field: keyof CommentFormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  // Обработчик изменения файлов через хук
  const handleFilesChange = useCallback(
    (files: any[]) => {
      addFiles(files);
      setFormData((prev) => ({ ...prev, files }));
    },
    [addFiles]
  );

  // Мемоизируем обработчик вставки HTML тегов
  const insertHTMLTag = useCallback(
    (tag: string) => {
      const textField = document.querySelector(
        'textarea[name="content"]'
      ) as HTMLTextAreaElement;
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

      setFormData((prev) => ({ ...prev, content: newContent }));

      setTimeout(() => {
        if (textField) {
          textField.focus();
          textField.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    },
    [formData.content]
  );

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

      {/* Отображаем ошибки файлов */}
      {fileError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Ошибка при загрузке файлов: {fileError}
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
        infoText='Разрешенные HTML теги: &lt;i&gt;, &lt;strong&gt;, &lt;code&gt;, &lt;a href="" title=""&gt;'
      />

      <HTMLToolbar onInsertTag={insertHTMLTag} />

      {/* Загрузка файлов временно отключена - сервер не поддерживает */}
      {false && !replyToComment && (
        <FileUpload
          onFilesChange={handleFilesChange}
          maxFileSize={100 * 1024} // 100KB
          allowedTypes={['image/*', '.txt']}
          maxFiles={3}
          disabled={isSubmitting || isFileUploading}
        />
      )}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: 'block' }}
      >
        💡 Загрузка файлов временно отключена. Скоро будет доступна!
      </Typography>

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
          disabled={isSubmitting || isFileUploading}
        >
          {replyToComment ? 'Добавить ответ' : 'Добавить комментарий'}
        </Button>
      </Box>
    </Box>
  );
};

export type { CommentFormProps, CommentFormData };
