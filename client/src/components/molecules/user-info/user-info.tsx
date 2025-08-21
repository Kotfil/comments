import React from 'react';
import { Box } from '@mui/material';
import { Avatar } from '@/components/atoms/avatar';
import { Typography } from '@/components/atoms/typography';

export interface UserInfoProps {
  author: string;
  timestamp: string;
  avatar: string;
  size?: 'small' | 'medium' | 'large';
}

export const UserInfo: React.FC<UserInfoProps> = ({
  author,
  timestamp,
  avatar,
  size = 'medium',
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar size={size}>{avatar}</Avatar>
      
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {author}
        </Typography>
        <Typography variant="caption" color="secondary">
          {timestamp}
        </Typography>
      </Box>
    </Box>
  );
};
