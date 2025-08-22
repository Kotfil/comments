import React from 'react';
import { Box } from '@mui/material';
import { FormatItalic, FormatBold, Code, Link } from '@mui/icons-material';
import { IconButton } from '@/components/atoms/icon-button';
import { HTMLToolbarProps } from './html-toolbar.types';

export const HTMLToolbar: React.FC<HTMLToolbarProps> = ({ onInsertTag }) => {
  const toolbarItems = [
    { tag: 'i', icon: <FormatItalic />, tooltip: 'Курсив' },
    { tag: 'strong', icon: <FormatBold />, tooltip: 'Жирный' },
    { tag: 'code', icon: <Code />, tooltip: 'Код' },
    { tag: 'a', icon: <Link />, tooltip: 'Ссылка' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        mb: 2,
        p: 1,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        backgroundColor: '#fafafa',
      }}
    >
      {toolbarItems.map((item) => (
        <IconButton
          key={item.tag}
          icon={item.icon}
          tooltip={item.tooltip}
          onClick={() => onInsertTag(item.tag)}
          sx={{
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
          }}
        />
      ))}
    </Box>
  );
};
