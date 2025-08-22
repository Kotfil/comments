import { UploadedFile } from '@/components/molecules/file-upload';

export interface CommentFormData {
  author: string;
  email: string;
  homepage?: string;
  content: string;
  captcha: string;
  files?: UploadedFile[]; // Делаем файлы необязательными
}

export interface ProcessedCommentFormData {
  author: string;
  email: string;
  homepage?: string;
  content: string;
  captcha: string;
  files?: Array<{
    name: string;
    type: string;
    size: number;
    data: string; // base64 данные
  }>;
}

export interface CommentFormProps {
  onSubmit: (data: ProcessedCommentFormData) => void;
  onCancel: () => void;
  replyToComment?: { author: string; content: string } | null;
  isSubmitting?: boolean;
}
