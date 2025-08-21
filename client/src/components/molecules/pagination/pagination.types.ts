export interface PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  variant?: 'text' | 'outlined';
  shape?: 'circular' | 'rounded';
  color?: 'primary' | 'secondary' | 'standard';
  size?: 'small' | 'medium' | 'large';
}
