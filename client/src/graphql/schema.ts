import { gql } from '@apollo/client';

// GraphQL схема для комментариев
export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    author
    email
    homepage
    avatar
    content
    timestamp
    level
    replies {
      id
      author
      email
      homepage
      avatar
      content
      timestamp
      level
      replies {
        id
        author
        email
        homepage
        avatar
        content
        timestamp
        level
      }
    }
  }
`;

// Запрос для получения всех комментариев
export const GET_COMMENTS = gql`
  query GetComments {
    comments {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Запрос для получения комментария по HomePage
export const GET_COMMENT_BY_HOMEPAGE = gql`
  query GetCommentByHomepage($homepage: String!) {
    commentByHomepage(homepage: $homepage) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Мутация для создания комментария
export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentDto!) {
    createComment(input: $input) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Мутация для создания ответа на комментарий
export const CREATE_REPLY = gql`
  mutation CreateReply($input: CreateReplyDto!) {
    createReply(input: $input) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Поиск комментариев
export const SEARCH_COMMENTS = gql`
  query SearchComments($query: String!, $filters: JSON) {
    searchComments(query: $query, filters: $filters) {
      id
      author
      email
      homepage
      avatar
      content
      timestamp
      level
      score
      highlight {
        content
        author
      }
    }
  }
`;

// Поиск по содержимому
export const SEARCH_BY_CONTENT = gql`
  query SearchByContent($content: String!) {
    searchByContent(content: $content) {
      id
      author
      content
      timestamp
      score
    }
  }
`;

// Поиск по автору
export const SEARCH_BY_AUTHOR = gql`
  query SearchByAuthor($author: String!) {
    searchByAuthor(author: $author) {
      id
      author
      content
      timestamp
    }
  }
`;

// Поиск по HomePage
export const SEARCH_BY_HOMEPAGE = gql`
  query SearchByHomepage($homepage: String!) {
    searchByHomepage(homepage: $homepage) {
      id
      author
      content
      homepage
      timestamp
    }
  }
`;

// Получение предложений для автодополнения
export const GET_SUGGESTIONS = gql`
  query GetSuggestions($query: String!) {
    getSuggestions(query: $query)
  }
`;
