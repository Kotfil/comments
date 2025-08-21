import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Comment } from '@/data/mock-comments';
import { mockComments } from '@/data/mock-comments';
import { CommentItem } from '@/components/organisms/comment-item';
import { CommentModal } from '@/components/templates/comment-modal';
import { Button as CustomButton } from '@/components/atoms/button';
import { CommentsPageProps } from './comments-page.types';

export const CommentsPage: React.FC<CommentsPageProps> = ({ onAddComment }) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);

  const handleAddComment = (commentData: any) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: commentData.author,
      email: commentData.email,
      homepage: commentData.homepage,
      avatar: '👤',
      content: commentData.content,
      timestamp: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      likes: 0,
      dislikes: 0,
      level: replyToComment ? replyToComment.level + 1 : 0,
      replies: [],
    };

    if (replyToComment) {
      // Добавляем ответ к существующему комментарию
      const addReplyToComment = (commentList: Comment[]): Comment[] => {
        return commentList.map(comment => {
          if (comment.id === replyToComment.id) {
            return {
              ...comment,
              replies: [...comment.replies, newComment],
            };
          }
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(addReplyToComment(comments));
    } else {
      // Добавляем новый основной комментарий
      setComments([newComment, ...comments]);
    }

    // Если передан внешний обработчик, вызываем его
    if (onAddComment) {
      onAddComment(commentData);
    }

    setReplyToComment(null);
    setIsModalOpen(false);
  };

  const handleReplyClick = (comment: Comment) => {
    setReplyToComment(comment);
    setIsModalOpen(true);
  };

  const handleAddMainComment = () => {
    setReplyToComment(null);
    setIsModalOpen(true);
  };

  const handleAction = (action: string, comment: Comment) => {
    // Обработка действий с комментарием
    console.log(`Action: ${action} on comment:`, comment);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Иерархические комментарии
        </Typography>
        <CustomButton
          variant="primary"
          startIcon={<AddIcon />}
          onClick={handleAddMainComment}
        >
          Добавить комментарий
        </CustomButton>
      </Box>
      
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={handleReplyClick}
          onAction={handleAction}
        />
      ))}
      
      <CommentModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReplyToComment(null);
        }}
        onSubmit={handleAddComment}
        replyToComment={replyToComment ? {
          author: replyToComment.author,
          content: replyToComment.content,
        } : null}
      />
    </Box>
  );
};
