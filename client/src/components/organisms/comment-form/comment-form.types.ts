export interface CommentFormData {
  author: string;
  email: string;
  homepage?: string;
  content: string;
  captcha: string;
}

export interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
  onCancel: () => void;
  replyToComment?: { author: string; content: string } | null;
  isSubmitting?: boolean;
}
