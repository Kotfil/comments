import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Comment } from '@/data/mock-comments';
import { CommentsTableContainer, TableTitle } from './CommentsTable.styles';

type Order = 'asc' | 'desc';
type OrderBy = 'author' | 'email' | 'timestamp';

interface CommentsTableProps {
  comments: Comment[];
}

interface HeadCell {
  id: OrderBy;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: 'author',
    label: 'User Name',
    numeric: false,
  },
  {
    id: 'email',
    label: 'E-mail',
    numeric: false,
  },
  {
    id: 'timestamp',
    label: 'Дата добавления',
    numeric: false,
  },
  {
    id: 'content' as any,
    label: 'Комментарий',
    numeric: false,
  },
  {
    id: 'actions' as any,
    label: 'Действия',
    numeric: false,
  },
];

export const CommentsTable: React.FC<CommentsTableProps> = ({ comments }) => {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderBy>('timestamp');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (orderBy) {
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        default:
          return 0;
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [comments, order, orderBy]);

  const formatTimestamp = (timestamp: string) => {
    // Преобразуем формат "22.05.22 в 22:30" в читаемую дату
    const date = new Date();
    const [day, month, year] = timestamp.split(' ')[0].split('.');
    const [hour, minute] = timestamp.split(' ')[2].split(':');
    
    date.setDate(parseInt(day));
    date.setMonth(parseInt(month) - 1);
    date.setFullYear(2000 + parseInt(year));
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <CommentsTableContainer>
      <TableTitle variant="h6">Основные комментарии</TableTitle>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="comments table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.id === 'author' || headCell.id === 'email' || headCell.id === 'timestamp' ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedComments.map((comment) => (
              <TableRow key={comment.id} hover>
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      component="span"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                      }}
                    >
                      {comment.avatar}
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      {comment.author}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {comment.email}
                  </Typography>
                  {comment.homepage && (
                    <Chip
                      label="Homepage"
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                      onClick={() => window.open(comment.homepage, '_blank')}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatTimestamp(comment.timestamp)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {comment.content}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      ↑{comment.likes} ↓{comment.dislikes}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CommentsTableContainer>
  );
};
