import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class ElasticsearchCommentsService {
  private readonly logger = new Logger(ElasticsearchCommentsService.name);
  private readonly index = 'comments';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex(): Promise<void> {
    try {
      const indexExists = await this.elasticsearchService.indices.exists({
        index: this.index,
      });

      if (!indexExists) {
        await this.elasticsearchService.indices.create({
          index: this.index,
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                author: { 
                  type: 'text',
                  analyzer: 'standard',
                  fields: {
                    keyword: { type: 'keyword' }
                  }
                },
                email: { type: 'keyword' },
                homepage: { 
                  type: 'text',
                  analyzer: 'standard',
                  fields: {
                    keyword: { type: 'keyword' }
                  }
                },
                content: { 
                  type: 'text',
                  analyzer: 'standard',
                  fields: {
                    keyword: { type: 'keyword' }
                  }
                },
                timestamp: { type: 'date' },
                level: { type: 'integer' },
                parent_id: { type: 'keyword' },
                created_at: { type: 'date' },
                updated_at: { type: 'date' }
              }
            },
            settings: {
              analysis: {
                analyzer: {
                  standard: {
                    type: 'standard',
                    stopwords: '_russian_'
                  }
                }
              }
            }
          }
        });
        this.logger.log(`Index ${this.index} created successfully`);
      }
    } catch (error) {
      this.logger.error(`Error creating index: ${error.message}`);
      throw error;
    }
  }

  async indexComment(comment: Comment): Promise<void> {
    try {
      await this.elasticsearchService.index({
        index: this.index,
        id: comment.id,
        body: {
          id: comment.id,
          author: comment.author,
          email: comment.email,
          homepage: comment.homepage,
          content: comment.content,
          timestamp: comment.timestamp,
          level: comment.level,
          parent_id: comment.parent_id,
          created_at: comment.created_at,
          updated_at: comment.updated_at
        }
      });
      this.logger.log(`Comment ${comment.id} indexed successfully`);
    } catch (error) {
      this.logger.error(`Error indexing comment: ${error.message}`);
      throw error;
    }
  }

  async updateComment(comment: Comment): Promise<void> {
    try {
      await this.elasticsearchService.update({
        index: this.index,
        id: comment.id,
        body: {
          doc: {
            author: comment.author,
            email: comment.email,
            homepage: comment.homepage,
            content: comment.content,
            timestamp: comment.timestamp,
            level: comment.level,
            parent_id: comment.parent_id,
            updated_at: comment.updated_at
          }
        }
      });
      this.logger.log(`Comment ${comment.id} updated successfully`);
    } catch (error) {
      this.logger.error(`Error updating comment: ${error.message}`);
      throw error;
    }
  }

  async deleteComment(id: string): Promise<void> {
    try {
      await this.elasticsearchService.delete({
        index: this.index,
        id
      });
      this.logger.log(`Comment ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Error deleting comment: ${error.message}`);
      throw error;
    }
  }

  async searchComments(query: string, filters?: any): Promise<any[]> {
    try {
      const searchBody: any = {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  fields: ['author^2', 'content^3', 'homepage'],
                  type: 'best_fields',
                  fuzziness: 'AUTO'
                }
              }
            ]
          }
        },
        highlight: {
          fields: {
            content: {},
            author: {}
          }
        },
        sort: [
          { _score: { order: 'desc' } },
          { created_at: { order: 'desc' } }
        ]
      };

      // Добавляем фильтры
      if (filters) {
        if (filters.level !== undefined) {
          searchBody.query.bool.filter = [
            { term: { level: filters.level } }
          ];
        }
        if (filters.author) {
          searchBody.query.bool.filter = [
            { term: { 'author.keyword': filters.author } }
          ];
        }
        if (filters.homepage) {
          searchBody.query.bool.filter = [
            { term: { 'homepage.keyword': filters.homepage } }
          ];
        }
      }

      const result = await this.elasticsearchService.search({
        index: this.index,
        body: searchBody
      });

      return result.hits.hits.map(hit => ({
        ...hit._source,
        score: hit._score,
        highlight: hit.highlight
      }));
    } catch (error) {
      this.logger.error(`Error searching comments: ${error.message}`);
      throw error;
    }
  }

  async searchByContent(content: string): Promise<any[]> {
    return this.searchComments(content, {});
  }

  async searchByAuthor(author: string): Promise<any[]> {
    try {
      const result = await this.elasticsearchService.search({
        index: this.index,
        body: {
          query: {
            term: { 'author.keyword': author }
          },
          sort: [{ created_at: { order: 'desc' } }]
        }
      });

      return result.hits.hits.map(hit => hit._source);
    } catch (error) {
      this.logger.error(`Error searching by author: ${error.message}`);
      throw error;
    }
  }

  async searchByHomepage(homepage: string): Promise<any[]> {
    try {
      const result = await this.elasticsearchService.search({
        index: this.index,
        body: {
          query: {
            term: { 'homepage.keyword': homepage }
          },
          sort: [{ created_at: { order: 'desc' } }]
        }
      });

      return result.hits.hits.map(hit => hit._source);
    } catch (error) {
      this.logger.error(`Error searching by homepage: ${error.message}`);
      throw error;
    }
  }

  async getSuggestions(query: string): Promise<string[]> {
    try {
      const result = await this.elasticsearchService.search({
        index: this.index,
        body: {
          suggest: {
            author_suggest: {
              prefix: query,
              completion: {
                field: 'author_suggest',
                size: 5
              }
            },
            content_suggest: {
              prefix: query,
              completion: {
                field: 'content_suggest',
                size: 5
              }
            }
          }
        }
      });

      const suggestions = new Set<string>();
      
      if (result.suggest?.author_suggest) {
        result.suggest.author_suggest.forEach((suggestion: any) => {
          suggestion.options.forEach((option: any) => {
            suggestions.add(option.text);
          });
        });
      }

      if (result.suggest?.content_suggest) {
        result.suggest.content_suggest.forEach((suggestion: any) => {
          suggestion.options.forEach((option: any) => {
            suggestions.add(option.text);
          });
        });
      }

      return Array.from(suggestions);
    } catch (error) {
      this.logger.error(`Error getting suggestions: ${error.message}`);
      return [];
    }
  }

  async bulkIndex(comments: Comment[]): Promise<void> {
    try {
      const operations = comments.flatMap(comment => [
        { index: { _index: this.index, _id: comment.id } },
        {
          id: comment.id,
          author: comment.author,
          email: comment.email,
          homepage: comment.homepage,
          content: comment.content,
          timestamp: comment.timestamp,
          level: comment.level,
          parent_id: comment.parent_id,
          created_at: comment.created_at,
          updated_at: comment.updated_at
        }
      ]);

      if (operations.length > 0) {
        await this.elasticsearchService.bulk({ body: operations });
        this.logger.log(`Bulk indexed ${comments.length} comments`);
      }
    } catch (error) {
      this.logger.error(`Error bulk indexing: ${error.message}`);
      throw error;
    }
  }
}
