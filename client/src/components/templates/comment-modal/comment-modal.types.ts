import { CommentFormData } from '@/components/organisms/comment-form';

export interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CommentFormData) => void;
  replyToComment?: { author: string; content: string } | null;
  isSubmitting?: boolean;
}
