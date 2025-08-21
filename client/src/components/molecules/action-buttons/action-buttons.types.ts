export interface ActionButtonsProps {
  likes: number;
  dislikes: number;
  onAction?: (action: string) => void;
  showVoteCounter?: boolean;
}
