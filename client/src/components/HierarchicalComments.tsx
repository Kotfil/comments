import React, { useState } from 'react';
import { Comment } from '@/data/mock-comments';
import { mockComments } from '@/data/mock-comments';
import { AddCommentModal } from './AddCommentModal';
import {
  HierarchicalContainer,
  CommentBlock,
  CommentHeader,
  Avatar,
  UserInfo,
  Username,
  Timestamp,
  ActionIcons,
  IconButton,
  VoteCounter,
  CommentContent,
  CommentText,
  ReplyButton,
  VerticalLine,
  CommentWrapper,
  HierarchicalTitle,
} from './HierarchicalComments.styles';

export const HierarchicalComments: React.FC = () => {
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

    setReplyToComment(null);
    setIsModalOpen(false);
  };

  const handleReplyClick = (comment: Comment) => {
    setReplyToComment(comment);
    setIsModalOpen(true);
  };

  const renderComment = (comment: Comment, level: number = 0, showVerticalLine: boolean = false) => {
    const hasReplies = comment.replies.length > 0;

    return (
      <CommentWrapper key={comment.id}>
        {showVerticalLine && <VerticalLine />}
        <CommentBlock level={level}>
          <CommentHeader>
            <Avatar>{comment.avatar}</Avatar>
            <UserInfo>
              <Username>{comment.author}</Username>
              <Timestamp>{comment.timestamp}</Timestamp>
            </UserInfo>
            <ActionIcons>
              <IconButton>#</IconButton>
              <IconButton>🔖</IconButton>
              <IconButton>⬆️</IconButton>
              <IconButton>⬇️</IconButton>
              <IconButton>🔄</IconButton>
              <VoteCounter>
                ↑{comment.likes}↓{comment.dislikes}
              </VoteCounter>
            </ActionIcons>
          </CommentHeader>
          
          <CommentContent>
            <CommentText>{comment.content}</CommentText>
            <ReplyButton onClick={() => handleReplyClick(comment)}>Ответить</ReplyButton>
          </CommentContent>
          
          {hasReplies && (
            <div className="replies">
              {comment.replies.map((reply) => (
                <div key={reply.id}>
                  {renderComment(reply, level + 1, true)}
                </div>
              ))}
            </div>
          )}
        </CommentBlock>
      </CommentWrapper>
    );
  };

  return (
    <HierarchicalContainer>
      <HierarchicalTitle variant="h6">Иерархические комментарии</HierarchicalTitle>
      {comments.map((comment) => renderComment(comment))}
      
      <AddCommentModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReplyToComment(null);
        }}
        onSubmit={handleAddComment}
        replyToComment={replyToComment}
      />
    </HierarchicalContainer>
  );
};
