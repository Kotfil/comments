export interface CommentHeaderProps {
  author: string;
  timestamp: string;
  avatar: string;
  onAction?: (action: string) => void;
}
