import React, { useCallback, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import { CloudUpload, Delete, Description, Image } from '@mui/icons-material';
import { FileUploadProps, UploadedFile } from './file-upload.types';

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFileSize = 100 * 1024, // 100KB по умолчанию
  allowedTypes = ['image/*', '.txt'],
  maxFiles = 3,
  disabled = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Валидация файла
  const validateFile = useCallback(
    (file: File): string | null => {
      // Проверка размера
      if (file.size > maxFileSize) {
        return `Файл слишком большой. Максимум: ${Math.round(maxFileSize / 1024)}KB`;
      }

      // Проверка типа
      const isValidType = allowedTypes.some((type) => {
        if (type === 'image/*') {
          return file.type.startsWith('image/');
        }
        if (type === '.txt') {
          return (
            file.type === 'text/plain' ||
            file.name.toLowerCase().endsWith('.txt')
          );
        }
        return file.type === type;
      });

      if (!isValidType) {
        return 'Неподдерживаемый тип файла. Разрешены: картинки и TXT файлы';
      }

      return null;
    },
    [maxFileSize, allowedTypes]
  );

  // Обработка выбора файлов
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const newErrors: string[] = [];
      const validFiles: UploadedFile[] = [];

      // Проверяем лимит файлов
      if (uploadedFiles.length + files.length > maxFiles) {
        newErrors.push(`Максимум ${maxFiles} файлов`);
      }

      files.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push({
            id: `${Date.now()}-${Math.random()}`,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        }
      });

      setErrors(newErrors);

      if (validFiles.length > 0) {
        const newUploadedFiles = [...uploadedFiles, ...validFiles];
        setUploadedFiles(newUploadedFiles);
        onFilesChange(newUploadedFiles);
      }

      // Очищаем input для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadedFiles, maxFiles, validateFile, onFilesChange]
  );

  // Удаление файла
  const handleRemoveFile = useCallback(
    (fileId: string) => {
      const newFiles = uploadedFiles.filter((f) => f.id !== fileId);
      setUploadedFiles(newFiles);
      onFilesChange(newFiles);
    },
    [uploadedFiles, onFilesChange]
  );

  // Очистка ошибок
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Получение иконки для типа файла
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image fontSize="small" />;
    }
    return <Description fontSize="small" />;
  };

  // Форматирование размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Прикрепить файлы
      </Typography>

      <Typography variant="caption" color="text.secondary" gutterBottom>
        Разрешены: картинки и TXT файлы (максимум{' '}
        {Math.round(maxFileSize / 1024)}KB каждый)
      </Typography>

      {/* Кнопка загрузки */}
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUpload />}
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || uploadedFiles.length >= maxFiles}
        sx={{ mb: 2 }}
      >
        Выбрать файлы
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Button>

      {/* Ошибки */}
      {errors.length > 0 && (
        <Alert severity="error" onClose={clearErrors} sx={{ mb: 2 }}>
          {errors.map((error, index) => (
            <Typography key={index} variant="body2">
              {error}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Загруженные файлы */}
      {uploadedFiles.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Выбранные файлы ({uploadedFiles.length}/{maxFiles}):
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {uploadedFiles.map((file) => (
              <Chip
                key={file.id}
                icon={getFileIcon(file.type)}
                label={`${file.name} (${formatFileSize(file.size)})`}
                onDelete={() => handleRemoveFile(file.id)}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
