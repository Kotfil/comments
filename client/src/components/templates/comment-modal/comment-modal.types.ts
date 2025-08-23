import { ProcessedCommentFormData } from '@/components/comment/comment-form';

export interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  replyToComment?: { author: string; content: string } | null;
  isSubmitting?: boolean;
}
