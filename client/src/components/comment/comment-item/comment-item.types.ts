import { Comment } from '@/data/mock-comments';

export interface CommentItemProps {
  comment: Comment;
  level?: number;
  onReply?: (comment: Comment) => void;
  onAction?: (action: string, comment: Comment) => void;
}
