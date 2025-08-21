import React from 'react';
import { Pagination, Stack } from '@mui/material';
import { PaginationProps } from './pagination.types';

export const PaginationComponent: React.FC<PaginationProps> = ({
  count,
  page,
  onChange,
  variant = 'outlined',
  shape = 'rounded',
  color = 'primary',
  size = 'large',
}) => {
  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 4, mb: 2 }}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        variant={variant}
        shape={shape}
        color={color}
        size={size}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};
