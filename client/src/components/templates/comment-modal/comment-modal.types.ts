import { ProcessedCommentFormData } from '@/components/organisms/comment-form';

export interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProcessedCommentFormData) => void;
  replyToComment?: { author: string; content: string } | null;
  isSubmitting?: boolean;
}
