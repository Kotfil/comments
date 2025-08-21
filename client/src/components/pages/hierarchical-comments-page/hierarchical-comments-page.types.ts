import { CommentFormData } from '@/components/organisms/comment-form';

export interface HierarchicalCommentsPageProps {
  onAddComment?: (commentData: CommentFormData) => void;
}
