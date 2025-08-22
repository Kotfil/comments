import React from 'react';
import { Modal, Box } from '@mui/material';
import {
  CommentForm,
  CommentFormData,
} from '@/components/organisms/comment-form';
import { CommentModalProps } from './comment-modal.types';

export const CommentModal: React.FC<CommentModalProps> = ({
  open,
  onClose,
  onSubmit,
  replyToComment,
  isSubmitting = false,
}) => {
  const handleSubmit = (data: CommentFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="comment-modal-title"
      aria-describedby="comment-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <CommentForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          replyToComment={replyToComment}
          isSubmitting={isSubmitting}
        />
      </Box>
    </Modal>
  );
};

export type { CommentModalProps };
