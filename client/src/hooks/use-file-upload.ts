import { useState, useCallback } from 'react';
import { UploadedFile } from '@/components/molecules/file-upload';
import { prepareFilesForUpload } from '@/lib/file-utils';

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Добавление файлов
  const addFiles = useCallback((files: UploadedFile[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    setUploadError(null);
  }, []);

  // Удаление файла
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  // Очистка всех файлов
  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    setUploadError(null);
  }, []);

  // Подготовка файлов для отправки на сервер
  const prepareFiles = useCallback(async () => {
    if (uploadedFiles.length === 0) return [];

    setIsUploading(true);
    setUploadError(null);

    try {
      const preparedFiles = await prepareFilesForUpload(uploadedFiles);
      return preparedFiles;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка при подготовке файлов';
      setUploadError(errorMessage);
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles]);

  // Получение информации о файлах
  const getFilesInfo = useCallback(() => {
    return uploadedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
  }, [uploadedFiles]);

  // Проверка, есть ли файлы
  const hasFiles = uploadedFiles.length > 0;

  // Общий размер файлов
  const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);

  return {
    uploadedFiles,
    isUploading,
    uploadError,
    addFiles,
    removeFile,
    clearFiles,
    prepareFiles,
    getFilesInfo,
    hasFiles,
    totalSize,
  };
};
