// GraphQL типы для комментариев
export interface Comment {
  id: string;
  author: string;
  email: string;
  homepage?: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  level: number;
  replies: Comment[];
}

// Входные данные для создания комментария
export interface CreateCommentInput {
  author: string;
  email: string;
  homepage?: string;
  content: string;
}

// Входные данные для создания ответа
export interface CreateReplyInput {
  parentId: string;
  author: string;
  email: string;
  homepage?: string;
  content: string;
}

// GraphQL ответы
export interface GetCommentsData {
  comments: Comment[];
}

export interface GetCommentByHomepageData {
  commentByHomepage: Comment;
}

export interface GetCommentByHomepageVars {
  homepage: string;
}

export interface CreateCommentData {
  createComment: Comment;
}

export interface CreateCommentVars {
  input: CreateCommentInput;
}

export interface CreateReplyData {
  createReply: Comment;
}

export interface CreateReplyVars {
  input: CreateReplyInput;
}
