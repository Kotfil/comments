export interface CommentHeaderProps {
  author: string;
  timestamp: string;
  avatar: string;
  likes: number;
  dislikes: number;
  onAction?: (action: string) => void;
}
