export interface CommentsLayoutProps {
  title: string;
  children: React.ReactNode;
  onAddComment?: () => void;
  addButtonText?: string;
  showAddButton?: boolean;
}
