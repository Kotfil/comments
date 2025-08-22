export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFileSize?: number; // в байтах
  allowedTypes?: string[]; // MIME типы или расширения
  maxFiles?: number;
  disabled?: boolean;
}
