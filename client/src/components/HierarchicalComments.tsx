import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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
  TitleContainer,
} from './HierarchicalComments.styles';

interface HierarchicalCommentsProps {
  onAddComment?: (commentData: any) => void;
}

export const HierarchicalComments: React.FC<HierarchicalCommentsProps> = ({ onAddComment }) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);

  // Функция для безопасного рендеринга HTML тегов
  const renderHTMLContent = (content: string) => {
    // Разрешенные HTML теги
    const allowedTags = {
      'a': (props: any, children: any) => (
        <a 
          href={props.href} 
          title={props.title} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#3b82f6', textDecoration: 'underline' }}
        >
          {children}
        </a>
      ),
      'code': (props: any, children: any) => (
        <code style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '2px 4px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.9em'
        }}>
          {children}
        </code>
      ),
      'i': (props: any, children: any) => (
        <i style={{ fontStyle: 'italic' }}>{children}</i>
      ),
      'strong': (props: any, children: any) => (
        <strong style={{ fontWeight: 'bold' }}>{children}</strong>
      ),
    };

    // Простой парсер для разрешенных тегов
    const parseHTML = (text: string) => {
      const tagRegex = /<(\/?)(a|code|i|strong)([^>]*)>(.*?)<\/\2>/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = tagRegex.exec(text)) !== null) {
        const [fullMatch, isClosing, tagName, attributes, content] = match;
        
        if (isClosing) continue; // Пропускаем закрывающие теги
        
        // Добавляем текст до тега
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }

        // Парсим атрибуты для тега <a>
        let props: any = {};
        if (tagName === 'a') {
          const hrefMatch = attributes.match(/href="([^"]*)"/);
          const titleMatch = attributes.match(/title="([^"]*)"/);
          if (hrefMatch) props.href = hrefMatch[1];
          if (titleMatch) props.title = titleMatch[1];
        }

        // Рендерим тег
        const TagComponent = allowedTags[tagName as keyof typeof allowedTags];
        if (TagComponent) {
          parts.push(TagComponent(props, content));
        } else {
          parts.push(content); // Если тег не разрешен, показываем только содержимое
        }

        lastIndex = match.index + fullMatch.length;
      }

      // Добавляем оставшийся текст
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      return parts.length > 0 ? parts : [text];
    };

    return parseHTML(content);
  };

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
              <VoteCounter>
                ↑{comment.likes}↓{comment.dislikes}
              </VoteCounter>
            </ActionIcons>
          </CommentHeader>
          
          <CommentContent>
            <CommentText>
              {renderHTMLContent(comment.content)}
            </CommentText>
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
      <TitleContainer>
        <HierarchicalTitle variant="h6">Иерархические комментарии</HierarchicalTitle>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddMainComment}
          size="medium"
        >
          Добавить комментарий
        </Button>
      </TitleContainer>
      
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
