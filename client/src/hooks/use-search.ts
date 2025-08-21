import { useQuery } from '@apollo/client';
import {
  SEARCH_COMMENTS,
  SEARCH_BY_CONTENT,
  SEARCH_BY_AUTHOR,
  SEARCH_BY_HOMEPAGE,
  GET_SUGGESTIONS,
  SearchCommentsData,
  SearchCommentsVars,
  SearchByContentData,
  SearchByContentVars,
  SearchByAuthorData,
  SearchByAuthorVars,
  SearchByHomepageData,
  SearchByHomepageVars,
  GetSuggestionsData,
  GetSuggestionsVars,
} from '@/graphql/schema';

// Хук для полнотекстового поиска
export const useSearchComments = (query: string, filters?: any) => {
  const { data, loading, error, refetch } = useQuery<
    SearchCommentsData,
    SearchCommentsVars
  >(SEARCH_COMMENTS, {
    variables: { query, filters },
    skip: !query || query.length < 2,
    fetchPolicy: 'cache-and-network',
  });

  return {
    comments: data?.searchComments || [],
    loading,
    error,
    refetch,
  };
};

// Хук для поиска по содержимому
export const useSearchByContent = (content: string) => {
  const { data, loading, error, refetch } = useQuery<
    SearchByContentData,
    SearchByContentVars
  >(SEARCH_BY_CONTENT, {
    variables: { content },
    skip: !content || content.length < 2,
    fetchPolicy: 'cache-and-network',
  });

  return {
    comments: data?.searchByContent || [],
    loading,
    error,
    refetch,
  };
};

// Хук для поиска по автору
export const useSearchByAuthor = (author: string) => {
  const { data, loading, error, refetch } = useQuery<
    SearchByAuthorData,
    SearchByAuthorVars
  >(SEARCH_BY_AUTHOR, {
    variables: { author },
    skip: !author || author.length < 2,
    fetchPolicy: 'cache-and-network',
  });

  return {
    comments: data?.searchByAuthor || [],
    loading,
    error,
    refetch,
  };
};

// Хук для поиска по HomePage
export const useSearchByHomepage = (homepage: string) => {
  const { data, loading, error, refetch } = useQuery<
    SearchByHomepageData,
    SearchByHomepageVars
  >(SEARCH_BY_HOMEPAGE, {
    variables: { homepage },
    skip: !homepage || homepage.length < 2,
    fetchPolicy: 'cache-and-network',
  });

  return {
    comments: data?.searchByHomepage || [],
    loading,
    error,
    refetch,
  };
};

// Хук для получения предложений автодополнения
export const useSuggestions = (query: string) => {
  const { data, loading, error, refetch } = useQuery<
    GetSuggestionsData,
    GetSuggestionsVars
  >(GET_SUGGESTIONS, {
    variables: { query },
    skip: !query || query.length < 1,
    fetchPolicy: 'cache-first',
  });

  return {
    suggestions: data?.getSuggestions || [],
    loading,
    error,
    refetch,
  };
};
