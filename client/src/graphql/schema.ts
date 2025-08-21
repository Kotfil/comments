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
    likes
    dislikes
    level
    replies {
      id
      author
      email
      homepage
      avatar
      content
      timestamp
      likes
      dislikes
      level
      replies {
        id
        author
        email
        homepage
        avatar
        content
        timestamp
        likes
        dislikes
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
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Мутация для создания ответа на комментарий
export const CREATE_REPLY = gql`
  mutation CreateReply($input: CreateReplyInput!) {
    createReply(input: $input) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;
