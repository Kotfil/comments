import { ProcessedCommentFormData } from '@/components/organisms/comment-form';

export interface HierarchicalCommentsPageProps {
  onAddComment?: (commentData: ProcessedCommentFormData) => void;
}
