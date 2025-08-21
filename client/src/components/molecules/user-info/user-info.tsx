import React from 'react';
import { Avatar } from '@/components/atoms/avatar';
import { Typography } from '@/components/atoms/typography';
import { UserInfoProps } from './user-info.types';
import { UserInfoContainer, UserInfoContent } from './user-info.styles';

export const UserInfo: React.FC<UserInfoProps> = ({
  author,
  timestamp,
  avatar,
  size = 'medium',
}) => {
  return (
    <UserInfoContainer>
      <Avatar size={size}>{avatar}</Avatar>
      
      <UserInfoContent>
        <Typography variant="subtitle2" fontWeight={600}>
          {author}
        </Typography>
        <Typography variant="caption" color="secondary">
          {timestamp}
        </Typography>
      </UserInfoContent>
    </UserInfoContainer>
  );
};

export type { UserInfoProps };
