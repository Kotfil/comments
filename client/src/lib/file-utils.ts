import { UploadedFile } from '@/components/molecules/file-upload';

/**
 * Конвертирует файл в base64 строку
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Конвертирует UploadedFile в объект для отправки на сервер
 */
export const prepareFileForUpload = async (uploadedFile: UploadedFile) => {
  const base64 = await convertFileToBase64(uploadedFile.file);
  return {
    name: uploadedFile.name,
    type: uploadedFile.type,
    size: uploadedFile.size,
    data: base64,
  };
};

/**
 * Конвертирует массив UploadedFile в массив для отправки на сервер
 */
export const prepareFilesForUpload = async (files: UploadedFile[]) => {
  return Promise.all(files.map(prepareFileForUpload));
};

/**
 * Проверяет, является ли файл изображением
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Проверяет, является ли файл текстовым
 */
export const isTextFile = (file: File): boolean => {
  return file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');
};

/**
 * Форматирует размер файла в читаемый вид
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
