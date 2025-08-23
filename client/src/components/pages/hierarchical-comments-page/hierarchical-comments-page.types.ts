import { ProcessedCommentFormData } from '@/components/comment/comment-form';

export interface HierarchicalCommentsPageProps {
  onAddComment?: (commentData: ProcessedCommentFormData) => void;
}
