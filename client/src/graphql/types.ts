// GraphQL типы для комментариев
export interface Comment {
  id: string;
  author: string;
  email: string;
  homepage?: string;
  avatar: string;
  content: string;
  timestamp: string;
  level: number;
  replies?: Comment[];
}

// Входные данные для создания комментария (соответствует CreateCommentDto на сервере)
export interface CreateCommentDto {
  author: string;
  email: string;
  homepage?: string;
  content: string;
}

// Входные данные для создания ответа (соответствует CreateReplyDto на сервере)
export interface CreateReplyDto {
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
  input: CreateCommentDto;
}

export interface CreateReplyData {
  createReply: Comment;
}

export interface CreateReplyVars {
  input: CreateReplyDto;
}

// Поисковые типы
export interface SearchCommentsData {
  searchComments: (Comment & {
    score?: number;
    highlight?: {
      content?: string[];
      author?: string[];
    };
  })[];
}

export interface SearchCommentsVars {
  query: string;
  filters?: any;
}

export interface SearchByContentData {
  searchByContent: (Comment & { score?: number })[];
}

export interface SearchByContentVars {
  content: string;
}

export interface SearchByAuthorData {
  searchByAuthor: Comment[];
}

export interface SearchByAuthorVars {
  author: string;
}

export interface SearchByHomepageData {
  searchByHomepage: Comment[];
}

export interface SearchByHomepageVars {
  homepage: string;
}

export interface GetSuggestionsData {
  getSuggestions: string[];
}

export interface GetSuggestionsVars {
  query: string;
}
